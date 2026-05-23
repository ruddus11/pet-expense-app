import { SpiralRings, WashiTape, PawPrint, PaperFold, DonutChart, BudgetBar, CategoryMiniCard, ExpenseItem, MonthNav } from '../components/ui'
import { CATEGORY_OPTIONS, filterByMonth, getTotal, getCatTotal, formatAmount, ymLabel } from '../types'
import type { Expense, Pet, Budget } from '../types'

interface Props {
  expenses: Expense[]
  pet: Pet
  budget: Budget
  month: string
  onMonthChange: (m: string) => void
  onDeleteExpense: (id: string) => void
}

export default function HomeScreen({ expenses, pet, budget, month, onMonthChange, onDeleteExpense }: Props) {
  const monthExp = filterByMonth(expenses, month)
  const totalSpent = getTotal(monthExp)
  const over = totalSpent > budget.total
  const recent = [...monthExp].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FEF9F3' }}>

      {/* Notebook Header */}
      <div style={{ background: '#FFFDF7', flexShrink: 0, borderBottom: '2px solid #F0E4D4' }}>
        <SpiralRings />
        <div style={{ padding: '10px 20px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', paddingTop: 8 }}>
            <div style={{ position: 'absolute', top: 0, left: -4 }}>
              <WashiTape c1="#FFB3C6" c2="#FFCAD5" width={80} angle={-1.5} />
            </div>
            <div className="jua" style={{ fontSize: 22, color: '#2C1810', letterSpacing: '-0.01em', lineHeight: 1.1, paddingTop: 4 }}>하루</div>
            <div style={{ fontSize: 11, color: '#C0A888', marginTop: 3, letterSpacing: '0.02em' }}>반려동물의 모든 지출을 기록해요</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #E879F9, #9333EA)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(147,51,234,0.35), 0 0 0 3px #FEF9F3, 0 0 0 5px #F0E4D4' }}>
                {pet.photo
                  ? <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className="jua" style={{ fontSize: 20, color: 'white' }}>{pet.name?.[0] ?? '🐾'}</span>
                }
              </div>
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: 'white', border: '1.5px solid #F0E4D4', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                <PawPrint size={11} color="#E879F9" />
              </div>
            </div>
            <span className="jua" style={{ fontSize: 12, color: '#2C1810' }}>{pet.name}</span>
          </div>
        </div>
        <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#FFF3C4', borderRadius: 20, padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px dashed #FFD970', boxShadow: '1px 1px 4px rgba(0,0,0,0.07)' }}>
            <PawPrint size={14} color="#D4A800" />
            <span className="jua" style={{ fontSize: 12, color: '#6B4C00' }}>{pet.name}와 함께한 {ymLabel(month)}</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 16px' }}>

        <div style={{ marginBottom: 14 }}>
          <MonthNav value={month} onChange={onMonthChange} />
        </div>

        {/* Budget sticky note */}
        <div style={{ position: 'relative', background: '#FFF3C4', borderRadius: 16, padding: '20px 20px 18px', marginBottom: 16, boxShadow: '2px 4px 12px rgba(0,0,0,0.12), 0 1px 0 rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)' }}>
            <WashiTape c1="#A8D8FF" c2="#C8E8FF" width={72} angle={0} />
          </div>
          <div style={{ position: 'absolute', top: -10, right: -8, opacity: 0.12 }}>
            <PawPrint size={88} color="#8B6200" />
          </div>
          <div style={{ position: 'absolute', bottom: -12, left: 8, opacity: 0.07, transform: 'rotate(-15deg)' }}>
            <PawPrint size={68} color="#8B6200" />
          </div>
          <PaperFold bg="#FFF3C4" />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 12, color: '#8B6200', fontWeight: 600, letterSpacing: '0.03em', marginBottom: 6 }}>이번 달 지출</div>
            <div className="jua" style={{ fontSize: 34, color: '#2C1810', lineHeight: 1, marginBottom: 16, letterSpacing: '-0.02em' }}>{formatAmount(totalSpent)}</div>
            <BudgetBar spent={totalSpent} budget={budget.total} />
            <div style={{ height: 1, background: '#FFD970', opacity: 0.6, margin: '10px 0 8px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8B6200' }}>
              <span>예산 {formatAmount(budget.total)}</span>
              <span style={{ fontWeight: 700 }}>{over ? '⚠ 초과!' : `${formatAmount(budget.total - totalSpent)} 남음`}</span>
            </div>
          </div>
        </div>

        {/* Category section */}
        {totalSpent > 0 ? (
          <div style={{ background: '#FFFDF7', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '1px 3px 10px rgba(0,0,0,0.07)', border: '1px solid #F0E4D4', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -6, right: 22 }}>
              <WashiTape c1="#B8FFDA" c2="#D0FFE8" width={50} angle={1} />
            </div>
            <div className="jua" style={{ fontSize: 15, color: '#2C1810', marginBottom: 14 }}>카테고리별 지출</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <DonutChart expenses={monthExp} size={130} strokeWidth={18} />
            </div>
            <div style={{ height: 1, background: '#F0E4D4', marginBottom: 12 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
              {CATEGORY_OPTIONS.map(cat => {
                const amt = getCatTotal(monthExp, cat.category)
                if (!amt) return null
                const pct = totalSpent > 0 ? Math.round(amt / totalSpent * 100) : 0
                return <CategoryMiniCard key={cat.category} catId={cat.category} amount={amt} pct={pct} />
              })}
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFDF7', borderRadius: 16, padding: '28px 20px', marginBottom: 14, textAlign: 'center', border: '2px dashed #F0E4D4' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFF3C4', border: '2px dashed #FFD970', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A800" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            <div className="jua" style={{ fontSize: 14, color: '#C0A888' }}>이번 달 지출이 없어요</div>
            <div style={{ fontSize: 12, color: '#D0C0A8', marginTop: 4 }}>아래 + 버튼으로 추가해요</div>
          </div>
        )}

        {/* Recent expenses */}
        <div style={{ background: '#FFFDF7', borderRadius: 16, overflow: 'hidden', border: '1px solid #F0E4D4', boxShadow: '1px 3px 10px rgba(0,0,0,0.07)' }}>
          <div style={{ padding: '12px 16px 10px', borderBottom: '2px solid #F0E4D4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 16, background: '#FF4D90', borderRadius: 2 }} />
              <span className="jua" style={{ fontSize: 14, color: '#2C1810' }}>최근 지출</span>
            </div>
            {monthExp.length > 0 && (
              <span style={{ background: '#FFF3C4', border: '1px solid #FFD970', borderRadius: 12, padding: '2px 10px', fontSize: 11, color: '#8B6200', fontWeight: 700 }}>
                총 {monthExp.length}건
              </span>
            )}
          </div>
          {recent.length > 0 ? (
            <div>{recent.map(e => <ExpenseItem key={e.id} expense={e} onDelete={onDeleteExpense} />)}</div>
          ) : (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#C0A888', fontSize: 13 }}>지출 내역이 없어요</div>
          )}
        </div>
        <div style={{ height: 12 }} />
      </div>
    </div>
  )
}
