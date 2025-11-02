import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Shipment } from 'src/app/inerface/shipment';
import { ShipmentService } from 'src/app/service/shipment-service';
import { supabase } from 'src/app/supabase.config';
import { LanguageService } from 'src/app/service/language-service';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {
   languageService = inject(LanguageService);
     toggleLanguage() {
        this.languageService.toggleLanguage();
      }
    
      get currentLang() {
        return this.languageService.currentLang();
      }
  currentStep = 1;

nextStep() {
  this.currentStep = 2;
}

prevStep() {
  this.currentStep = 1;
}

  recentOrder: Shipment[] = [];
  loading = false;
  error: string | null = null;

  newShipment: Partial<Shipment> = {
    shipment_number: '',
    shipment_type: 'sea',
    shipment_status: 'pending',
    expected_arrival_date: null,
    total_cartons: null,
    total_cost: null,
    total_cbm: null,
    total_weight: null
  };

  adding = false;
  addSuccess: string | null = null;
  addError: string | null = null;

  private subs = new Subscription();
  private shipmentSvc = inject(ShipmentService);


   
  ngOnInit(): void {
    this.loadRecent();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private hasValue(v: any): boolean {
    return v !== null && v !== undefined && String(v).trim() !== '';
  }

  async addShipment(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.adding = true;
    this.addError = null;
    this.addSuccess = null;

    const userResp = await supabase.auth.getUser();
    const user = userResp?.data?.user;
    if (!user) {
      this.addError = 'يجب تسجيل الدخول قبل إضافة شحنة.';
      this.adding = false;
      return;
    }

    const shipmentType = String(this.newShipment.shipment_type ?? 'sea');

    const payload: Partial<Shipment> = {
      shipment_number: String(this.newShipment.shipment_number ?? '').trim(),
      shipment_type: shipmentType,
      shipment_status: String(this.newShipment.shipment_status ?? 'pending'),
      expected_arrival_date: (this.hasValue(this.newShipment.expected_arrival_date))
        ? String(this.newShipment.expected_arrival_date)
        : null,
      total_cartons: this.hasValue(this.newShipment.total_cartons)
        ? Number(this.newShipment.total_cartons)
        : null,
      total_cost: this.hasValue(this.newShipment.total_cost)
        ? parseFloat(String(this.newShipment.total_cost))
        : null,
      total_cbm: shipmentType === 'sea'
        ? (this.hasValue(this.newShipment.total_cbm)
            ? parseFloat(String(this.newShipment.total_cbm))
            : null)
        : null,
      total_weight: shipmentType === 'air'
        ? (this.hasValue(this.newShipment.total_weight)
            ? parseFloat(String(this.newShipment.total_weight))
            : null)
        : null,
      user_id: user.id
    };

    console.log('Inserting shipment payload:', payload);

    const s = this.shipmentSvc.addShipment(payload).subscribe({
      next: (inserted) => {
        console.log('Inserted shipment:', inserted);
        if (inserted) {
          this.recentOrder.unshift(inserted);
          this.addSuccess = `تمت الإضافة بنجاح (ID: ${inserted.id})`;
          this.newShipment = {
            shipment_number: '',
            shipment_type: 'sea',
            shipment_status: 'pending',
            expected_arrival_date: null,
            total_cartons: null,
            total_cost: null,
            total_cbm: null,
            total_weight: null
          };
          form.resetForm({
            shipment_type: 'sea',
            shipment_status: 'pending',
            total_cartons: null,
            total_cost: null
          });
        } else {
          this.addError = 'لم يعد أي سجل بعد الإدخال.';
        }
        this.adding = false;
      },
      error: (err) => {
        console.error('Add shipment failed:', err);
        const msg = err?.message || err?.error_description || JSON.stringify(err);
        this.addError = `فشل إضافة الشحنة: ${msg}`;
        this.adding = false;
      }
    });

    this.subs.add(s);
  }

  loadRecent(): void {
    this.loading = true;
    this.error = null;
    const s = this.shipmentSvc.getShipments().subscribe({
      next: (data) => {
        this.recentOrder = (data || []).sort(
          (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ).slice(0, 10);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
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

  // داخل DefaultComponent class (بعد المتغيرات الموجودة)
deletingId: number | null = null; // لتتبع حالة حذف صف معين

// دالة لحذف الشحنة مع تأكيد
deleteShipment(shipment: Shipment) {
  if (!shipment.id) return;

  const confirmed = confirm(`هل أنت متأكد من حذف الشحنة ${shipment.shipment_number || shipment.id}?`);
  if (!confirmed) return;

  this.deletingId = shipment.id;
  this.addError = null;
  this.addSuccess = null;

  const s = this.shipmentSvc.deleteShipment(shipment.id).subscribe({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: (deleted) => {

      this.recentOrder = this.recentOrder.filter(s => s.id !== shipment.id);
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
// داخل DefaultComponent
updatingId: number | null = null;

quickEdit(shipment: Shipment) {
  if (!shipment.id) return;
  const newNumber = prompt('New shipment number:', shipment.shipment_number || '');
  if (newNumber === null) return; // user cancelled

  const newCostStr = prompt('New total cost:', shipment.total_cost?.toString() ?? '');
  if (newCostStr === null) return;

  const updates: Partial<Shipment> = {
    shipment_number: newNumber.trim(),
    total_cost: newCostStr === '' ? null : parseFloat(newCostStr)
  };

  this.updatingId = shipment.id;
  const s = this.shipmentSvc.updateShipment(shipment.id, updates).subscribe({
    next: (updated) => {
      // استبدال العنصر في recentOrder
      this.recentOrder = this.recentOrder.map(r => r.id === updated.id ? updated : r);
      this.addSuccess = `تم تحديث الشحنة (ID: ${updated.id})`;
      this.updatingId = null;
    },
    error: (err) => {
      console.error('Update failed:', err);
      const msg = err?.message || JSON.stringify(err);
      this.addError = `فشل تحديث الشحنة: ${msg}`;
      this.updatingId = null;
    }
  });
  this.subs.add(s);
}
// داخل DefaultComponent (متغيرات)
showEditModal = false;
editingShipment: Partial<Shipment> | null = null;
editingSaving = false;

// افتح المودال واستنسخ البيانات لتعكسها في الفورم بدون تغيير الأصل مباشرة
openEdit(shipment: Shipment) {
  this.addError = null;
  this.addSuccess = null;
  this.editingShipment = { ...shipment }; // shallow copy
  this.showEditModal = true;
}

// غلق المودال
closeEdit() {
  this.showEditModal = false;
  this.editingShipment = null;
  this.editingSaving = false;
}

// حفظ التعديلات
saveEdit(form: NgForm) {
  if (!this.editingShipment || !this.editingShipment.id) return;

  // تحقق من صلاحية الفورم
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  this.editingSaving = true;
  this.addError = null;
  this.addSuccess = null;
  this.updatingId = this.editingShipment.id; // لتعطيل الزر في الصف إذا رغبت

  // جهّز التحديث (أرسل فقط الحقول التي تريد تعديلها)
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
      // حدّث المصفوفة locally
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

updatingStatusId: number | null = null;

updateStatus(shipment: Shipment, newStatus: string) {
  if (!shipment.id || shipment.shipment_status === newStatus) return;

  this.updatingStatusId = shipment.id;
  this.addError = null;
  this.addSuccess = null;

  const payload: Partial<Shipment> = { shipment_status: newStatus };

  const s = this.shipmentSvc.updateShipment(shipment.id, payload).subscribe({
    next: (res) => {
      // تحديث القائمة فورًا
      this.recentOrder = this.recentOrder.map(r => r.id === res.id ? res : r);
      this.addSuccess = `تم تحديث حالة الشحنة (ID: ${res.id})`;
      this.updatingStatusId = null;
    },
    error: (err) => {
      console.error('Update status failed', err);
      this.addError = `فشل تحديث الحالة: ${err?.message || JSON.stringify(err)}`;
      this.updatingStatusId = null;
    }
  });

  this.subs.add(s);
}
// state للمودال
statusModalVisible = false;
modalShipment: Shipment | null = null;
modalSelectedStatus: string | null = null;
modalSaving = false;

// خيارات الحالات (غير الليبل لو عايز عربي/إنجليزي مختلف)
statusOptions = [
  { key: 'pending', label: 'Pending' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'received_in_china', label: 'Received in China' }
];

// فتح المودال - نعمل shallow copy لو حابب
openStatusModal(shipment: Shipment) {
  this.addError = null;
  this.addSuccess = null;
  this.modalShipment = { ...shipment }; // نسخة لتحريرها بدون تغيير الأصل
  this.modalSelectedStatus = shipment.shipment_status ?? null;
  this.statusModalVisible = true;
}

// غلق المودال
closeStatusModal() {
  this.statusModalVisible = false;
  this.modalShipment = null;
  this.modalSelectedStatus = null;
  this.modalSaving = false;
}

// دالة حفظ التعديل من داخل المودال (تستعمل نفس الـ service)
confirmStatusUpdate() {
  if (!this.modalShipment?.id || !this.modalSelectedStatus) return;
  if (this.modalShipment.shipment_status === this.modalSelectedStatus) {
    // مفيش تغيير
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
      // حدث القائمة محليًا
      this.recentOrder = this.recentOrder.map(r => r.id === res.id ? res : r);
      this.addSuccess = `تم تحديث حالة الشحنة (ID: ${res.id})`;
      this.modalSaving = false;
      this.updatingStatusId = null;
      this.closeStatusModal();
    },
    error: (err) => {
      console.error('Update status from modal failed', err);
      this.addError = `فشل تحديث الحالة: ${err?.message || JSON.stringify(err)}`;
      this.modalSaving = false;
      this.updatingStatusId = null;
    }
  });

  this.subs.add(s);
}

}
