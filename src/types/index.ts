export type ExpenseCategory = 'food' | 'vet' | 'groom' | 'toys' | 'insurance' | 'training'

export const STICKY_COLORS: Record<ExpenseCategory, { bg: string; lineColor: string }> = {
  food:      { bg: '#FFF7D6', lineColor: '#FFE180' },
  vet:       { bg: '#E8F2FF', lineColor: '#B8D4FF' },
  groom:     { bg: '#FFEAF3', lineColor: '#FFB8D8' },
  toys:      { bg: '#E8FAF0', lineColor: '#A8E8C0' },
  insurance: { bg: '#F2ECFF', lineColor: '#CEB8FF' },
  training:  { bg: '#E8FAFA', lineColor: '#A8E4E4' },
}

export const CATEGORY_OPTIONS: {
  category: ExpenseCategory
  name: string
  color: string
  bg: string
  iconType: ExpenseCategory
}[] = [
  { category: 'food',      name: '사료/간식',    color: '#FF6B4A', bg: '#FFF3F0', iconType: 'food' },
  { category: 'vet',       name: '동물병원',     color: '#3B9EFF', bg: '#EEF4FF', iconType: 'vet' },
  { category: 'groom',     name: '미용/목욕',    color: '#FF4D90', bg: '#FFF0F6', iconType: 'groom' },
  { category: 'toys',      name: '장난감/용품',  color: '#22C55E', bg: '#EDFAF3', iconType: 'toys' },
  { category: 'insurance', name: '보험/정기지출', color: '#9333EA', bg: '#F5F0FF', iconType: 'insurance' },
  { category: 'training',  name: '훈련/교육',    color: '#06B6D4', bg: '#ECFEFF', iconType: 'training' },
]

export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  birthday: string
  gender: string
  photo?: string
}

export interface Expense {
  id: string
  petId: string
  category: ExpenseCategory
  amount: number
  memo: string
  date: string
}

export interface Budget {
  total: number
  food: number
  vet: number
  groom: number
  toys: number
  insurance: number
  training: number
}

export function formatAmount(n: number): string {
  return n.toLocaleString('ko-KR') + '원'
}

export function filterByMonth(expenses: Expense[], yearMonth: string): Expense[] {
  return expenses.filter(e => e.date.startsWith(yearMonth))
}

export function getTotal(expenses: Expense[]): number {
  return expenses.reduce((s, e) => s + e.amount, 0)
}

export function getCatTotal(expenses: Expense[], catId: ExpenseCategory): number {
  return expenses.filter(e => e.category === catId).reduce((s, e) => s + e.amount, 0)
}

export function prevMonth(ym: string): string {
  const y = parseInt(ym.slice(0, 4), 10)
  const m = parseInt(ym.slice(5, 7), 10) - 1
  if (m < 1) { return (y - 1) + '-12' }
  return y + '-' + String(m).padStart(2, '0')
}

export function nextMonth(ym: string): string {
  const y = parseInt(ym.slice(0, 4), 10)
  const m = parseInt(ym.slice(5, 7), 10) + 1
  if (m > 12) { return (y + 1) + '-01' }
  return y + '-' + String(m).padStart(2, '0')
}

export function ymLabel(ym: string): string {
  return ym.slice(0, 4) + '년 ' + parseInt(ym.slice(5, 7), 10) + '월'
}

export function getAge(birthday: string): string {
  if (!birthday) return '나이 미상'
  const birth = new Date(birthday)
  if (isNaN(birth.getTime())) return '나이 미상'
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) { years--; months += 12 }
  if (years > 0) return years + '살'
  return months + '개월'
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDay(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}
