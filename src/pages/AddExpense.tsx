import { useState } from 'react'
import { WashiTape, PaperFold, CategoryBadge, PawPrint } from '../components/ui'
import { CATEGORY_OPTIONS, STICKY_COLORS } from '../types'
import type { Expense, ExpenseCategory } from '../types'

interface Props {
  onClose: () => void
  onAdd: (expense: Expense) => void
}

export default function AddExpenseSheet({ onClose, onAdd }: Props) {
  const [selCat, setSelCat] = useState<ExpenseCategory | null>(null)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [memo, setMemo] = useState('')

  function handleKey(key: string) {
    if (key === 'back') { setAmount(p => p.slice(0, -1)); return }
    setAmount(p => {
      if (p.length >= 8) return p
      if (p === '' && key === '00') return p
      return p + key
    })
  }

  function generateId() {
    try { return crypto.randomUUID() } catch {}
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
  }

  function handleAdd() {
    const amt = parseInt(amount, 10)
    if (!selCat || !amt) return
    const cat = CATEGORY_OPTIONS.find(c => c.category === selCat)!
    onAdd({ id: generateId(), petId: '1', category: selCat, amount: amt, date, memo: memo || cat.name })
    onClose()
  }

  const numKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'back']
  const canSave = selCat && amount && parseInt(amount, 10) > 0

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(44,24,16,0.45)', backdropFilter: 'blur(3px)' }} />

      <div style={{ position: 'relative', background: '#FFFDF7', borderRadius: '26px 26px 0 0', paddingBottom: 34, zIndex: 1, animation: 'slideUp 0.3s cubic-bezier(0.34,1.1,0.64,1)', maxHeight: '92%', overflowY: 'auto', borderTop: '3px solid #F0E4D4' }} className="scroll-area">

        {/* Washi tape handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)' }}>
            <WashiTape c1="#FFB3C6" c2="#FFCAD5" width={80} angle={0} />
          </div>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#F0E4D4', position: 'relative', zIndex: 1, marginTop: 4 }} />
        </div>

        <div style={{ padding: '8px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span className="jua" style={{ fontSize: 17, color: '#2C1810' }}>지출 추가</span>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0E8D8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7A5C4A" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Category grid */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#C0A888', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 10 }}>카테고리</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {CATEGORY_OPTIONS.map(cat => {
                const active = selCat === cat.category
                const sc = STICKY_COLORS[cat.category]
                return (
                  <button key={cat.category} onClick={() => setSelCat(cat.category)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '11px 6px 9px', borderRadius: 14, background: active ? sc.bg : '#F8F4EE', border: `2px solid ${active ? cat.color : 'transparent'}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', boxShadow: active ? '2px 3px 8px rgba(0,0,0,0.12)' : 'none', position: 'relative', overflow: 'hidden' }}>
                    {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cat.color }} />}
                    {active && (
                      <div style={{ position: 'absolute', bottom: -6, right: -4, opacity: 0.12 }}>
                        <PawPrint size={36} color={cat.color} />
                      </div>
                    )}
                    <div style={{ position: 'relative' }}>
                      <CategoryBadge catId={cat.category} size={38} />
                      {active && (
                        <div style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14, borderRadius: '50%', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                          <svg width="7" height="7" viewBox="0 0 10 10" fill="white"><path d="M1.5 5L4 7.5L8.5 2" /></svg>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: active ? cat.color : '#7A5C4A', lineHeight: 1.2, textAlign: 'center', position: 'relative', zIndex: 1 }}>{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date & Memo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: '#C0A888', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 5 }}>날짜</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #F0E4D4', borderRadius: 10, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', color: '#2C1810', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#C0A888', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 5 }}>메모</div>
              <input value={memo} onChange={e => setMemo(e.target.value)}
                placeholder={selCat ? (CATEGORY_OPTIONS.find(c => c.category === selCat)?.name ?? '내용 입력') : '내용 입력'}
                style={{ width: '100%', border: '1.5px solid #F0E4D4', borderRadius: 10, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', color: '#2C1810', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
            </div>
          </div>

          {/* Amount display */}
          <div style={{ background: '#FFF3C4', borderRadius: 14, padding: '14px 18px', marginBottom: 12, textAlign: 'center', border: '1px solid #FFD970', boxShadow: '1px 2px 6px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden' }}>
            <PaperFold bg="#FFF3C4" />
            <div style={{ fontSize: 11, color: '#8B6200', marginBottom: 3, fontWeight: 600 }}>금액</div>
            <div className="jua" style={{ fontSize: 30, color: amount ? '#2C1810' : '#D4C0A0', lineHeight: 1 }}>
              {amount ? parseInt(amount, 10).toLocaleString('ko-KR') + '원' : '0원'}
            </div>
          </div>

          {/* Numpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, marginBottom: 14 }}>
            {numKeys.map(key => (
              <button key={key} onClick={() => handleKey(key)}
                style={{ padding: '13px 0', borderRadius: 12, border: 'none', background: key === 'back' ? '#F0E8D8' : '#F8F4EE', fontSize: key === 'back' ? 18 : 20, fontWeight: 700, color: '#2C1810', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {key === 'back' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A5C4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13V4z" /><path d="M18 9l-5 5M13 9l5 5" />
                  </svg>
                ) : key}
              </button>
            ))}
          </div>

          <button onClick={handleAdd} disabled={!canSave}
            style={{ width: '100%', padding: 15, borderRadius: 14, border: 'none', background: canSave ? 'linear-gradient(135deg, #E879F9, #9333EA)' : '#F0E8D8', color: canSave ? 'white' : '#C0A888', fontSize: 16, fontWeight: 800, cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit', letterSpacing: '-0.01em', boxShadow: canSave ? '0 4px 16px rgba(147,51,234,0.4)' : 'none', transition: 'all 0.2s' }}>
            <span className="jua">저장하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
