// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import

import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import {  IconDirective } from '@ant-design/icons-angular';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { Shipment } from 'src/app/inerface/shipment';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShipmentService } from 'src/app/service/shipment-service';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent,
    FormsModule
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  recentOrder: Shipment[] = [];
  loading = false;
  error: string | null = null;

newShipment: Partial<Shipment> = {
  shipment_number: '',
  shipment_type: 'sea',  
  shipment_status: 'pending',
  expected_arrival_date: '',
  total_cartons: 0,
  total_cost: 0,
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

addShipment(form: NgForm) {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  // إعداد البايلود
  const payload: Partial<Shipment> = {
    shipment_number: String(this.newShipment.shipment_number).trim(),
    shipment_type: String(this.newShipment.shipment_type),
    shipment_status: String(this.newShipment.shipment_status),
    expected_arrival_date: this.newShipment.expected_arrival_date || null,
    total_cartons: Number(this.newShipment.total_cartons) || 0,
    total_cost: Number(this.newShipment.total_cost) || 0,
    // التحقق من النوع: air يحتاج وزن، sea يحتاج حجم
    total_cbm: this.newShipment.shipment_type === 'sea' ? Number(this.newShipment.total_cbm) || 0 : null,
    total_weight: this.newShipment.shipment_type === 'air' ? Number(this.newShipment.total_weight) || 0 : null
  };

  this.adding = true;
  this.addError = null;
  this.addSuccess = null;

  this.shipmentSvc.addShipment(payload).subscribe({
    next: (inserted) => {
      this.recentOrder.unshift(inserted);
      this.addSuccess = `تمت الإضافة بنجاح (ID: ${inserted.id})`;
      form.resetForm({
        shipment_type: 'sea',
        shipment_status: 'pending',
        total_cartons: 0,
        total_cost: 0
      });
      this.adding = false;
    },
    error: (err) => {
      console.error(err);
      this.addError = 'فشل إضافة الشحنة. تأكد من القيم المطلوبة لكل نوع.';
      this.adding = false;
    }
  });
}


  formatMoney(val: number | null | undefined): string {
    if (val == null) return '-';
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  trackById(index: number, item: Shipment) {
    return item.id ?? index;
  }


































































}
