import Vue from 'vue'

Vue.filter('capitalize', function (value) {
  if (value && typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return ''
})

Vue.filter('upercase', function (value) {
  if (value && typeof value === 'string') {
    return value.toUpperCase()
  }

  return ''
})

Vue.filter('lowercase', function (value) {
  if (value && typeof value === 'string') {
    return value.toLowerCase()
  }

  return ''
})

Vue.filter('truncate', function (text, length, suffix) {
  if (text.length > length) {
    return text.substring(0, length) + suffix
  } else {
    return text
  }
})
