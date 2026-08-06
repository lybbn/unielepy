/**
 * 日期时间工具
 * 修复旧 common.js 中 getHoursT 裸调用 dateFormats 的 bug（改为模块内直接调用）
 */

// 日期格式化：dateFormats(new Date(), 'yyyy-MM-dd hh:mm:ss')
export function dateFormats(dateObj, format) {
  if (!(dateObj instanceof Date)) {
    dateObj = new Date(dateObj)
  }
  const date = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S+': dateObj.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length)
      )
    }
  }
  return format
}

// 计算两个时间相差小时数
export function getHoursT(t2) {
  const t1Str = dateFormats(new Date(), 'yyyy-MM-dd hh:mm:ss')
  const t1 = new Date(t1Str.replace(/-/g, '/'))
  const t2Date = new Date(String(t2).replace(/-/g, '/'))
  const ms = Math.abs(t1.getTime() - t2Date.getTime())
  return ms / 1000 / 60 / 60
}

// 时间差转"xx前"文案
export function timeago(dateTimeStamp) {
  let result = ''
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const halfamonth = day * 15
  const month = day * 30
  const now = new Date().getTime()
  const diffValue = now - dateTimeStamp

  if (diffValue < 0) return ''

  const minC = diffValue / minute
  const hourC = diffValue / hour
  const dayC = diffValue / day
  const weekC = diffValue / week
  const monthC = diffValue / month

  if (monthC >= 1 && monthC <= 3) {
    result = ' ' + parseInt(monthC) + '月以前'
  } else if (weekC >= 1 && weekC <= 3) {
    result = ' ' + parseInt(weekC) + '周以前'
  } else if (dayC >= 1 && dayC <= 6) {
    result = ' ' + parseInt(dayC) + '天以前'
  } else if (hourC >= 1 && hourC <= 23) {
    result = ' ' + parseInt(hourC) + '小时以前'
  } else if (minC >= 1 && minC <= 59) {
    result = ' ' + parseInt(minC) + '分钟以前'
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = '刚刚'
  } else {
    const datetime = new Date()
    datetime.setTime(dateTimeStamp)
    const Nyear = datetime.getFullYear()
    const Nmonth = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
    const Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
    result = Nyear + '-' + Nmonth + '-' + Ndate
  }
  return result
}
