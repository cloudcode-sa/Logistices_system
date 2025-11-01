import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, throwError } from 'rxjs';
import { Shipment } from '../inerface/shipment';
import { supabase } from '../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  getShipments(): Observable<Shipment[]> {
    // استعلام بسيط: جلب كل الشحنات (يمكن تحسين بالـ pagination لاحقًا)
    return from(supabase.from('shipments').select('*')).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((res: any) => {
        if (res.error) throw res.error;
        return (res.data ?? []) as Shipment[];
      }),
      catchError(err => throwError(() => err))
    );
  }

  addShipment(shipment: Partial<Shipment>): Observable<Shipment> {
    // نستخدم select().single() للحصول على الصف المدخّل مباشرة
    return from(supabase.from('shipments').insert([shipment]).select().single()).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((res: any) => {
        console.log('Supabase insert response:', res); // debug
        if (res.error) throw res.error;
        return res.data as Shipment;
      }),
      catchError(err => {
        console.error('ShipmentService.addShipment error:', err);
        return throwError(() => err);
      })
    );
  }
}
