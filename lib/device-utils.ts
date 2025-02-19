export interface DeviceCapabilities {
  hasNFC: boolean;
  hasCamera: boolean;
  platform: 'iOS' | 'Android' | 'unknown';
  model?: string;
}

export const checkDeviceCapabilities = async (): Promise<DeviceCapabilities> => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  
  // 检测平台
  const platform = isIOS ? 'iOS' : (isAndroid ? 'Android' : 'unknown');
  
  // 检测设备型号
  const model = isIOS ? getIOSModel(userAgent) : (isAndroid ? getAndroidModel(userAgent) : undefined);
  
  // 检测NFC功能
  const hasNFC = await checkNFCSupport(platform);
  
  // 检测相机功能
  const hasCamera = await checkCameraSupport();
  
  return {
    hasNFC,
    hasCamera,
    platform,
    model,
  };
};

const getIOSModel = (userAgent: string): string | undefined => {
  const matches = userAgent.match(/iphone\s*(?:os\s*)?(\d+)/i);
  if (matches) {
    return `iPhone ${matches[1]}`;
  }
  return undefined;
};

const getAndroidModel = (userAgent: string): string | undefined => {
  const matches = userAgent.match(/android\s*(\d+)/i);
  if (matches) {
    return `Android ${matches[1]}`;
  }
  return undefined;
};

const checkNFCSupport = async (platform: string): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  // 检查是否支持 Web NFC API
  if ('NDEFReader' in window) {
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      return true;
    } catch (error) {
      console.error('NFC check error:', error);
      return false;
    }
  }
  
  // iOS 特定检查
  if (platform === 'iOS') {
    return 'NFCReader' in window || 'webkit' in window;
  }
  
  return false;
};

const checkCameraSupport = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined') return false;
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Camera check error:', error);
    return false;
  }
}; 