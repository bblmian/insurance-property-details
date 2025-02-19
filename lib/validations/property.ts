import { z } from 'zod'

export const propertyFormSchema = z.object({
  name: z.string()
    .min(2, '名称至少需要2个字符')
    .max(100, '名称不能超过100个字符')
    .trim(),
  company: z.string()
    .min(2, '公司名称至少需要2个字符')
    .max(100, '公司名称不能超过100个字符')
    .trim(),
  businessType: z.string()
    .min(1, '请选择业态')
    .max(50, '业态名称不能超过50个字符')
    .trim(),
  stationType: z.string()
    .min(1, '请选择电站性质')
    .max(50, '电站性质不能超过50个字符')
    .trim(),
  riskLevel: z.enum(['low', 'medium', 'high'], {
    required_error: '请选择风险等级',
    invalid_type_error: '无效的风险等级',
  }),
  businessNature: z.string()
    .min(1, '请输入营业性质')
    .max(50, '营业性质不能超过50个字符')
    .trim(),
  serialCode: z.string()
    .min(1, '序列号不能为空')
    .regex(/^PROP-\d{4}-\d{6}$/, '无效的序列号格式')
    .trim(),
  province: z.string()
    .min(2, '请输入省份')
    .max(20, '省份名称不能超过20个字符')
    .trim(),
  city: z.string()
    .min(2, '请输入城市')
    .max(20, '城市名称不能超过20个字符')
    .trim(),
  district: z.string()
    .min(2, '请输入区县')
    .max(20, '区县名称不能超过20个字符')
    .trim(),
  address: z.string()
    .min(5, '请输入详细地址')
    .max(200, '地址不能超过200个字符')
    .trim(),
})

export type PropertyFormData = z.infer<typeof propertyFormSchema>

// 用于更新时的部分验证
export const propertyUpdateSchema = propertyFormSchema.partial()

export type PropertyUpdateData = z.infer<typeof propertyUpdateSchema>

// 风险等级选项
export const riskLevelOptions = [
  { value: 'low', label: '低风险' },
  { value: 'medium', label: '中风险' },
  { value: 'high', label: '高风险' },
] as const

// 业态选项
export const businessTypeOptions = [
  { value: 'solar', label: '光伏' },
  { value: 'wind', label: '风电' },
  { value: 'hydro', label: '水电' },
  { value: 'thermal', label: '火电' },
  { value: 'nuclear', label: '核电' },
  { value: 'other', label: '其他' },
] as const

// 电站性质选项
export const stationTypeOptions = [
  { value: 'commercial', label: '商业电站' },
  { value: 'industrial', label: '工业电站' },
  { value: 'residential', label: '居民电站' },
  { value: 'utility', label: '公用事业电站' },
  { value: 'other', label: '其他' },
] as const 