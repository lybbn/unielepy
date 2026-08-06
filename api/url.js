/**
 * url.js 兼容 re-export
 * 降级为从 config/env 重新导出，保持 import { url } from '@/api/url' 可用
 */
import { baseUrl } from '@/config/env.js'
export const url = baseUrl
export default baseUrl
