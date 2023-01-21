/* eslint-disable no-useless-escape */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export const clearString = (v: string, removeSpaces?: boolean) => {
  let value = ''
  if (typeof v === 'string') {
    value = v.trim()
  } else if (typeof v === 'number') {
    value = `${v}`
  }

  if (removeSpaces) {
    value = value.replace(/[`~ !@#$%^*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
  }

  return value
}

export const isValidNumber = (v: any) => {
  return Number.isFinite(+v)
}

export function cleanPhone(str: string) {
  let num = str.replace(/\+7 \(/, '')
  num = num.replace(/\) /, '')
  num = num.replace(/-/, '')
  num = num.replace(/-/, '')

  return num
}

export function valid_date(value: Date, dateNow?: Date) {
  value = value || ''
  const djsObj = dayjs(value, 'DD.MM.YYYY', true)

  if (!djsObj.isValid()) return false
  if (djsObj.year() < 1920) return false
  if (djsObj.isAfter(dayjs(dateNow))) return false

  return true
}

export function valid_phone(value: string) {
  value = value || ''
  let valid = true
  const arr = []
  const num = cleanPhone(value)

  // const reg = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i;

  if (num.length !== 10) {
    valid = false
    arr.push('Номер телефона должен состоять из 10 цифр.')
  }

  if (![3, 4, 5, 6, 8, 9].includes(+num[0] * 1)) {
    valid = false
    arr.push('Проверьте код оператора или региона.')
  }

  return {
    valid,
    phone_error_text: arr.join(' '),
  }
}

export function valid_email(v: string) {
  const value = clearString(v)

  // const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return reg.test(value)
}

export function valid_adress(v: any) {
  const value = clearString(v)

  return value.split(' ').length >= 2 && /\d+/.test(value)
}

export function valid_surname_name_patronymic(v: any) {
  const value = clearString(v)

  const [surname, name, patronimic, extraWord] = value.split(' ')
  if (!surname || !name || extraWord) return false
  return surname.length >= 2 && name.length >= 2
}

export function is_has_length(v: any) {
  return clearString(v).length > 0
}
