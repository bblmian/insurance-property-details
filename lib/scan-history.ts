export interface ScanRecord {
  id: string;
  timestamp: number;
  type: 'NFC' | 'QR';
  serialNumber: string;
  success: boolean;
  error?: string;
  duration: number;
  deviceInfo: {
    platform: string;
    model?: string;
  };
}

export class ScanHistory {
  private static readonly STORAGE_KEY = 'scan_history';
  private static readonly MAX_RECORDS = 100;
  
  // 添加扫描记录
  static addRecord(record: Omit<ScanRecord, 'id'>): void {
    const records = this.getRecords();
    const newRecord: ScanRecord = {
      ...record,
      id: this.generateId(),
    };
    
    records.unshift(newRecord);
    
    // 限制记录数量
    if (records.length > this.MAX_RECORDS) {
      records.pop();
    }
    
    this.saveRecords(records);
  }
  
  // 获取所有记录
  static getRecords(): ScanRecord[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  
  // 获取统计信息
  static getStatistics() {
    const records = this.getRecords();
    const total = records.length;
    const successful = records.filter(r => r.success).length;
    
    return {
      total,
      successful,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      averageDuration: total > 0 
        ? records.reduce((sum, r) => sum + r.duration, 0) / total 
        : 0,
      byType: {
        nfc: records.filter(r => r.type === 'NFC').length,
        qr: records.filter(r => r.type === 'QR').length,
      },
      byPlatform: records.reduce((acc, r) => {
        acc[r.deviceInfo.platform] = (acc[r.deviceInfo.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
  
  // 清除历史记录
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  // 导出历史记录
  static exportHistory(): string {
    const records = this.getRecords();
    return JSON.stringify(records, null, 2);
  }
  
  // 生成唯一ID
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // 保存记录到本地存储
  private static saveRecords(records: ScanRecord[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save scan history:', error);
    }
  }
}

// 扫描统计分析
export class ScanAnalytics {
  // 分析扫描性能趋势
  static analyzeTrends() {
    const records = ScanHistory.getRecords();
    const timeFrames = this.groupByTimeFrame(records);
    
    return {
      hourly: this.calculateMetrics(timeFrames.hourly),
      daily: this.calculateMetrics(timeFrames.daily),
      weekly: this.calculateMetrics(timeFrames.weekly),
    };
  }
  
  // 按时间段分组
  private static groupByTimeFrame(records: ScanRecord[]) {
    const now = Date.now();
    const hour = 3600000;
    const day = hour * 24;
    const week = day * 7;
    
    return {
      hourly: records.filter(r => now - r.timestamp < hour),
      daily: records.filter(r => now - r.timestamp < day),
      weekly: records.filter(r => now - r.timestamp < week),
    };
  }
  
  // 计算各项指标
  private static calculateMetrics(records: ScanRecord[]) {
    if (records.length === 0) return null;
    
    return {
      totalScans: records.length,
      successRate: (records.filter(r => r.success).length / records.length) * 100,
      averageDuration: records.reduce((sum, r) => sum + r.duration, 0) / records.length,
      errorRate: (records.filter(r => !r.success).length / records.length) * 100,
      typeDistribution: {
        nfc: records.filter(r => r.type === 'NFC').length,
        qr: records.filter(r => r.type === 'QR').length,
      },
    };
  }
} 