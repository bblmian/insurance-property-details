"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { checkDeviceCapabilities } from '@/lib/device-utils'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { validateSerialNumber, formatSerialNumber } from '@/lib/scan-utils'
import { ScanHistory } from '@/lib/scan-history'

export default function NFCScanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo')
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deviceInfo, setDeviceInfo] = useState<{
    hasNFC: boolean
    platform: string
  } | null>(null)

  useEffect(() => {
    checkDeviceCapabilities().then((capabilities) => {
      setDeviceInfo({
        hasNFC: capabilities.hasNFC,
        platform: capabilities.platform,
      })
    })
  }, [])

  const handleNFCData = (message: any) => {
    const startTime = Date.now();
    try {
      const records = message.records;
      if (!records || records.length === 0) {
        throw new Error('NFC标签数据为空');
      }

      const rawSerialNumber = new TextDecoder().decode(records[0].data);
      const formattedSerialNumber = formatSerialNumber(rawSerialNumber);
      
      if (!validateSerialNumber(formattedSerialNumber)) {
        throw new Error('无效的序列号格式');
      }

      // 记录成功的扫描
      ScanHistory.addRecord({
        timestamp: Date.now(),
        type: 'NFC',
        serialNumber: formattedSerialNumber,
        success: true,
        duration: Date.now() - startTime,
        deviceInfo: {
          platform: deviceInfo?.platform || 'unknown',
        },
      });
      
      if (returnTo === '/property/new') {
        localStorage.setItem('scannedSerialCode', formattedSerialNumber);
        router.push(returnTo);
      } else {
        router.push(`/property/${formattedSerialNumber}`);
      }
    } catch (err: any) {
      setError(err.message || '无法读取NFC标签数据');
      // 记录失败的扫描
      ScanHistory.addRecord({
        timestamp: Date.now(),
        type: 'NFC',
        serialNumber: '',
        success: false,
        error: err.message,
        duration: Date.now() - startTime,
        deviceInfo: {
          platform: deviceInfo?.platform || 'unknown',
        },
      });
    } finally {
      setIsScanning(false);
    }
  };

  const startNFCScan = async () => {
    const startTime = Date.now();
    setError(null);
    setIsScanning(true);

    try {
      if (deviceInfo?.platform === 'iOS') {
        if ('NFCReader' in window) {
          const reader = new (window as any).NFCReader();
          reader.onreading = (event: any) => {
            handleNFCData(event.message);
          };
          await reader.scan();
        } else {
          throw new Error('此设备不支持NFC功能');
        }
      } else if (deviceInfo?.platform === 'Android') {
        if ('NDEFReader' in window) {
          const ndef = new (window as any).NDEFReader();
          ndef.addEventListener('reading', ({ message }: any) => {
            handleNFCData(message);
          });
          await ndef.scan();
        } else {
          throw new Error('此设备不支持NFC功能');
        }
      } else {
        throw new Error('不支持的设备类型');
      }
    } catch (err: any) {
      setError(err.message || '扫描过程中出现错误');
      setIsScanning(false);
      // 记录失败的扫描
      ScanHistory.addRecord({
        timestamp: Date.now(),
        type: 'NFC',
        serialNumber: '',
        success: false,
        error: err.message,
        duration: Date.now() - startTime,
        deviceInfo: {
          platform: deviceInfo?.platform || 'unknown',
        },
      });
    }
  };

  if (!deviceInfo) {
    return <div className="p-4">正在检查设备兼容性...</div>
  }

  if (!deviceInfo.hasNFC) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>设备不支持</AlertTitle>
        <AlertDescription>
          您的设备不支持NFC功能，请尝试使用二维码扫描。
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">NFC扫描</h2>
        <p className="text-gray-600 mb-4">
          请将手机靠近NFC标签进行扫描
        </p>
        <Button
          onClick={startNFCScan}
          disabled={isScanning}
          className="w-full max-w-sm"
        >
          {isScanning ? '正在扫描...' : '开始扫描'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>扫描错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

