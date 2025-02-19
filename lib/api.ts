import { supabase } from './supabase';
import type { Property, ScanRecord, User } from '@/types/supabase';

// 标的相关操作
export const propertyApi = {
  async getBySerialNumber(serialNumber: string) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        insurance_policies (*),
        maintenance_records (*)
      `)
      .eq('serial_number', serialNumber)
      .single();

    if (error) throw error;
    return data as Property & {
      property_images: any[];
      insurance_policies: any[];
      maintenance_records: any[];
    };
  },

  async create(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// 扫描记录相关操作
export const scanApi = {
  async create(record: Omit<ScanRecord, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('scan_records')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getHistory() {
    const { data, error } = await supabase
      .from('scan_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// 用户相关操作
export const userApi = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data as User;
  },

  async updateProfile(updates: Partial<User>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
}; 