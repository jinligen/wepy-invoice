/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */
function formatDate (source, format) {
  if (!source) return ''
  source = !(source instanceof Date)
    ? new Date(source.replace(/-/g, '/'))
    : source
  const o = {
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

const uuid = function () {
  let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  return function (len, radix) {
    var chars = CHARS, uuid = [], i
    radix = radix || chars.length

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      // rfc4122, version 4 form
      let r

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }

    return uuid.join('')
  }
}()

function showError (msg, duration = 2000, icon = false) {
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      wx.showToast({
        title: msg,
        image: icon ? '../../images/error.png' : '',
        icon: 'none',
        duration: duration
      })
      setTimeout(resolve, duration)
    }, 100)
  })
}

function showToast (msg, duration = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      wx.showToast({
        title: msg,
        duration: duration
      })
      setTimeout(resolve, duration)
    }, 100)
  })
}

function confirm (msg) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          reject(false)
        }
      }
    })
  })
}

function parseDate(dateStr) {
  if (typeof dateStr === 'string') {
    dateStr = dateStr.replace(/-/g, '/')
  }
  return new Date(dateStr)
}

function dayAfter(target, offset = 0) {
  let now = parseDate(target)
  now.setDate(now.getDate() + offset)
  return now
}

function getNodeRect(selector, scope, all) {
  return new Promise(resolve => {
    let query = wx.createSelectorQuery()
    if (scope) {
      query = query.in(scope)
    }
    query[all ? 'selectAll' : 'select'](selector)
      .boundingClientRect(rect => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect)
        }
        if (!all) {
          resolve(rect)
        }
      })
      .exec()
  })
}

function getPrevPage () {
  // eslint-disable-next-line
  const pages = getCurrentPages()
  return pages[pages.length - 2]
}

function getCurrentPage () {
  // eslint-disable-next-line
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

let isLogouted = false

function redirectToLogin () {
  if (!isLogouted) {
    setLogout(true)
    wx.reLaunch({url: '/pages/login/login'})
  }
}

function setLogout (status) {
  isLogouted = status
}

module.exports = {
  formatDate,
  uuid,
  showError,
  showToast,
  confirm,
  parseDate,
  dayAfter,
  getNodeRect,
  getPrevPage,
  getCurrentPage,
  redirectToLogin,
  setLogout
}
