import { useState } from 'react'
import type { Expense, ExpenseCategory } from '../types'
import { CATEGORY_OPTIONS, STICKY_COLORS, formatAmount, getCatTotal, getTotal, prevMonth, nextMonth, ymLabel } from '../types'

// ── WashiTape ─────────────────────────────────────────────────

interface WashiTapeProps {
  c1?: string
  c2?: string
  width?: number
  angle?: number
}

export function WashiTape({ c1 = '#FFB3C6', c2 = '#FFCAD5', width = 64, angle = -2 }: WashiTapeProps) {
  const ss = Math.floor(width / 8)
  const grad = `repeating-linear-gradient(90deg,${c1} 0px,${c1} ${ss}px,${c2} ${ss}px,${c2} ${ss * 2}px)`
  return (
    <div style={{ width, height: 13, background: grad, opacity: 0.88, borderRadius: 3, transform: `rotate(${angle}deg)` }} />
  )
}

// ── PaperFold ────────────────────────────────────────────────

export function PaperFold({ bg = '#FFF3C4' }: { bg?: string }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '22px 22px 0 0', borderColor: `${bg} ${bg} transparent transparent` }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 0 22px 22px', borderColor: 'transparent transparent rgba(0,0,0,0.14) transparent' }} />
    </div>
  )
}

// ── SpiralRings ───────────────────────────────────────────────

export function SpiralRings() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 9, padding: '5px 0 3px', background: '#FFFDF7' }}>
      {Array.from({ length: 13 }).map((_, i) => (
        <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid #D0C0A8', background: 'white', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }} />
      ))}
    </div>
  )
}

// ── PawPrint ─────────────────────────────────────────────────

export function PawPrint({ size = 48, color = 'rgba(0,0,0,0.08)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill={color}>
      <ellipse cx="15" cy="11" rx="5.5" ry="6.5" />
      <ellipse cx="27" cy="7" rx="5" ry="6" />
      <ellipse cx="39" cy="9" rx="5" ry="6" />
      <ellipse cx="49" cy="17" rx="4.5" ry="5.5" />
      <path d="M30 56 C15 56 8 45 8 36 C8 27 17 21 30 21 C43 21 52 27 52 36 C52 45 45 56 30 56Z" />
    </svg>
  )
}

// ── Category Icon SVG ─────────────────────────────────────────

export function CatIconSVG({ type, size = 18, color = 'white' }: { type: ExpenseCategory; size?: number; color?: string }) {
  if (type === 'food') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 11C5 7.5 8 5 12 5s7 2.5 7 6H5z" fill={color} />
      <path d="M5 11h14v1.5C19 16.1 15.9 19 12 19S5 16.1 5 12.5V11z" fill={color} opacity="0.85" />
      <line x1="8" y1="5" x2="8" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="5" x2="12" y2="2.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="5" x2="16" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
  if (type === 'vet') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <rect x="10" y="3" width="4" height="18" rx="2" />
      <rect x="3" y="10" width="18" height="4" rx="2" />
    </svg>
  )
  if (type === 'groom') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="7.5" cy="7.5" r="2.8" fill={color} />
      <circle cx="7.5" cy="16.5" r="2.8" fill={color} />
      <line x1="10" y1="7.5" x2="20" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="10" y1="16.5" x2="20" y2="5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
  if (type === 'toys') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12,2 14.7,8.7 22,9.5 16.7,14.4 18.5,21.5 12,18 5.5,21.5 7.3,14.4 2,9.5 9.3,8.7" />
    </svg>
  )
  if (type === 'insurance') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L3 6v5.5C3 16.9 7 21.5 12 23c5-1.5 9-6.1 9-11.5V6L12 2z" />
    </svg>
  )
  if (type === 'training') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill={color} opacity="0.9" />
      <line x1="8" y1="8" x2="16" y2="8" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16" x2="13" y2="16" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
  return <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill={color} opacity="0.6" /></svg>
}

// ── Category Badge ────────────────────────────────────────────

export function CategoryBadge({ catId, size = 40 }: { catId: ExpenseCategory; size?: number }) {
  const cat = CATEGORY_OPTIONS.find(c => c.category === catId)!
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <CatIconSVG type={catId} size={size * 0.52} color={cat.color} />
    </div>
  )
}

// ── Category Mini Card (sticky note) ─────────────────────────

export function CategoryMiniCard({ catId, amount, pct }: { catId: ExpenseCategory; amount: number; pct: number }) {
  const cat = CATEGORY_OPTIONS.find(c => c.category === catId)!
  const sc = STICKY_COLORS[catId]
  return (
    <div style={{ background: sc.bg, borderRadius: 10, padding: '10px 9px', boxShadow: `1px 2px 6px rgba(0,0,0,0.09), 0 0 0 1px ${sc.lineColor}`, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: sc.lineColor, opacity: 0.7 }} />
      <CategoryBadge catId={catId} size={30} />
      <div style={{ fontSize: 9, fontWeight: 700, color: cat.color, lineHeight: 1.3 }}>{cat.name}</div>
      <div className="jua" style={{ fontSize: 13, color: '#2C1810', lineHeight: 1, letterSpacing: '-0.01em' }}>{formatAmount(amount)}</div>
      <div style={{ fontSize: 9.5, color: '#A8907A' }}>{pct}%</div>
    </div>
  )
}

// ── Donut Chart ───────────────────────────────────────────────

export function DonutChart({ expenses, size = 120, strokeWidth = 16, showTotal = true }: { expenses: Expense[]; size?: number; strokeWidth?: number; showTotal?: boolean }) {
  const cx = size / 2, cy = size / 2
  const r = size / 2 - strokeWidth / 2 - 1
  const C = 2 * Math.PI * r
  const GAP = 4
  const total = getTotal(expenses)
  const segments = CATEGORY_OPTIONS.map(cat => ({
    id: cat.category,
    color: cat.color,
    amount: getCatTotal(expenses, cat.category),
  })).filter(s => s.amount > 0)

  let cum = 0
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', display: 'block' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDE0CC" strokeWidth={strokeWidth} />
        {total > 0 && segments.map(seg => {
          const frac = seg.amount / total
          const dash = Math.max(0, frac * C - GAP)
          const off = -(cum * C)
          cum += frac
          return (
            <circle key={seg.id} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={strokeWidth - 1}
              strokeDasharray={`${dash} ${C}`} strokeDashoffset={off} strokeLinecap="butt" />
          )
        })}
      </svg>
      {showTotal && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: '#C0A888', lineHeight: 1, marginBottom: 2 }}>합계</span>
          <span className="jua" style={{ fontSize: Math.floor(size * 0.14), color: '#2C1810', lineHeight: 1.2 }}>{formatAmount(total)}</span>
        </div>
      )}
    </div>
  )
}

// ── Budget Bar ────────────────────────────────────────────────

export function BudgetBar({ spent, budget, showText = true }: { spent: number; budget: number; showText?: boolean }) {
  const pct = budget > 0 ? Math.min(spent / budget, 1) : 0
  const over = spent > budget
  const nearly = !over && pct >= 0.8
  const barColor = over ? '#FF4D90' : nearly ? '#FB923C' : '#9333EA'
  return (
    <div>
      <div style={{ height: 8, background: '#EDE0CC', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: barColor, borderRadius: 99, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      {showText && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
          <span style={{ color: barColor, fontWeight: 700 }}>{over ? '예산 초과!' : `${Math.round(pct * 100)}% 사용`}</span>
          <span style={{ color: '#C0A888' }}>{over ? `+${formatAmount(spent - budget)}` : `${formatAmount(budget - spent)} 남음`}</span>
        </div>
      )}
    </div>
  )
}

// ── Expense Item ──────────────────────────────────────────────

export function ExpenseItem({ expense, onDelete }: { expense: Expense; onDelete?: (id: string) => void }) {
  const cat = CATEGORY_OPTIONS.find(c => c.category === expense.category)!
  const [showDel, setShowDel] = useState(false)
  const dp = expense.date.slice(5).replace('-', '/')
  return (
    <div
      onClick={() => setShowDel(v => !v)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', background: showDel ? '#FFF5F0' : 'transparent', transition: 'background 0.15s', userSelect: 'none', borderBottom: '1px solid #F0E4D4', position: 'relative' }}
    >
      <div style={{ position: 'absolute', left: 56, top: 0, bottom: 0, width: 1, background: '#FFCCE0', opacity: 0.6 }} />
      <CategoryBadge catId={expense.category} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#2C1810', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{expense.memo || cat.name}</div>
        <div style={{ fontSize: 11, color: '#C0A888', marginTop: 1 }}>{dp} · {cat.name}</div>
      </div>
      {showDel ? (
        <button
          onClick={e => { e.stopPropagation(); onDelete?.(expense.id); setShowDel(false) }}
          style={{ background: '#FF4D90', color: 'white', border: 'none', borderRadius: 10, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
        >삭제</button>
      ) : (
        <span className="jua" style={{ fontSize: 15, color: '#2C1810', flexShrink: 0 }}>{formatAmount(expense.amount)}</span>
      )}
    </div>
  )
}

// ── Bottom Nav ────────────────────────────────────────────────

type TabId = 'home' | 'calendar' | 'stats' | 'profile'

function NavIcon({ id, active }: { id: TabId; active: boolean }) {
  const c = active ? '#9333EA' : '#C0A888'
  if (id === 'home') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1z" fill={active ? '#F3E8FF' : 'none'} stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 21V13h6v8" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  if (id === 'calendar') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" fill={active ? '#F3E8FF' : 'none'} stroke={c} />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1.3" fill={c} stroke="none" />
      <circle cx="12" cy="15" r="1.3" fill={c} stroke="none" />
      <circle cx="16" cy="15" r="1.3" fill={c} stroke="none" />
    </svg>
  )
  if (id === 'stats') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="14" width="4" height="7" rx="1.5" fill={active ? '#9333EA' : '#C0A888'} />
      <rect x="10" y="9" width="4" height="12" rx="1.5" fill={active ? '#9333EA' : '#C0A888'} />
      <rect x="16" y="4" width="4" height="17" rx="1.5" fill={active ? '#9333EA' : '#C0A888'} />
    </svg>
  )
  if (id === 'profile') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={active ? '#9333EA' : '#C0A888'} />
      <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  return null
}

export function BottomNav({ current, onChange }: { current: TabId; onChange: (id: TabId | 'add') => void }) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'home', label: '홈' },
    { id: 'calendar', label: '달력' },
  ]
  const tabs2: { id: TabId; label: string }[] = [
    { id: 'stats', label: '통계' },
    { id: 'profile', label: '설정' },
  ]
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFDF7', borderTop: '2px solid #F0E4D4', display: 'flex', alignItems: 'flex-start', paddingTop: 10, paddingBottom: 'env(safe-area-inset-bottom)', minHeight: 80, zIndex: 100 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit' }}>
          <NavIcon id={t.id} active={current === t.id} />
          <span style={{ fontSize: 10, color: current === t.id ? '#9333EA' : '#C0A888', fontWeight: current === t.id ? 700 : 400 }}>{t.label}</span>
        </button>
      ))}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <button onClick={() => onChange('add')}
          style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(145deg, #E879F9 0%, #9333EA 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(147,51,234,0.45)', transform: 'translateY(-12px)', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <span style={{ fontSize: 10, color: '#C0A888', marginTop: -9 }}>추가</span>
      </div>
      {tabs2.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit' }}>
          <NavIcon id={t.id} active={current === t.id} />
          <span style={{ fontSize: 10, color: current === t.id ? '#9333EA' : '#C0A888', fontWeight: current === t.id ? 700 : 400 }}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Month Nav ─────────────────────────────────────────────────

export function MonthNav({ value, onChange }: { value: string; onChange: (ym: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <button onClick={() => onChange(prevMonth(value))}
        style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0E8D8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A5C4A' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <span className="jua" style={{ fontSize: 16, color: '#2C1810', minWidth: 114, textAlign: 'center' }}>{ymLabel(value)}</span>
      <button onClick={() => onChange(nextMonth(value))}
        style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0E8D8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A5C4A' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  )
}
