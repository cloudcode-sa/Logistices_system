import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, throwError } from 'rxjs';
import { Shipment } from '../inerface/shipment';
import { supabase } from '../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  getShipments(): Observable<Shipment[]> {
    return from(supabase.from('shipments').select('*')).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return (res.data ?? []) as Shipment[];
      }),
      catchError(err => throwError(() => err))
    );
  }

  addShipment(shipment: Partial<Shipment>): Observable<Shipment> {
    return from(
      supabase.from('shipments').insert([shipment]).select()
    ).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return res.data[0] as Shipment;
      }),
      catchError(err => throwError(() => err))
    );
  }
}
