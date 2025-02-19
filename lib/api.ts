import { supabase } from './supabase';
import type { Property, ScanRecord, User, PropertyFormData, PropertyMetadata } from '@/types/supabase';

// 自定义错误类
export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// 标的相关操作
export const propertyApi = {
  async getBySerialNumber(serialNumber: string): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (id, url, is_primary),
          insurance_policies (id, policy_number, coverage_amount, start_date, end_date)
        `)
        .eq('serial_number', serialNumber)
        .single();

      if (error) throw new APIError(error.message, 'DB_ERROR');
      if (!data) throw new APIError('物料不存在', 'NOT_FOUND');
      
      return data as Property;
    } catch (error: any) {
      console.error('获取物料失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '获取物料信息失败', 'UNKNOWN_ERROR');
    }
  },

  async create(formData: PropertyFormData): Promise<Property> {
    try {
      // 验证必填字段
      if (!formData.serialCode) {
        throw new APIError('序列号不能为空', 'VALIDATION_ERROR');
      }
      if (!formData.name) {
        throw new APIError('名称不能为空', 'VALIDATION_ERROR');
      }

      // 检查序列号是否已存在
      const { data: existing } = await supabase
        .from('properties')
        .select('id')
        .eq('serial_number', formData.serialCode)
        .single();

      if (existing) {
        throw new APIError('该序列号已存在', 'DUPLICATE_ERROR');
      }

      // 构造物料数据
      const propertyData = {
        serial_number: formData.serialCode,
        name: formData.name,
        description: `${formData.businessType} - ${formData.stationType}`,
        category: formData.businessNature,
        status: 'active' as const,
        location: `${formData.province}${formData.city}${formData.district}${formData.address}`,
        metadata: {
          company: formData.company,
          businessType: formData.businessType,
          stationType: formData.stationType,
          riskLevel: formData.riskLevel,
          businessNature: formData.businessNature,
          address: {
            province: formData.province,
            city: formData.city,
            district: formData.district,
            detail: formData.address
          }
        } as PropertyMetadata
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (error) throw new APIError(error.message, 'DB_ERROR');
      if (!data) throw new APIError('创建物料失败', 'CREATE_ERROR');

      return data;
    } catch (error: any) {
      console.error('创建物料失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '创建物料失败', 'UNKNOWN_ERROR');
    }
  },

  async update(id: string, formData: Partial<PropertyFormData>): Promise<Property> {
    try {
      // 构造更新数据
      const updateData: Partial<Property> = {
        name: formData.name,
        description: formData.businessType && formData.stationType 
          ? `${formData.businessType} - ${formData.stationType}`
          : undefined,
        category: formData.businessNature,
        location: formData.province && formData.city && formData.district && formData.address
          ? `${formData.province}${formData.city}${formData.district}${formData.address}`
          : undefined,
      };

      // 如果有元数据字段更新，构造元数据更新
      const hasMetadataUpdate = [
        'company', 'businessType', 'stationType', 'riskLevel', 'businessNature',
        'province', 'city', 'district', 'address'
      ].some(key => key in formData);

      if (hasMetadataUpdate) {
        const currentData = await this.getBySerialNumber(id);
        const currentMetadata = (currentData.metadata || {}) as PropertyMetadata;
        
        const metadata: PropertyMetadata = {
          company: formData.company || currentMetadata.company || '',
          businessType: formData.businessType || currentMetadata.businessType || '',
          stationType: formData.stationType || currentMetadata.stationType || '',
          riskLevel: formData.riskLevel || currentMetadata.riskLevel || 'low',
          businessNature: formData.businessNature || currentMetadata.businessNature || '',
          address: {
            province: formData.province || currentMetadata.address?.province || '',
            city: formData.city || currentMetadata.address?.city || '',
            district: formData.district || currentMetadata.address?.district || '',
            detail: formData.address || currentMetadata.address?.detail || ''
          }
        };

        updateData.metadata = metadata;
      }

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new APIError(error.message, 'DB_ERROR');
      if (!data) throw new APIError('更新物料失败', 'UPDATE_ERROR');

      return data;
    } catch (error: any) {
      console.error('更新物料失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '更新物料失败', 'UNKNOWN_ERROR');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      // 首先删除关联的图片
      const { error: imagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id);

      if (imagesError) throw new APIError(imagesError.message, 'DB_ERROR');

      // 然后删除物料本身
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw new APIError(error.message, 'DB_ERROR');
    } catch (error: any) {
      console.error('删除物料失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '删除物料失败', 'UNKNOWN_ERROR');
    }
  }
};

// 扫描记录相关操作
export const scanApi = {
  async create(record: Omit<ScanRecord, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('scan_records')
        .insert(record)
        .select()
        .single();

      if (error) throw new APIError(error.message, 'DB_ERROR');
      if (!data) throw new APIError('创建扫描记录失败', 'CREATE_ERROR');

      return data;
    } catch (error: any) {
      console.error('创建扫描记录失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '创建扫描记录失败', 'UNKNOWN_ERROR');
    }
  },

  async getHistory() {
    try {
      const { data, error } = await supabase
        .from('scan_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new APIError(error.message, 'DB_ERROR');
      return data || [];
    } catch (error: any) {
      console.error('获取扫描记录失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '获取扫描记录失败', 'UNKNOWN_ERROR');
    }
  },
};

// 用户相关操作
export const userApi = {
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw new APIError(error.message, 'DB_ERROR');
      return data as User;
    } catch (error: any) {
      console.error('获取当前用户失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '获取用户信息失败', 'UNKNOWN_ERROR');
    }
  },

  async updateProfile(updates: Partial<User>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new APIError('用户未登录', 'AUTH_ERROR');

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw new APIError(error.message, 'DB_ERROR');
      if (!data) throw new APIError('更新用户信息失败', 'UPDATE_ERROR');

      return data;
    } catch (error: any) {
      console.error('更新用户信息失败:', error);
      if (error instanceof APIError) throw error;
      throw new APIError(error.message || '更新用户信息失败', 'UNKNOWN_ERROR');
    }
  },
}; 