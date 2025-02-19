"use client"

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkDeviceCapabilities } from '@/lib/device-utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Camera } from 'lucide-react';
import jsQR from 'jsqr';
import { handleScanError, ScanError, getErrorDetails } from '@/lib/error-utils';
import { 
  defaultScanConfig, 
  ScanPerformanceMonitor,
  ImageProcessor,
  ScanScheduler 
} from '@/lib/scan-performance';
import { ScanHistory } from '@/lib/scan-history';
import { validateSerialNumber, formatSerialNumber } from '@/lib/scan-utils';

export default function QRScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<ScanError | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<{
    hasCamera: boolean;
    platform: string;
    model?: string;
  } | null>(null);

  // 性能相关实例
  const performanceMonitor = useRef(new ScanPerformanceMonitor());
  const imageProcessor = useRef<ImageProcessor | null>(null);
  const scanScheduler = useRef(new ScanScheduler(defaultScanConfig));

  useEffect(() => {
    // 初始化图像处理器
    if (typeof window !== 'undefined') {
      imageProcessor.current = new ImageProcessor();
    }

    checkDeviceCapabilities().then((capabilities) => {
      setDeviceInfo({
        hasCamera: capabilities.hasCamera,
        platform: capabilities.platform,
        model: capabilities.model,
      });
    });

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setIsScanning(true);
    performanceMonitor.current.startScan();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanScheduler.current.scheduleQRScan(scanQRCode);
      }
    } catch (err: any) {
      const scanError = handleScanError(err);
      setError(scanError);
      setIsScanning(false);
      
      // 记录失败的扫描
      ScanHistory.addRecord({
        timestamp: Date.now(),
        type: 'QR',
        serialNumber: '',
        success: false,
        error: scanError.message,
        duration: performanceMonitor.current.getScanMetrics().duration,
        deviceInfo: {
          platform: deviceInfo?.platform || 'unknown',
          model: deviceInfo?.model,
        },
      });
    }
  };

  const scanQRCode = () => {
    if (!isScanning || !imageProcessor.current) return;

    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanQRCode);
      return;
    }

    performanceMonitor.current.recordScanAttempt();

    try {
      const imageData = imageProcessor.current.optimizeForScanning(
        video,
        defaultScanConfig.qrScan.processingQuality
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const formattedSerialNumber = formatSerialNumber(code.data);
        if (validateSerialNumber(formattedSerialNumber)) {
          performanceMonitor.current.recordSuccessfulScan();
          const metrics = performanceMonitor.current.getScanMetrics();

          ScanHistory.addRecord({
            timestamp: Date.now(),
            type: 'QR',
            serialNumber: formattedSerialNumber,
            success: true,
            duration: metrics.duration,
            deviceInfo: {
              platform: deviceInfo?.platform || 'unknown',
              model: deviceInfo?.model,
            },
          });

          stopCamera();
          
          if (returnTo === '/property/new') {
            localStorage.setItem('scannedSerialCode', formattedSerialNumber);
            router.push(returnTo);
          } else {
            router.push(`/property/${formattedSerialNumber}`);
          }
          return;
        } else {
          setError(getErrorDetails('CAMERA_QR_INVALID'));
        }
      }
    } catch (err: any) {
      const scanError = handleScanError(err);
      setError(scanError);
      stopCamera();
      
      // 记录失败的扫描
      ScanHistory.addRecord({
        timestamp: Date.now(),
        type: 'QR',
        serialNumber: '',
        success: false,
        error: scanError.message,
        duration: performanceMonitor.current.getScanMetrics().duration,
        deviceInfo: {
          platform: deviceInfo?.platform || 'unknown',
          model: deviceInfo?.model,
        },
      });
      return;
    }

    requestAnimationFrame(scanQRCode);
  };

  const stopCamera = () => {
    setIsScanning(false);
    scanScheduler.current.stop();
    
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  const isValidSerialNumber = (data: string): boolean => {
    // 根据实际序列号格式进行验证
    return /^[A-Z0-9]{8,}$/.test(data);
  };

  if (!deviceInfo) {
    return <div className="p-4">正在检查设备兼容性...</div>;
  }

  if (!deviceInfo.hasCamera) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>设备不支持</AlertTitle>
        <AlertDescription>
          无法访问设备相机，请确保已授予相机权限或尝试使用NFC扫描。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">扫描二维码</h2>
        <p className="text-gray-600 mb-4">
          请将相机对准财产标的上的二维码
        </p>
      </div>

      <div className="relative aspect-square w-full max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Camera className="w-16 h-16 text-white" />
          </div>
        )}
      </div>

      <Button
        onClick={isScanning ? stopCamera : startCamera}
        className="w-full max-w-sm mx-auto"
      >
        {isScanning ? '停止扫描' : '开始扫描'}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>扫描错误</AlertTitle>
          <AlertDescription>
            {error.message}
            {error.suggestion && (
              <p className="mt-2 text-sm">{error.suggestion}</p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

