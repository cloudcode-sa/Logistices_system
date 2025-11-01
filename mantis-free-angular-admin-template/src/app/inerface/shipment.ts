// src/app/interface/shipment.ts
export interface Shipment {
  id?: number;
  created_at?: string;
  shipment_number: string;
  shipment_status: string;
  shipment_type: string;
  expected_arrival_date: string | null;
  total_cartons: number;
  total_cost: number;
  total_cbm: number | null;
  total_weight: number | null;
}
