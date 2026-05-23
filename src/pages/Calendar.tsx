import { useState, useMemo } from 'react'
import { SpiralRings, ExpenseItem, MonthNav } from '../components/ui'
import { CATEGORY_OPTIONS, filterByMonth, getDaysInMonth, getFirstDay } from '../types'
import type { Expense } from '../types'

interface Props {
  expenses: Expense[]
  month: string
  onMonthChange: (m: string) => void
  onDeleteExpense: (id: string) => void
}

export default function CalendarScreen({ expenses, month, onMonthChange, onDeleteExpense }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string | null>(null)

  const monthExp = filterByMonth(expenses, month)

  const expByDate = useMemo(() => {
    const filtered = filterByMonth(expenses, month)
    const map: Record<string, Expense[]> = {}
    filtered.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [expenses, month])

  const yr = parseInt(month.slice(0, 4), 10)
  const mo = parseInt(month.slice(5, 7), 10) - 1
  const totalDays = getDaysInMonth(yr, mo)
  const firstDay = getFirstDay(yr, mo)

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)

  let listExp = selectedDate
    ? (expByDate[selectedDate] || [])
    : [...monthExp].sort((a, b) => b.date.localeCompare(a.date))

  if (search) {
    const q = search.toLowerCase()
    listExp = listExp.filter(e => {
      const cat = CATEGORY_OPTIONS.find(c => c.category === e.category)
      return e.memo.toLowerCase().includes(q) || (cat && cat.name.includes(q))
    })
  }
  if (filterCat) listExp = listExp.filter(e => e.category === filterCat)

  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const todayStr = new Date().toISOString().split('T')[0]

  function formatDateKR(dateStr: string) {
    const p = dateStr.split('-')
    const m = parseInt(p[1], 10)
    const d = parseInt(p[2], 10)
    const day = new Date(dateStr + 'T00:00:00').getDay()
    const days2 = ['일', '월', '화', '수', '목', '금', '토']
    return `${m}월 ${d}일 (${days2[day]})`
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FEF9F3' }}>

      <div style={{ background: '#FFFDF7', borderBottom: '2px solid #F0E4D4', flexShrink: 0 }}>
        <SpiralRings />
        <div style={{ padding: '10px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 4, height: 18, background: '#3B9EFF', borderRadius: 2 }} />
            <span className="jua" style={{ fontSize: 16, color: '#2C1810' }}>지출 달력</span>
          </div>
          <MonthNav value={month} onChange={m => { onMonthChange(m); setSelectedDate(null) }} />
        </div>
      </div>

      <div className="scroll-area" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Calendar grid */}
        <div style={{ background: '#FFFDF7', padding: '14px 14px 10px', marginBottom: 10, borderBottom: '2px solid #F0E4D4' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
            {weekdays.map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#FF4D90' : i === 6 ? '#3B9EFF' : '#C0A888', padding: '2px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px 0' }}>
            {days.map((day, i) => {
              if (!day) return <div key={'e' + i} />
              const dateStr = month + '-' + String(day).padStart(2, '0')
              const dayExps = expByDate[dateStr] || []
              const hasExp = dayExps.length > 0
              const isSel = selectedDate === dateStr
              const isToday = dateStr === todayStr
              const dow = (firstDay + day - 1) % 7
              const textColor = dow === 0 ? '#FF4D90' : dow === 6 ? '#3B9EFF' : '#2C1810'
              return (
                <div key={day} onClick={() => setSelectedDate(isSel ? null : dateStr)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3px 1px', cursor: 'pointer', borderRadius: 10, background: isSel ? '#9333EA' : isToday ? '#FFF3C4' : 'transparent', transition: 'background 0.15s' }}>
                  <span className="jua" style={{ fontSize: 13, color: isSel ? 'white' : textColor, width: 26, textAlign: 'center', lineHeight: '26px' }}>{day}</span>
                  <div style={{ height: 6, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                    {hasExp && dayExps.slice(0, 3).map((e, idx) => {
                      const cat = CATEGORY_OPTIONS.find(c => c.category === e.category)
                      return <div key={idx} style={{ width: 4, height: 4, borderRadius: '50%', background: isSel ? 'rgba(255,255,255,0.8)' : (cat ? cat.color : '#9333EA') }} />
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search + filter */}
        <div style={{ padding: '0 14px', marginBottom: 10 }}>
          <div style={{ background: '#FFFDF7', border: '1.5px solid #F0E4D4', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', marginBottom: 9 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C0A888" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="지출 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#2C1810', padding: '10px 0', background: 'transparent', fontFamily: 'inherit' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0A888', fontSize: 15, padding: 2 }}>✕</button>}
          </div>
          <div className="scroll-area" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            <button onClick={() => setFilterCat(null)}
              style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: !filterCat ? '#9333EA' : '#FFFDF7', color: !filterCat ? 'white' : '#7A5C4A', border: !filterCat ? 'none' : '1.5px solid #F0E4D4' }}>전체</button>
            {CATEGORY_OPTIONS.map(cat => {
              const active = filterCat === cat.category
              return (
                <button key={cat.category} onClick={() => setFilterCat(active ? null : cat.category)}
                  style={{ flexShrink: 0, padding: '5px 13px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: active ? cat.color : '#FFFDF7', color: active ? 'white' : '#7A5C4A', border: active ? 'none' : '1.5px solid #F0E4D4' }}>
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Expense list */}
        <div style={{ padding: '0 14px', paddingBottom: 20 }}>
          {selectedDate && (
            <div className="jua" style={{ fontSize: 13, color: '#7A5C4A', marginBottom: 8, paddingLeft: 2 }}>
              {formatDateKR(selectedDate)} · {(expByDate[selectedDate] || []).length}건
            </div>
          )}
          {listExp.length > 0 ? (
            <div style={{ background: '#FFFDF7', borderRadius: 14, overflow: 'hidden', border: '1px solid #F0E4D4', boxShadow: '1px 3px 8px rgba(0,0,0,0.06)' }}>
              {listExp.map(e => <ExpenseItem key={e.id} expense={e} onDelete={onDeleteExpense} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#C0A888', fontSize: 13 }}>
              {search || filterCat ? '검색 결과가 없어요' : selectedDate ? '이날 지출이 없어요' : '지출 내역이 없어요'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
