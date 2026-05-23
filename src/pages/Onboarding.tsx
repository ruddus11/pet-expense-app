import { useState, useRef } from 'react'
import { WashiTape, CategoryBadge, DonutChart } from '../components/ui'
import { CATEGORY_OPTIONS, formatAmount, getTotal, getCatTotal } from '../types'
import type { Expense, ExpenseCategory } from '../types'

// ── Decorative helpers ────────────────────────────────────────

function PawPrint({ size = 32, color = '#9333EA', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill={color} style={style}>
      <ellipse cx="9" cy="10" rx="4.5" ry="5.5" />
      <ellipse cx="20" cy="6.5" rx="4" ry="5" />
      <ellipse cx="31" cy="10" rx="4.5" ry="5.5" />
      <ellipse cx="4.5" cy="21" rx="3.5" ry="4.5" />
      <ellipse cx="20" cy="30" rx="11" ry="9" transform="rotate(-5,20,30)" />
    </svg>
  )
}

function SpiralRings() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 9, position: 'relative', zIndex: 2 }}>
      {Array.from({ length: 11 }).map((_, i) => (
        <div key={i} style={{ width: 11, height: 22, borderRadius: '50%', border: '2.5px solid #D0C0A8', background: 'white', position: 'relative', top: -11 }} />
      ))}
    </div>
  )
}

function DotIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 99, background: i === current ? '#9333EA' : '#D4C0E8', transition: 'all 0.3s cubic-bezier(0.34,1.2,0.64,1)' }} />
      ))}
    </div>
  )
}

// ── Step 0: Welcome ───────────────────────────────────────────

function StepWelcome() {
  const orbits = [
    { angle: -30, emoji: '🐾', sz: 28 },
    { angle: 80, emoji: '✨', sz: 22 },
    { angle: 190, emoji: '💜', sz: 20 },
    { angle: 300, emoji: '🐾', sz: 20 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0 28px', gap: 0 }}>
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 12 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg,#F3E8FF,#EDE0FF)', border: '3px solid #D4B8F0' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PawPrint size={88} color="#9333EA" />
        </div>
        {orbits.map((d, i) => {
          const rad = (d.angle * Math.PI) / 180
          const x = 80 + 68 * Math.cos(rad) - d.sz / 2
          const y = 80 + 68 * Math.sin(rad) - d.sz / 2
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: y, fontSize: d.sz, lineHeight: 1, animation: `floaty ${2.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
              {d.emoji}
            </div>
          )
        })}
      </div>
      <div className="jua" style={{ fontSize: 46, color: '#2C1810', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>하루</div>
      <div style={{ fontSize: 16, color: '#7A5C4A', fontWeight: 500, textAlign: 'center', lineHeight: 1.55, marginBottom: 6, wordBreak: 'keep-all' }}>
        반려동물과 함께하는<br />귀여운 지출 가계부
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <WashiTape c1="#FFB3C6" c2="#FFCAD5" width={44} angle={-2} />
        <WashiTape c1="#C4AAFF" c2="#DDD0FF" width={56} angle={1} />
        <WashiTape c1="#A8D8FF" c2="#C8E8FF" width={40} angle={-1.5} />
      </div>
    </div>
  )
}

// ── Step 1: Record ────────────────────────────────────────────

function StepRecord() {
  const [tapped, setTapped] = useState<ExpenseCategory | null>(null)
  const cats = CATEGORY_OPTIONS.slice(0, 4)
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div className="jua" style={{ fontSize: 26, color: '#2C1810', textAlign: 'center', marginBottom: 6, wordBreak: 'keep-all', lineHeight: 1.3 }}>
        지출을 간편하게<br />기록해요
      </div>
      <div style={{ fontSize: 13, color: '#7A5C4A', textAlign: 'center', marginBottom: 22, wordBreak: 'keep-all', lineHeight: 1.6 }}>
        카테고리를 선택하고 금액만<br />입력하면 끝!
      </div>
      <div style={{ width: '100%', background: '#FFFDF7', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #F0E4D4', boxShadow: '2px 4px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '10px 0 0' }}>
          <WashiTape c1="#FFB3C6" c2="#FFCAD5" width={50} angle={-1} />
          <WashiTape c1="#C4AAFF" c2="#DDD0FF" width={60} angle={1} />
        </div>
        <div style={{ padding: '14px 16px 18px' }}>
          <div className="jua" style={{ fontSize: 14, color: '#7A5C4A', marginBottom: 12, textAlign: 'center', letterSpacing: '0.02em' }}>
            카테고리를 눌러보세요 👇
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {cats.map(cat => {
              const active = tapped === cat.category
              return (
                <button key={cat.category} onClick={() => setTapped(cat.category)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 13, background: active ? cat.bg : '#F8F4EE', border: `2px solid ${active ? cat.color : 'transparent'}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s cubic-bezier(0.34,1.2,0.64,1)', transform: active ? 'scale(1.04)' : 'scale(1)', boxShadow: active ? '0 4px 12px rgba(0,0,0,0.12)' : 'none' }}>
                  <CategoryBadge catId={cat.category} size={32} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? cat.color : '#2C1810', lineHeight: 1 }}>{cat.name}</div>
                    {active && <div className="jua" style={{ fontSize: 11, color: cat.color, marginTop: 3 }}>선택됨 ✓</div>}
                  </div>
                </button>
              )
            })}
          </div>
          {tapped && (
            <div style={{ marginTop: 12, background: '#F3E8FF', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#7A5C4A' }}>{CATEGORY_OPTIONS.find(c => c.category === tapped)?.name}</span>
              <span className="jua" style={{ fontSize: 16, color: '#9333EA' }}>35,000원</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Chart ─────────────────────────────────────────────

const DEMO_EXPENSES: Expense[] = [
  { id: 'd1', petId: '1', category: 'food', amount: 45000, date: '2026-05-01', memo: '' },
  { id: 'd2', petId: '1', category: 'vet', amount: 85000, date: '2026-05-01', memo: '' },
  { id: 'd3', petId: '1', category: 'groom', amount: 35000, date: '2026-05-01', memo: '' },
  { id: 'd4', petId: '1', category: 'toys', amount: 18000, date: '2026-05-01', memo: '' },
  { id: 'd5', petId: '1', category: 'insurance', amount: 30000, date: '2026-05-01', memo: '' },
]

function StepChart() {
  const [active, setActive] = useState<ExpenseCategory | null>(null)
  const total = getTotal(DEMO_EXPENSES)
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div className="jua" style={{ fontSize: 26, color: '#2C1810', textAlign: 'center', marginBottom: 6, wordBreak: 'keep-all', lineHeight: 1.3 }}>
        카테고리별로<br />한눈에 확인해요
      </div>
      <div style={{ fontSize: 13, color: '#7A5C4A', textAlign: 'center', marginBottom: 18, lineHeight: 1.6 }}>
        도넛 차트로 어디에 얼마를<br />썼는지 바로 파악해요
      </div>
      <div style={{ background: '#FFFDF7', borderRadius: 20, border: '1.5px solid #F0E4D4', boxShadow: '2px 4px 16px rgba(0,0,0,0.1)', padding: 18, width: '100%' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <DonutChart expenses={DEMO_EXPENSES} size={120} strokeWidth={18} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CATEGORY_OPTIONS.filter(c => getCatTotal(DEMO_EXPENSES, c.category) > 0).map(cat => {
              const amt = getCatTotal(DEMO_EXPENSES, cat.category)
              const pct = Math.round(amt / total * 100)
              const isActive = active === cat.category
              return (
                <button key={cat.category} onClick={() => setActive(isActive ? null : cat.category)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, background: isActive ? cat.bg : 'transparent', borderRadius: 8, padding: '4px 6px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', transform: isActive ? 'scale(1.03)' : 'scale(1)' }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: isActive ? cat.color : '#7A5C4A', flex: 1, textAlign: 'left', fontWeight: isActive ? 700 : 400 }}>{cat.name}</span>
                  <span className="jua" style={{ fontSize: 11, color: isActive ? cat.color : '#2C1810' }}>{pct}%</span>
                </button>
              )
            })}
            <div style={{ fontSize: 10, color: '#C0A888', marginTop: 2, paddingLeft: 6 }}>탭해서 확인해보세요</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Budget ────────────────────────────────────────────

function StepBudget() {
  const [budget, setBudget] = useState(200000)
  const spent = 213500
  const pct = Math.min(spent / budget, 1)
  const over = spent > budget
  const barColor = over ? '#FF4D90' : pct >= 0.8 ? '#FB923C' : '#9333EA'
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div className="jua" style={{ fontSize: 26, color: '#2C1810', textAlign: 'center', marginBottom: 6, wordBreak: 'keep-all', lineHeight: 1.3 }}>
        예산을 설정하고<br />초과를 방지해요
      </div>
      <div style={{ fontSize: 13, color: '#7A5C4A', textAlign: 'center', marginBottom: 18, lineHeight: 1.6 }}>
        슬라이더로 예산을 바꿔보세요!
      </div>
      <div style={{ background: '#FFFDF7', borderRadius: 20, border: '1.5px solid #F0E4D4', boxShadow: '2px 4px 16px rgba(0,0,0,0.1)', padding: 20, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 4 }}>이번 달 지출</div>
            <div className="jua" style={{ fontSize: 28, color: '#2C1810', letterSpacing: '-0.02em' }}>{formatAmount(spent)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 4 }}>설정 예산</div>
            <div className="jua" style={{ fontSize: 18, color: barColor, letterSpacing: '-0.01em' }}>{formatAmount(budget)}</div>
          </div>
        </div>
        <div style={{ height: 12, background: '#F0E4D4', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${pct * 100}%`, background: barColor, borderRadius: 99, transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: barColor }}>{over ? '⚠ 예산 초과!' : `${Math.round(pct * 100)}% 사용`}</span>
          <span style={{ fontSize: 12, color: '#C0A888' }}>{over ? `+${formatAmount(spent - budget)}` : `${formatAmount(budget - spent)} 남음`}</span>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#7A5C4A', marginBottom: 8, fontWeight: 500 }}>예산 슬라이더 (직접 조절해보세요)</div>
          <input type="range" min={100000} max={400000} step={10000} value={budget}
            onChange={e => setBudget(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: '#9333EA', cursor: 'pointer', height: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#C0A888', marginTop: 4 }}>
            <span>10만원</span><span>40만원</span>
          </div>
        </div>
        {over && (
          <div style={{ marginTop: 12, background: '#FFF0F5', borderRadius: 10, padding: '9px 13px', border: '1px solid #FFB8D8', fontSize: 12, color: '#FF4D90', fontWeight: 600 }}>
            💸 예산을 올리거나 지출을 줄여봐요!
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step 4: Calendar ──────────────────────────────────────────

const CAL_DOT_DAYS: Record<number, ExpenseCategory[]> = {
  5: ['food'], 10: ['vet'], 15: ['insurance'], 19: ['vet'], 20: ['groom', 'food'], 22: ['toys'],
}

const CAL_AMOUNTS: Record<string, string> = {
  food: '12,000', vet: '85,000', groom: '35,000', insurance: '30,000', toys: '18,000', training: '15,000',
}

function StepCalendar() {
  const [selDay, setSelDay] = useState<number | null>(null)
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div className="jua" style={{ fontSize: 26, color: '#2C1810', textAlign: 'center', marginBottom: 6, wordBreak: 'keep-all', lineHeight: 1.3 }}>
        달력으로 날짜별<br />지출을 확인해요
      </div>
      <div style={{ fontSize: 13, color: '#7A5C4A', textAlign: 'center', marginBottom: 18, lineHeight: 1.6 }}>
        날짜를 탭하면 그날의<br />지출이 보여요
      </div>
      <div style={{ background: '#FFFDF7', borderRadius: 20, border: '1.5px solid #F0E4D4', boxShadow: '2px 4px 16px rgba(0,0,0,0.1)', padding: 16, width: '100%' }}>
        <div className="jua" style={{ fontSize: 15, color: '#7A5C4A', textAlign: 'center', marginBottom: 12 }}>2026년 5월</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: i === 0 ? '#FF4D90' : i === 6 ? '#3B9EFF' : '#C0A888', paddingBottom: 4 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 0' }}>
          {/* May 2026 starts on Friday (index 5) */}
          {[0, 1, 2, 3, 4].map(i => <div key={`e${i}`} />)}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
            const dots = CAL_DOT_DAYS[d] || []
            const sel = selDay === d
            const dow = (5 + d - 1) % 7
            return (
              <div key={d} onClick={() => setSelDay(sel ? null : d)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 1px', cursor: dots.length ? 'pointer' : 'default', borderRadius: 8, background: sel ? '#9333EA' : 'transparent', transition: 'background 0.15s' }}>
                <span className="jua" style={{ fontSize: 11, color: sel ? 'white' : dow === 0 ? '#FF4D90' : dow === 6 ? '#3B9EFF' : '#2C1810', width: 22, textAlign: 'center', lineHeight: '22px', fontWeight: sel ? 700 : 400 }}>{d}</span>
                <div style={{ height: 5, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                  {dots.slice(0, 3).map((c, ci) => {
                    const cat = CATEGORY_OPTIONS.find(x => x.category === c)
                    return <div key={ci} style={{ width: 4, height: 4, borderRadius: '50%', background: sel ? 'rgba(255,255,255,0.8)' : (cat?.color ?? '#9333EA') }} />
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {selDay && CAL_DOT_DAYS[selDay] && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F0E4D4' }}>
            <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 8 }}>5월 {selDay}일 지출</div>
            {CAL_DOT_DAYS[selDay].map((c, ci) => {
              const cat = CATEGORY_OPTIONS.find(x => x.category === c)
              return (
                <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: ci < CAL_DOT_DAYS[selDay].length - 1 ? 6 : 0 }}>
                  <CategoryBadge catId={c} size={26} />
                  <span style={{ fontSize: 12, color: '#2C1810', fontWeight: 500 }}>{cat?.name}</span>
                  <span className="jua" style={{ marginLeft: 'auto', fontSize: 13, color: '#2C1810' }}>{CAL_AMOUNTS[c]}원</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step 5: Get Started ───────────────────────────────────────

interface OnboardingResult {
  petName: string
  species: string
  photo: string | null
}

function StepStart({ onComplete }: { onComplete: (info: OnboardingResult) => void }) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('고양이')
  const [photo, setPhoto] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [started, setStarted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleStart() {
    if (started) return
    setStarted(true)
    setTimeout(() => {
      onComplete({ petName: name || '내 아이', species, photo })
    }, 500)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px', overflowY: 'auto' }} className="scroll-area">
      <div className="jua" style={{ fontSize: 24, color: '#2C1810', textAlign: 'center', marginBottom: 4, wordBreak: 'keep-all', lineHeight: 1.3 }}>
        하루와 함께<br />시작해볼까요? 🐾
      </div>
      <div style={{ fontSize: 12, color: '#7A5C4A', textAlign: 'center', marginBottom: 18, lineHeight: 1.6 }}>
        사진과 이름을 등록해주세요
      </div>

      {/* Photo avatar */}
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{ width: 100, height: 100, borderRadius: '50%', cursor: 'pointer', background: photo ? 'transparent' : 'linear-gradient(135deg,#F3E8FF,#E9D5FF)', border: dragOver ? '3px solid #9333EA' : photo ? '3px solid #E9D5FF' : '2.5px dashed #C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', boxShadow: photo ? '0 6px 24px rgba(147,51,234,0.35)' : '0 2px 12px rgba(147,51,234,0.15)', transition: 'all 0.2s' }}>
          {photo ? (
            <img src={photo} alt="pet" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : name ? (
            <span className="jua" style={{ fontSize: 38, color: '#9333EA' }}>{name[0]}</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{ fontSize: 9, color: '#C084FC', fontWeight: 700, letterSpacing: '0.03em' }}>사진 추가</span>
            </div>
          )}
        </div>
        <button onClick={() => fileRef.current?.click()}
          style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', background: '#9333EA', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(147,51,234,0.4)' }}>
          {photo ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </button>
        {photo && (
          <button onClick={e => { e.stopPropagation(); setPhoto(null) }}
            style={{ position: 'absolute', top: 2, right: 2, width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: '1.5px solid #F0E4D4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7A5C4A" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files?.[0])} />
      </div>

      <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 16, textAlign: 'center' }}>
        {photo ? '✓ 사진이 등록됐어요!' : '탭하거나 사진을 드래그해서 올려주세요'}
      </div>

      {/* Name */}
      <div style={{ width: '100%', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: '#C0A888', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>이름</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="예) 루나, 코코, 초코..." maxLength={10}
          style={{ width: '100%', border: '2px solid #E8DCF5', borderRadius: 14, padding: '12px 16px', fontSize: 15, fontFamily: 'inherit', color: '#2C1810', outline: 'none', boxSizing: 'border-box', background: '#FFFDF7', textAlign: 'center', letterSpacing: '0.02em' }} />
      </div>

      {/* Species */}
      <div style={{ width: '100%', marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: '#C0A888', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>종류</div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {['고양이', '강아지', '토끼', '햄스터', '새', '기타'].map(s => {
            const sel = species === s
            return (
              <button key={s} onClick={() => setSpecies(s)}
                style={{ padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', border: sel ? 'none' : '1.5px solid #E8DCF5', background: sel ? '#9333EA' : '#FFFDF7', color: sel ? 'white' : '#7A5C4A', transition: 'all 0.15s' }}>
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <button onClick={handleStart}
        style={{ width: '100%', padding: 16, borderRadius: 18, border: 'none', background: started ? '#D4B8F0' : 'linear-gradient(135deg,#E879F9,#9333EA)', color: 'white', fontSize: 16, fontFamily: 'inherit', cursor: started ? 'default' : 'pointer', boxShadow: started ? 'none' : '0 6px 20px rgba(147,51,234,0.4)', transition: 'all 0.2s', letterSpacing: '0.02em' }}>
        <span className="jua">{started ? '시작 중... 🐾' : name ? `${name}와 함께 시작하기 🐾` : '하루 시작하기 🐾'}</span>
      </button>
      <div style={{ height: 16 }} />
    </div>
  )
}

// ── Main Onboarding Wrapper ───────────────────────────────────

const STEP_COMPONENTS = [StepWelcome, StepRecord, StepChart, StepBudget, StepCalendar]
const TOTAL_STEPS = STEP_COMPONENTS.length // 5 content steps + 1 start step

export default function OnboardingFlow({ onComplete }: { onComplete: (info: OnboardingResult) => void }) {
  const [step, setStep] = useState(0)

  function goNext() {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
  }
  function goPrev() {
    if (step > 0) setStep(s => s - 1)
  }
  function handleSkip() {
    onComplete({ petName: '내 아이', species: '고양이', photo: null })
  }

  const isLast = step === TOTAL_STEPS
  const ActiveStep = STEP_COMPONENTS[step]

  return (
    <div style={{ width: '100%', height: '100%', background: '#FEF9F3', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Spiral rings */}
      <div style={{ background: '#F5EDD8', borderBottom: '2px solid #E8D8B8', paddingTop: 4, position: 'relative', zIndex: 2 }}>
        <SpiralRings />
      </div>

      {/* Skip button */}
      {!isLast && (
        <div style={{ position: 'absolute', top: 28, right: 18, zIndex: 10 }}>
          <button onClick={handleSkip}
            style={{ background: 'rgba(255,255,255,0.8)', border: '1.5px solid #E8DCF5', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#7A5C4A', cursor: 'pointer', fontFamily: 'inherit' }}>
            건너뛰기
          </button>
        </div>
      )}

      {/* Step content */}
      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 0 0', animation: 'fadeSlideUp 0.28s cubic-bezier(0.34,1,0.64,1)', overflow: 'hidden' }}>
        {isLast ? <StepStart onComplete={onComplete} /> : <ActiveStep />}
      </div>

      {/* Bottom controls */}
      <div style={{ padding: '16px 24px 36px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
        <DotIndicator total={TOTAL_STEPS + 1} current={step} />
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={goPrev}
              style={{ flex: 1, padding: 14, borderRadius: 14, border: '2px solid #E8DCF5', background: 'white', fontSize: 15, fontFamily: 'inherit', color: '#7A5C4A', cursor: 'pointer' }}>
              <span className="jua">← 이전</span>
            </button>
          )}
          {!isLast && (
            <button onClick={goNext}
              style={{ flex: 2, padding: 14, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#C084FC,#9333EA)', fontSize: 15, fontFamily: 'inherit', color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(147,51,234,0.35)', letterSpacing: '0.01em' }}>
              <span className="jua">{step === TOTAL_STEPS - 1 ? '시작하기 →' : '다음 →'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
