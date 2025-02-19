export const SERIAL_NUMBER_PATTERN = /^PROP-\d{4}-\d{6}$/;

export const validateSerialNumber = (serialNumber: string): boolean => {
  return SERIAL_NUMBER_PATTERN.test(serialNumber);
};

export const formatSerialNumber = (serialNumber: string): string => {
  // 移除所有空白字符
  const cleaned = serialNumber.replace(/\s+/g, '');
  // 转换为大写
  return cleaned.toUpperCase();
};

export const parseSerialNumber = (serialNumber: string): { year: number; sequence: number } | null => {
  const match = serialNumber.match(SERIAL_NUMBER_PATTERN);
  if (!match) return null;

  const [_, year, sequence] = serialNumber.split('-');
  return {
    year: parseInt(year, 10),
    sequence: parseInt(sequence, 10)
  };
};

export const generateSerialNumber = (sequence: number): string => {
  const year = new Date().getFullYear();
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `PROP-${year}-${paddedSequence}`;
}; 