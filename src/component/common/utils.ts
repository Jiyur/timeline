import { isSameHour, isSameMinute, isSameSecond } from "date-fns"

export const isSameTime = (a: Date, b: Date) => {
  return isSameHour(a, b) && isSameMinute(a, b) && isSameSecond(a, b)
}