import { SpiralRings, WashiTape, PawPrint, PaperFold, DonutChart, BudgetBar, CategoryBadge, MonthNav } from '../components/ui'
import { CATEGORY_OPTIONS, filterByMonth, getTotal, getCatTotal, formatAmount, ymLabel, prevMonth } from '../types'
import type { Expense, Budget } from '../types'

interface Props {
  expenses: Expense[]
  budget: Budget
  month: string
  onMonthChange: (m: string) => void
  petName?: string
}

export default function StatsScreen({ expenses, budget, month, onMonthChange, petName = '우리 아이' }: Props) {
  const monthExp = filterByMonth(expenses, month)
  const prevM = prevMonth(month)
  const prevExp = filterByMonth(expenses, prevM)
  const total = getTotal(monthExp)
  const prevTotal = getTotal(prevExp)
  const diff = total - prevTotal

  const pct = budget.total > 0 ? total / budget.total : 0
  const tipMsg = pct >= 1
    ? '이번 달 예산을 초과했어요. 다음 달엔 예산을 조정해볼까요?'
    : pct >= 0.8
    ? `예산의 ${Math.round(pct * 100)}%를 썼어요! 이번 달 조금만 더 아껴봐요 💪`
    : pct >= 0.5
    ? '알뜰하게 잘 쓰고 있어요! 이 정도면 아주 좋아요 😊'
    : `이번 달 절약 중! ${petName}가 기뻐하겠어요`

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FEF9F3' }}>

      <div style={{ background: '#FFFDF7', borderBottom: '2px solid #F0E4D4', flexShrink: 0 }}>
        <SpiralRings />
        <div style={{ padding: '10px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 4, height: 18, background: '#9333EA', borderRadius: 2 }} />
            <span className="jua" style={{ fontSize: 16, color: '#2C1810' }}>지출 통계</span>
          </div>
          <MonthNav value={month} onChange={onMonthChange} />
        </div>
      </div>

      <div className="scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>

        {/* Summary sticky */}
        <div style={{ position: 'relative', background: '#F0E8FF', borderRadius: 16, padding: '18px 20px', marginBottom: 14, boxShadow: '2px 4px 10px rgba(0,0,0,0.1)', border: '1px solid #DDD0FF', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)' }}>
            <WashiTape c1="#C8B8FF" c2="#DDD0FF" width={68} angle={0} />
          </div>
          <PaperFold bg="#F0E8FF" />
          <div style={{ position: 'absolute', top: -8, right: -8, opacity: 0.1 }}>
            <PawPrint size={80} color="#5B00CC" />
          </div>
          <div style={{ fontSize: 12, color: '#7A5C4A', fontWeight: 600, marginBottom: 6, letterSpacing: '0.02em' }}>{ymLabel(month)} 총 지출</div>
          <div className="jua" style={{ fontSize: 36, color: '#2C1810', letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1 }}>{formatAmount(total)}</div>
          {prevTotal > 0 && (
            <div style={{ fontSize: 12, fontWeight: 700, color: diff > 0 ? '#FF4D90' : '#22C55E', marginBottom: 14 }}>
              {diff > 0 ? '▲ ' : '▼ '}{formatAmount(Math.abs(diff))} {diff > 0 ? '더 썼어요' : '절약했어요'}
            </div>
          )}
          {!prevTotal && <div style={{ marginBottom: 14 }} />}
          <BudgetBar spent={total} budget={budget.total} />
        </div>

        {/* Donut + legend */}
        {total > 0 && (
          <div style={{ background: '#FFFDF7', borderRadius: 16, padding: 16, marginBottom: 14, border: '1px solid #F0E4D4', boxShadow: '1px 3px 10px rgba(0,0,0,0.07)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -6, right: 20 }}>
              <WashiTape c1="#FFE0A0" c2="#FFF0C0" width={48} angle={1.5} />
            </div>
            <div className="jua" style={{ fontSize: 14, color: '#2C1810', marginBottom: 14 }}>카테고리 비율</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <DonutChart expenses={monthExp} size={160} strokeWidth={22} />
            </div>
            <div style={{ height: 1, background: '#F0E4D4', marginBottom: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {CATEGORY_OPTIONS.map(cat => {
                const amt = getCatTotal(monthExp, cat.category)
                if (!amt) return null
                const pct2 = total > 0 ? Math.round(amt / total * 100) : 0
                const catBudget = budget[cat.category] || 0
                const barPct = catBudget > 0 ? Math.min(amt / catBudget, 1) : 0
                const barColor = (catBudget > 0 && amt > catBudget) ? '#FF4D90' : cat.color
                return (
                  <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CategoryBadge catId={cat.category} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#2C1810' }}>{cat.name}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#C0A888' }}>{pct2}%</span>
                          <span className="jua" style={{ fontSize: 13, color: '#2C1810' }}>{formatAmount(amt)}</span>
                        </div>
                      </div>
                      {catBudget > 0 && (
                        <div style={{ height: 4, background: '#F0E4D4', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${barPct * 100}%`, background: barColor, borderRadius: 99 }} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Monthly comparison */}
        {(total > 0 || prevTotal > 0) && (
          <div style={{ background: '#FFFDF7', borderRadius: 16, padding: 16, marginBottom: 14, border: '1px solid #F0E4D4', boxShadow: '1px 3px 10px rgba(0,0,0,0.07)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -6, right: 16 }}>
              <WashiTape c1="#FFB3C6" c2="#FFCAD5" width={52} angle={1.5} />
            </div>
            <div className="jua" style={{ fontSize: 14, color: '#2C1810', marginBottom: 14 }}>월별 비교</div>
            {[prevM, month].map((m, idx) => {
              const exps = filterByMonth(expenses, m)
              const t = getTotal(exps)
              const maxT = Math.max(total, prevTotal, 1)
              const barW = maxT > 0 ? t / maxT * 100 : 0
              const stripe = idx === 1
                ? 'repeating-linear-gradient(90deg,#B06EFF 0px,#B06EFF 9px,#9333EA 9px,#9333EA 18px)'
                : 'repeating-linear-gradient(90deg,#FFB8D8 0px,#FFB8D8 9px,#FF8EC0 9px,#FF8EC0 18px)'
              return (
                <div key={m} style={{ marginBottom: idx === 0 ? 14 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: stripe }} />
                      <span style={{ fontSize: 12, color: '#7A5C4A', fontWeight: idx === 1 ? 700 : 400 }}>{ymLabel(m)}</span>
                    </div>
                    <span className="jua" style={{ fontSize: 13, color: '#2C1810' }}>{formatAmount(t)}</span>
                  </div>
                  <div style={{ height: 14, background: '#F0E4D4', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${barW}%`, background: stripe, borderRadius: 4, transition: 'width 0.6s ease', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 뽀짝이 tip */}
        {total > 0 && (
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <div style={{ background: '#FFF3C4', borderRadius: 16, padding: '13px 15px', border: '1.5px solid #FFD970', boxShadow: '1px 2px 6px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #E879F9, #9333EA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(147,51,234,0.3)' }}>
                  <PawPrint size={18} color="white" />
                </div>
                <div>
                  <div className="jua" style={{ fontSize: 11, color: '#8B6200', marginBottom: 3 }}>하루의 한마디</div>
                  <div style={{ fontSize: 13, color: '#2C1810', lineHeight: 1.5 }}>{tipMsg}</div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -9, left: 26, width: 0, height: 0, borderStyle: 'solid', borderWidth: '10px 7px 0', borderColor: '#FFD970 transparent transparent' }} />
            <div style={{ position: 'absolute', bottom: -7, left: 27, width: 0, height: 0, borderStyle: 'solid', borderWidth: '9px 6px 0', borderColor: '#FFF3C4 transparent transparent' }} />
          </div>
        )}

        {total === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#C0A888' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF3C4', border: '2px dashed #FFD970', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A800" strokeWidth="2" strokeLinecap="round">
                <rect x="4" y="14" width="4" height="7" rx="1.5" /><rect x="10" y="9" width="4" height="12" rx="1.5" /><rect x="16" y="4" width="4" height="17" rx="1.5" />
              </svg>
            </div>
            <div className="jua" style={{ fontSize: 14 }}>이번 달 데이터가 없어요</div>
          </div>
        )}
      </div>
    </div>
  )
}
