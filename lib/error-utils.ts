export interface ScanError {
  code: string;
  message: string;
  suggestion?: string;
}

export const ScanErrorCodes = {
  // NFC 相关错误
  NFC_NOT_SUPPORTED: 'NFC_NOT_SUPPORTED',
  NFC_PERMISSION_DENIED: 'NFC_PERMISSION_DENIED',
  NFC_READ_ERROR: 'NFC_READ_ERROR',
  NFC_TAG_FORMAT_ERROR: 'NFC_TAG_FORMAT_ERROR',
  NFC_TIMEOUT: 'NFC_TIMEOUT',
  
  // 相机相关错误
  CAMERA_NOT_SUPPORTED: 'CAMERA_NOT_SUPPORTED',
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',
  CAMERA_IN_USE: 'CAMERA_IN_USE',
  CAMERA_QR_INVALID: 'CAMERA_QR_INVALID',
  
  // 通用错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_SERIAL_NUMBER: 'INVALID_SERIAL_NUMBER',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export const getErrorDetails = (code: keyof typeof ScanErrorCodes): ScanError => {
  const errorMap: Record<keyof typeof ScanErrorCodes, ScanError> = {
    NFC_NOT_SUPPORTED: {
      code: 'NFC_NOT_SUPPORTED',
      message: '设备不支持NFC功能',
      suggestion: '请尝试使用二维码扫描方式',
    },
    NFC_PERMISSION_DENIED: {
      code: 'NFC_PERMISSION_DENIED',
      message: '未获得NFC使用权限',
      suggestion: '请在系统设置中允许应用使用NFC功能',
    },
    NFC_READ_ERROR: {
      code: 'NFC_READ_ERROR',
      message: 'NFC读取失败',
      suggestion: '请确保标签完好并重新尝试',
    },
    NFC_TAG_FORMAT_ERROR: {
      code: 'NFC_TAG_FORMAT_ERROR',
      message: 'NFC标签格式错误',
      suggestion: '请确保使用正确的NFC标签',
    },
    NFC_TIMEOUT: {
      code: 'NFC_TIMEOUT',
      message: 'NFC扫描超时',
      suggestion: '请重新尝试扫描',
    },
    CAMERA_NOT_SUPPORTED: {
      code: 'CAMERA_NOT_SUPPORTED',
      message: '设备不支持相机功能',
      suggestion: '请尝试使用NFC扫描方式',
    },
    CAMERA_PERMISSION_DENIED: {
      code: 'CAMERA_PERMISSION_DENIED',
      message: '未获得相机使用权限',
      suggestion: '请在系统设置中允许应用使用相机',
    },
    CAMERA_IN_USE: {
      code: 'CAMERA_IN_USE',
      message: '相机正被其他应用使用',
      suggestion: '请关闭其他使用相机的应用后重试',
    },
    CAMERA_QR_INVALID: {
      code: 'CAMERA_QR_INVALID',
      message: '无效的二维码格式',
      suggestion: '请确保扫描正确的财产标的二维码',
    },
    NETWORK_ERROR: {
      code: 'NETWORK_ERROR',
      message: '网络连接错误',
      suggestion: '请检查网络连接后重试',
    },
    INVALID_SERIAL_NUMBER: {
      code: 'INVALID_SERIAL_NUMBER',
      message: '无效的序列号格式',
      suggestion: '请确保扫描正确的财产标的标签',
    },
    UNKNOWN_ERROR: {
      code: 'UNKNOWN_ERROR',
      message: '未知错误',
      suggestion: '请重试，如果问题持续存在请联系客服',
    },
  };

  return errorMap[code];
};

export const handleScanError = (error: any): ScanError => {
  // 处理 NFC 错误
  if (error.name === 'NotSupportedError') {
    return getErrorDetails('NFC_NOT_SUPPORTED');
  }
  if (error.name === 'NotAllowedError') {
    return getErrorDetails('NFC_PERMISSION_DENIED');
  }
  if (error.name === 'TimeoutError') {
    return getErrorDetails('NFC_TIMEOUT');
  }
  
  // 处理相机错误
  if (error.name === 'NotFoundError') {
    return getErrorDetails('CAMERA_NOT_SUPPORTED');
  }
  if (error.name === 'NotAllowedError') {
    return getErrorDetails('CAMERA_PERMISSION_DENIED');
  }
  if (error.name === 'NotReadableError') {
    return getErrorDetails('CAMERA_IN_USE');
  }
  
  // 处理网络错误
  if (error.name === 'NetworkError') {
    return getErrorDetails('NETWORK_ERROR');
  }
  
  return getErrorDetails('UNKNOWN_ERROR');
}; 