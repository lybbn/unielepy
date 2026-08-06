/**
 * 校验工具
 * 手机号正则更新为更通用的 ^1[3-9]\d{9}$（旧正则过窄，部分号段误判）
 */

// 是否价格（最多两位小数）
export function isRealPrice(val) {
  if (val === '' || val == null || val == 0) return false
  const dot = String(val).indexOf('.')
  if (dot > -1 && String(val).length > dot + 3) return false
  if (/^\d*(\.?\d{0,2})$/.test(val)) return true
  if (!isNaN(val)) return true
  return false
}

// 是否正整数
export function isRealZhengNum(val) {
  if (val === '' || val == null) return false
  if (/(^[1-9]\d*$)/.test(val)) return true
  if (isNaN(val)) return false
  return false
}

// 验证手机号
export function checkPhoneNum(number) {
  const reg = /^1[3-9]\d{9}$/
  if (number == '' || String(number).length != 11 || !reg.test(number)) return false
  return true
}

// 验证身份证号
export function checkIdcard(number) {
  const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  if (number == '' || !reg.test(number)) return false
  return true
}

// 是否车牌号（含新能源）
export function checkCarNo(value) {
  const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
  const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
  if (value.length === 7) return creg.test(value)
  if (value.length === 8) return xreg.test(value)
  return false
}

// 金额，只允许保留两位小数
export function checkAmount(value) {
  return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value)
}
