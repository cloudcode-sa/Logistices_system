export interface Shipment {
  id?: number;
  created_at?: string; // timestamp
  user_id?: string; // uuid from auth.users
  shipment_number: string;
  shipment_status: 'pending' | 'shipped' | 'received_in_china' | string;
  shipment_type: 'sea' | 'air' | string;
  expected_arrival_date?: string | null; // ISO date string or null
  total_cartons?: number | null;
  total_cost?: number | null;
  total_cbm?: number | null;     // for sea (m^3)
  total_weight?: number | null;  // for air (kg)
}
