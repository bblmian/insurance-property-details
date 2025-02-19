// 扫描性能配置
export interface ScanConfig {
  // 二维码扫描配置
  qrScan: {
    scanInterval: number;      // 扫描间隔（毫秒）
    processingQuality: number; // 图像处理质量 (0-1)
    minConfidence: number;     // 最小置信度
    timeout: number;           // 扫描超时时间（毫秒）
  };
  // NFC扫描配置
  nfcScan: {
    timeout: number;           // 扫描超时时间（毫秒）
    retryInterval: number;     // 重试间隔（毫秒）
    maxRetries: number;        // 最大重试次数
  };
}

// 默认配置
export const defaultScanConfig: ScanConfig = {
  qrScan: {
    scanInterval: 100,      // 每100ms扫描一次
    processingQuality: 0.8, // 80%的图像质量
    minConfidence: 0.7,     // 70%的最小置信度
    timeout: 30000,         // 30秒超时
  },
  nfcScan: {
    timeout: 20000,         // 20秒超时
    retryInterval: 1000,    // 1秒重试间隔
    maxRetries: 3,          // 最多重试3次
  },
};

// 性能监控
export class ScanPerformanceMonitor {
  private startTime: number = 0;
  private scanAttempts: number = 0;
  private successfulScans: number = 0;
  private lastScanTime: number = 0;
  
  startScan() {
    this.startTime = Date.now();
    this.scanAttempts = 0;
    this.successfulScans = 0;
  }
  
  recordScanAttempt() {
    this.scanAttempts++;
    this.lastScanTime = Date.now();
  }
  
  recordSuccessfulScan() {
    this.successfulScans++;
  }
  
  getScanMetrics() {
    const endTime = Date.now();
    return {
      duration: endTime - this.startTime,
      attempts: this.scanAttempts,
      successRate: this.successfulScans / this.scanAttempts,
      averageAttemptTime: (endTime - this.startTime) / this.scanAttempts,
    };
  }
}

// 图像处理优化
export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }
  
  // 优化图像以提高扫描性能
  optimizeForScanning(videoElement: HTMLVideoElement, quality: number): ImageData {
    // 调整canvas大小以匹配视频流
    const width = videoElement.videoWidth * quality;
    const height = videoElement.videoHeight * quality;
    this.canvas.width = width;
    this.canvas.height = height;
    
    // 绘制并优化图像
    this.context.drawImage(videoElement, 0, 0, width, height);
    
    // 应用图像增强
    this.enhanceImage();
    
    return this.context.getImageData(0, 0, width, height);
  }
  
  private enhanceImage() {
    // 提高对比度
    this.context.filter = 'contrast(1.2)';
    
    // 应用锐化
    this.context.filter = 'sharpen(1)';
    
    // 重置滤镜
    this.context.filter = 'none';
  }
}

// 扫描调度器
export class ScanScheduler {
  private timeoutId: number | null = null;
  private intervalId: number | null = null;
  private config: ScanConfig;
  
  constructor(config: ScanConfig = defaultScanConfig) {
    this.config = config;
  }
  
  scheduleQRScan(scanFn: () => void) {
    // 设置扫描间隔
    this.intervalId = window.setInterval(() => {
      scanFn();
    }, this.config.qrScan.scanInterval);
    
    // 设置超时
    this.timeoutId = window.setTimeout(() => {
      this.stop();
    }, this.config.qrScan.timeout);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
} 