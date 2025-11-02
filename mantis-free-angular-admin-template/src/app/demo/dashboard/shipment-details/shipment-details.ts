import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgForm,FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Shipment } from 'src/app/inerface/shipment';
import { LanguageService } from 'src/app/service/language-service';
import { ShipmentService } from 'src/app/service/shipment-service';

@Component({
  selector: 'app-shipment-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './shipment-details.html',
  styleUrl: './shipment-details.scss'
})
export class ShipmentDetails {
  recentOrder: Shipment[] = [];
  loading = false;
  error: string | null = null;
 languageService = inject(LanguageService);
   toggleLanguage() {
      this.languageService.toggleLanguage();
    }
  
    get currentLang() {
      return this.languageService.currentLang();
    }
  // رسائل عامة UI
  addError: string | null = null;
  addSuccess: string | null = null;

  // حالات عمليات (spinners/disabled)
  deletingId: number | null = null;
  updatingId: number | null = null;
  updatingStatusId: number | null = null;

  // مودال التعديل
  showEditModal = false;
  editingShipment: Partial<Shipment> | null = null;
  editingSaving = false;

  // مودال الحالة
  statusModalVisible = false;
  modalShipment: Shipment | null = null;
  modalSelectedStatus: string | null = null;
  modalSaving = false;

  // خيارات الحالة
  statusOptions = [
    { key: 'pending', label: 'Pending' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'received_in_china', label: 'Received in China' }
  ];

  private subs = new Subscription();
  private shipmentSvc = inject(ShipmentService);

  ngOnInit(): void {
    this.loadRecent();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // تحميل الشحنات الأخيرة
  loadRecent(): void {
    this.loading = true;
    this.error = null;
    const s = this.shipmentSvc.getShipments().subscribe({
      next: (data) => {
        this.recentOrder = (data || []).sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ).slice(0, 50); // خذ 50 للأمان أو عدّل حسب الحاجة
        this.loading = false;
      },
      error: (err) => {
        console.error('Load shipments error', err);
        this.error = 'فشل تحميل الشحنات.';
        this.loading = false;
      }
    });
    this.subs.add(s);
  }

  // تنسيق المال
  formatMoney(val: number | null | undefined): string {
    if (val == null) return '-';
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // trackBy لتحسين الأداء
  trackById(index: number, item: Shipment) {
    return item.id ?? index;
  }

  // utils
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private hasValue(v: any): boolean {
    return v !== null && v !== undefined && String(v).trim() !== '';
  }

  // حذف شحنة
  deleteShipment(shipment: Shipment) {
    if (!shipment.id) return;
    const confirmed = confirm(`هل أنت متأكد من حذف الشحنة ${shipment.shipment_number || shipment.id}?`);
    if (!confirmed) return;

    this.deletingId = shipment.id;
    this.addError = null;
    this.addSuccess = null;

    const s = this.shipmentSvc.deleteShipment(shipment.id).subscribe({
      next: () => {
        // إزالة محلياً
        this.recentOrder = this.recentOrder.filter(s2 => s2.id !== shipment.id);
        this.addSuccess = `تم حذف الشحنة (${shipment.shipment_number || shipment.id})`;
        this.deletingId = null;
      },
      error: (err) => {
        console.error('Delete shipment failed:', err);
        const msg = err?.message || JSON.stringify(err);
        this.addError = `فشل حذف الشحنة: ${msg}`;
        this.deletingId = null;
      }
    });

    this.subs.add(s);
  }

  // فتح مودال التعديل - نعمل نسخة من البيانات
  openEdit(shipment: Shipment) {
    this.addError = null;
    this.addSuccess = null;
    this.editingShipment = { ...shipment }; // shallow copy
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.editingShipment = null;
    this.editingSaving = false;
  }

  // حفظ التعديلات من المودال
  saveEdit(form: NgForm) {
    if (!this.editingShipment || !this.editingShipment.id) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.editingSaving = true;
    this.addError = null;
    this.addSuccess = null;
    this.updatingId = this.editingShipment.id;

    const updates: Partial<Shipment> = {
      shipment_number: String(this.editingShipment.shipment_number ?? '').trim(),
      shipment_type: String(this.editingShipment.shipment_type ?? 'sea'),
      shipment_status: String(this.editingShipment.shipment_status ?? 'pending'),
      expected_arrival_date: this.hasValue(this.editingShipment.expected_arrival_date)
        ? String(this.editingShipment.expected_arrival_date)
        : null,
      total_cartons: this.hasValue(this.editingShipment.total_cartons)
        ? Number(this.editingShipment.total_cartons)
        : null,
      total_cost: this.hasValue(this.editingShipment.total_cost)
        ? parseFloat(String(this.editingShipment.total_cost))
        : null,
      total_cbm: (this.editingShipment.shipment_type === 'sea' && this.hasValue(this.editingShipment.total_cbm))
        ? parseFloat(String(this.editingShipment.total_cbm))
        : null,
      total_weight: (this.editingShipment.shipment_type === 'air' && this.hasValue(this.editingShipment.total_weight))
        ? parseFloat(String(this.editingShipment.total_weight))
        : null
    };

    const id = this.editingShipment.id;

    const s = this.shipmentSvc.updateShipment(id, updates).subscribe({
      next: (updated) => {
        // حدّث المصفوفة محلياً
        this.recentOrder = this.recentOrder.map(r => r.id === updated.id ? updated : r);
        this.addSuccess = `تم تحديث الشحنة (ID: ${updated.id})`;
        this.editingSaving = false;
        this.updatingId = null;
        this.closeEdit();
      },
      error: (err) => {
        console.error('Update failed:', err);
        const msg = err?.message || JSON.stringify(err);
        this.addError = `فشل تحديث الشحنة: ${msg}`;
        this.editingSaving = false;
        this.updatingId = null;
      }
    });

    this.subs.add(s);
  }

  // فتح مودال تغيير الحالة
  openStatusModal(shipment: Shipment) {
    this.addError = null;
    this.addSuccess = null;
    this.modalShipment = { ...shipment };
    this.modalSelectedStatus = shipment.shipment_status ?? null;
    this.statusModalVisible = true;
  }

  closeStatusModal() {
    this.statusModalVisible = false;
    this.modalShipment = null;
    this.modalSelectedStatus = null;
    this.modalSaving = false;
  }

  // حفظ تعديل الحالة من المودال
  confirmStatusUpdate() {
    if (!this.modalShipment?.id || !this.modalSelectedStatus) return;
    if (this.modalShipment.shipment_status === this.modalSelectedStatus) {
      this.closeStatusModal();
      return;
    }

    this.modalSaving = true;
    this.addError = null;
    this.addSuccess = null;
    this.updatingStatusId = this.modalShipment.id;

    const payload: Partial<Shipment> = { shipment_status: this.modalSelectedStatus };

    const s = this.shipmentSvc.updateShipment(this.modalShipment.id, payload).subscribe({
      next: (res) => {
        // تحديث محلي
        this.recentOrder = this.recentOrder.map(r => r.id === res.id ? res : r);
        this.addSuccess = `تم تحديث حالة الشحنة (ID: ${res.id})`;
        this.modalSaving = false;
        this.updatingStatusId = null;
        this.closeStatusModal();
      },
      error: (err) => {
        console.error('Update status failed', err);
        this.addError = `فشل تحديث الحالة: ${err?.message || JSON.stringify(err)}`;
        this.modalSaving = false;
        this.updatingStatusId = null;
      }
    });

    this.subs.add(s);
  }
  
}
