import { propertyApi } from './api'
import { Property } from '@/types/supabase'

interface OfflineData<T> {
  id: string
  timestamp: number
  data: T
  synced: boolean
  type: 'create' | 'update' | 'delete'
}

export class OfflineStorage {
  private static readonly STORAGE_KEY = 'offline_data'
  private static readonly MAX_ITEMS = 100

  static async saveOfflineData<T>(
    data: T,
    type: 'create' | 'update' | 'delete',
    entityType: string
  ): Promise<void> {
    try {
      const offlineData = await this.getOfflineData()
      const newItem: OfflineData<T> = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        data,
        synced: false,
        type
      }

      // 限制存储数量
      if (offlineData.length >= this.MAX_ITEMS) {
        offlineData.shift()
      }

      offlineData.push(newItem)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offlineData))
    } catch (error) {
      console.error('保存离线数据失败:', error)
      throw error
    }
  }

  static async syncOfflineData(): Promise<void> {
    try {
      const offlineData = await this.getOfflineData()
      const unsynced = offlineData.filter(item => !item.synced)

      for (const item of unsynced) {
        try {
          switch (item.type) {
            case 'create':
              await propertyApi.create(item.data as Omit<Property, 'id' | 'created_at' | 'updated_at'>)
              break
            case 'update':
              const updateData = item.data as Property
              await propertyApi.update(updateData.id, updateData)
              break
            case 'delete':
              const deleteData = item.data as Property
              await propertyApi.delete(deleteData.id)
              break
          }
          item.synced = true
        } catch (error) {
          console.error(`同步数据失败 (ID: ${item.id}):`, error)
        }
      }

      // 更新本地存储
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offlineData))

      // 清理已同步的数据
      await this.cleanSyncedData()
    } catch (error) {
      console.error('同步离线数据失败:', error)
      throw error
    }
  }

  static async getOfflineData(): Promise<OfflineData<any>[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  static async cleanSyncedData(): Promise<void> {
    try {
      const offlineData = await this.getOfflineData()
      const unsynced = offlineData.filter(item => !item.synced)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(unsynced))
    } catch (error) {
      console.error('清理已同步数据失败:', error)
      throw error
    }
  }

  static async getPendingSyncCount(): Promise<number> {
    try {
      const offlineData = await this.getOfflineData()
      return offlineData.filter(item => !item.synced).length
    } catch {
      return 0
    }
  }
} 