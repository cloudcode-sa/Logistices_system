import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Shipment } from 'src/app/inerface/shipment';
import { ShipmentService } from 'src/app/service/shipment-service';
import { supabase } from 'src/app/supabase.config';

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

}
