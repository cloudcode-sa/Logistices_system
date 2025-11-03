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
   // data
  recentOrder: Shipment[] = [];
  loading = false;
  error: string | null = null;

  // inline dropdown state (for each row)
  inlineDropdownOpenId: number | null = null;
  selectedInlineStatus: string | null = null;
  inlineError: string | null = null;
  inlineSuccess: string | null = null;
  inlineForId: number | null = null;

  // NOTE: modalShipment is partial because we copy row data that may not include all required fields
  modalShipment: Partial<Shipment> | null = null;
  modalSelectedStatus: string | null = null;
  modalSaving = false;

  // i18n
  languageService = inject(LanguageService);
  toggleLanguage() { this.languageService.toggleLanguage(); }
  get currentLang() { return this.languageService.currentLang(); }

  // messages UI
  addError: string | null = null;
  addSuccess: string | null = null;

  // operation states
  deletingId: number | null = null;
  updatingId: number | null = null;
  updatingStatusId: number | null = null;

  // edit modal
  showEditModal = false;
  editingShipment: Partial<Shipment> | null = null;
  editingSaving = false;

  // legacy modal flag
  statusModalVisible = false;

  // status options
  statusOptions = [
    { key: 'pending' },
    { key: 'shipped' },
    { key: 'in_transit' },
    { key: 'arrived_at_port' },
    { key: 'received_in_china' },
    { key: 'delivered' }
  ];

  private subs = new Subscription();
  private shipmentSvc = inject(ShipmentService);

  ngOnInit(): void {
    this.loadRecent();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // -----------------------
  // data load & helpers
  // -----------------------
  loadRecent(): void {
    this.loading = true;
    this.error = null;
    const s = this.shipmentSvc.getShipments().subscribe({
      next: (data) => {
        this.recentOrder = (data || []).sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ).slice(0, 50);
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

  formatMoney(val: number | null | undefined): string {
    if (val == null) return '-';
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  trackById(index: number, item: Shipment) {
    return item.id ?? index;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private hasValue(v: any): boolean {
    return v !== null && v !== undefined && String(v).trim() !== '';
  }

  // -----------------------
  // delete / edit row
  // -----------------------
  deleteShipment(shipment: Shipment) {
    if (!shipment.id) return;
    const confirmed = confirm(`هل أنت متأكد من حذف الشحنة ${shipment.shipment_number || shipment.id}?`);
    if (!confirmed) return;

    this.deletingId = shipment.id;
    this.addError = null;
    this.addSuccess = null;

    const s = this.shipmentSvc.deleteShipment(shipment.id).subscribe({
      next: () => {
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

  openEdit(shipment: Shipment) {
    this.addError = null;
    this.addSuccess = null;
    this.editingShipment = { ...shipment };
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.editingShipment = null;
    this.editingSaving = false;
  }

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

  // -----------------------
  // inline Bootstrap dropdown handlers
  // -----------------------
  toggleInlineDropdown(shipment: Shipment, event?: MouseEvent) {
    event?.stopPropagation();
    if (this.inlineDropdownOpenId === shipment.id) {
      this.closeInlineDropdown();
      return;
    }
    this.inlineDropdownOpenId = shipment.id ?? null;
    this.selectedInlineStatus = shipment.shipment_status ?? null;
    this.inlineError = null;
    this.inlineSuccess = null;
    this.inlineForId = shipment.id ?? null;

    // keep modalShipment as partial copy
    this.modalShipment = { ...shipment };
    this.modalSelectedStatus = shipment.shipment_status ?? null;
  }

  closeInlineDropdown() {
    this.inlineDropdownOpenId = null;
    this.selectedInlineStatus = null;
    this.inlineError = null;
    this.inlineSuccess = null;
    this.inlineForId = null;
    this.modalShipment = null;
    this.modalSelectedStatus = null;
    this.modalSaving = false;
  }

  selectInlineStatus(shipment: Shipment, key: string) {
    this.selectedInlineStatus = key;
    this.modalShipment = { ...(shipment || {}) };
    this.modalSelectedStatus = key;
  }

  confirmInlineStatusUpdate(shipment: Shipment) {
    if (!shipment.id || !this.selectedInlineStatus) return;
    if (this.selectedInlineStatus === shipment.shipment_status) {
      this.closeInlineDropdown();
      return;
    }

    this.updatingStatusId = shipment.id;
    this.inlineError = null;
    this.inlineSuccess = null;

    const payload: Partial<Shipment> = { shipment_status: this.selectedInlineStatus };

    const sub = this.shipmentSvc.updateShipment(shipment.id, payload).subscribe({
      next: (updated) => {
        this.recentOrder = this.recentOrder.map(r => r.id === updated.id ? updated : r);
        this.inlineSuccess = this.currentLang === 'ar'
          ? `تم تحديث حالة الشحنة (ID: ${updated.id})`
          : `Shipment status updated (ID: ${updated.id})`;
        this.inlineForId = shipment.id ?? null;
        this.updatingStatusId = null;
        setTimeout(() => this.closeInlineDropdown(), 900);
      },
      error: (err) => {
        console.error('Update inline status failed', err);
        this.inlineError = (err?.message) ? `فشل تحديث الحالة: ${err.message}` : `Update failed`;
        this.updatingStatusId = null;
      }
    });

    this.subs.add(sub);
  }

  // -----------------------
  // modal compatibility (redirects)
  // -----------------------
  openStatusModal(shipment: Shipment) {
    this.toggleInlineDropdown(shipment);
  }

  closeStatusModal() {
    this.closeInlineDropdown();
  }

  confirmStatusUpdate() {
    if (!this.modalShipment?.id || !this.modalSelectedStatus) return;
    if (this.modalShipment.shipment_status === this.modalSelectedStatus) {
      this.closeStatusModal();
      return;
    }

    this.modalSaving = true;
    this.addError = null;
    this.addSuccess = null;
    this.updatingStatusId = this.modalShipment.id as number;

    const payload: Partial<Shipment> = { shipment_status: this.modalSelectedStatus };

    const s = this.shipmentSvc.updateShipment(this.modalShipment.id as number, payload).subscribe({
      next: (res) => {
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

  // -----------------------
  // labels & badge helpers
  // -----------------------
  normalizeType(raw?: string | null): 'air' | 'sea' {
    const t = String(raw ?? 'sea').trim().toLowerCase();
    return t === 'air' ? 'air' : 'sea';
  }

  getStatusLabel(status: string | null | undefined, shipment?: Partial<Shipment>): string {
    const lang = this.currentLang;
    const type = this.normalizeType(shipment?.shipment_type);

    switch (String(status)) {
      case 'pending': return lang === 'ar' ? 'قيد الانتظار' : 'Pending';
      case 'shipped': return lang === 'ar' ? 'تم الشحن' : 'Shipped';
      case 'in_transit':
        return lang === 'ar'
          ? (type === 'air' ? 'في الهواء' : 'في البحر')
          : (type === 'air' ? 'In Transit (Air)' : 'In Transit (Sea)');
      case 'arrived_at_port': return lang === 'ar' ? 'وصلت الشحنة للميناء' : 'Arrived at Port';
      case 'received_in_china': return lang === 'ar' ? 'تم الاستلام في الصين' : 'Received in China';
      case 'delivered': return lang === 'ar' ? 'تم تسليم الشحنة للعميل' : 'Delivered to Customer';
      default: return status ? String(status) : (lang === 'ar' ? '-' : '-');
    }
  }

  getStatusBadgeClasses(status: string | null | undefined): { [klass: string]: boolean } {
    const s = String(status);
    return {
      'bg-warning text-dark': s === 'pending',
      'bg-info text-dark': s === 'shipped',
      'bg-primary text-white': s === 'in_transit',
      'bg-secondary text-white': s === 'arrived_at_port',
      'bg-success text-white': s === 'received_in_china',
      'bg-dark text-white': s === 'delivered',
      'bg-light text-dark': !(s === 'pending' || s === 'shipped' || s === 'in_transit' || s === 'arrived_at_port' || s === 'received_in_china' || s === 'delivered')
    };
  }

  getStatusBadgeClass(status: string | null | undefined): string {
    const s = String(status);
    switch (s) {
      case 'pending': return 'bg-warning text-dark';
      case 'shipped': return 'bg-info text-dark';
      case 'in_transit': return 'bg-primary text-white';
      case 'arrived_at_port': return 'bg-secondary text-white';
      case 'received_in_china': return 'bg-success text-white';
      case 'delivered': return 'bg-dark text-white';
      default: return 'bg-light text-dark';
    }
  }
  
}
