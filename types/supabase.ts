export interface Property {
  id: string;
  serial_number: string;
  name: string;
  description?: string;
  category?: string;
  purchase_date?: string;
  purchase_value?: number;
  current_value?: number;
  location?: string;
  status: 'active' | 'inactive' | 'archived';
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface ScanRecord {
  id: string;
  property_id?: string;
  serial_number: string;
  scan_type: 'NFC' | 'QR';
  success: boolean;
  error_message?: string;
  duration?: number;
  device_info?: any;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface UserProperty {
  user_id: string;
  property_id: string;
  access_level: 'view' | 'edit' | 'admin';
  created_at: string;
}

export interface InsurancePolicy {
  id: string;
  property_id: string;
  policy_number: string;
  insurer: string;
  coverage_amount: number;
  start_date: string;
  end_date: string;
  premium?: number;
  status?: string;
  created_at: string;
  updated_at: string;
} 