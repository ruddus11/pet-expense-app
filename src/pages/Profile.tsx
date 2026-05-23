import { useState, useRef } from 'react'
import { SpiralRings, WashiTape, PaperFold, CategoryBadge } from '../components/ui'
import { CATEGORY_OPTIONS, formatAmount, getAge } from '../types'
import type { Pet, Budget } from '../types'

interface Props {
  pet: Pet
  budget: Budget
  onUpdatePet: (pet: Pet) => void
  onUpdateBudget: (budget: Budget) => void
}

export default function ProfileScreen({ pet, budget, onUpdatePet, onUpdateBudget }: Props) {
  const [editPet, setEditPet] = useState(false)
  const [editBudget, setEditBudget] = useState(false)
  const [petForm, setPetForm] = useState(pet)
  const [budgetForm, setBudgetForm] = useState(budget)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const age = getAge(pet.birthday)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const photo = ev.target?.result as string
      const updated = { ...petForm, photo }
      setPetForm(updated)
      onUpdatePet(updated)
    }
    reader.readAsDataURL(file)
  }

  function savePet() { onUpdatePet(petForm); setEditPet(false) }
  function saveBudget() {
    const s = CATEGORY_OPTIONS.reduce((acc, c) => acc + (parseInt(String(budgetForm[c.category] ?? 0), 10) || 0), 0)
    onUpdateBudget({ ...budgetForm, total: s || budgetForm.total })
    setEditBudget(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FEF9F3' }}>

      <div style={{ background: '#FFFDF7', borderBottom: '2px solid #F0E4D4', flexShrink: 0 }}>
        <SpiralRings />
        <div style={{ padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 18, background: '#FF6B4A', borderRadius: 2 }} />
          <span className="jua" style={{ fontSize: 16, color: '#2C1810' }}>프로필 · 설정</span>
        </div>
      </div>

      <div className="scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>

        {/* Pet profile sticky */}
        <div style={{ position: 'relative', background: '#FFE8F4', borderRadius: 16, padding: 18, marginBottom: 14, boxShadow: '2px 4px 10px rgba(0,0,0,0.1)', border: '1px solid #FFB8D8', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -6, left: 20 }}>
            <WashiTape c1="#FFB3C6" c2="#FFCAD5" width={60} angle={-1.5} />
          </div>
          <PaperFold bg="#FFE8F4" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="jua" style={{ fontSize: 14, color: '#2C1810' }}>반려동물 정보</span>
            <button onClick={() => editPet ? savePet() : setEditPet(true)}
              style={{ background: editPet ? '#9333EA' : 'white', color: editPet ? 'white' : '#9333EA', border: '2px solid #9333EA', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {editPet ? '저장' : '편집'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: editPet ? 16 : 0 }}>
            {/* Avatar — tap to change photo */}
            <div style={{ position: 'relative', flexShrink: 0 }} onClick={() => fileInputRef.current?.click()}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #E879F9, #9333EA)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(147,51,234,0.3), 0 0 0 3px white, 0 0 0 5px #FFB8D8', cursor: 'pointer' }}>
                {pet.photo
                  ? <img src={pet.photo} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className="jua" style={{ fontSize: 24, color: 'white' }}>{pet.name?.[0] ?? '🐾'}</span>
                }
              </div>
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', border: '2px solid white' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>
            <div>
              <div className="jua" style={{ fontSize: 20, color: '#2C1810' }}>{pet.name}</div>
              <div style={{ fontSize: 13, color: '#7A5C4A', marginTop: 2 }}>{pet.breed} · {pet.gender}</div>
              <div style={{ fontSize: 12, color: '#C0A888', marginTop: 2 }}>{age} · {pet.birthday}</div>
            </div>
          </div>
          {editPet && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([{ key: 'name', label: '이름', type: 'text' }, { key: 'species', label: '종류', type: 'text' }, { key: 'breed', label: '품종', type: 'text' }, { key: 'birthday', label: '생일', type: 'date' }] as const).map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 4, fontWeight: 600 }}>{f.label}</div>
                  <input type={f.type} value={petForm[f.key]}
                    onChange={e => setPetForm({ ...petForm, [f.key]: e.target.value })}
                    style={{ width: '100%', border: '1.5px solid #FFB8D8', borderRadius: 11, padding: '9px 13px', fontSize: 14, fontFamily: 'inherit', color: '#2C1810', outline: 'none', boxSizing: 'border-box', background: 'white' }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 6, fontWeight: 600 }}>성별</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['남아', '여아'].map(g => {
                    const sel = petForm.gender === g
                    return (
                      <button key={g} onClick={() => setPetForm({ ...petForm, gender: g })}
                        style={{ flex: 1, padding: 9, borderRadius: 11, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderColor: sel ? '#9333EA' : '#FFB8D8', background: sel ? '#F3E8FF' : 'white', color: sel ? '#9333EA' : '#7A5C4A' }}>
                        {g}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Budget settings */}
        <div style={{ background: '#FFFDF7', borderRadius: 16, padding: 16, marginBottom: 14, border: '1px solid #F0E4D4', boxShadow: '1px 3px 10px rgba(0,0,0,0.07)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -6, right: 22 }}>
            <WashiTape c1="#B8FFDA" c2="#D0FFE8" width={52} angle={1} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="jua" style={{ fontSize: 14, color: '#2C1810' }}>월 예산 설정</span>
            <button onClick={() => editBudget ? saveBudget() : setEditBudget(true)}
              style={{ background: editBudget ? '#9333EA' : 'white', color: editBudget ? 'white' : '#9333EA', border: '2px solid #9333EA', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {editBudget ? '저장' : '편집'}
            </button>
          </div>
          {!editBudget ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 12, borderBottom: '1px dashed #F0E4D4' }}>
                <span style={{ fontSize: 13, color: '#7A5C4A' }}>총 월 예산</span>
                <span className="jua" style={{ fontSize: 18, color: '#2C1810' }}>{formatAmount(budget.total)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {CATEGORY_OPTIONS.map(cat => {
                  const amt = budget[cat.category] || 0
                  const p = budget.total > 0 ? amt / budget.total : 0
                  return (
                    <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CategoryBadge catId={cat.category} size={30} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: '#7A5C4A' }}>{cat.name}</span>
                          <span className="jua" style={{ fontSize: 12, color: '#2C1810' }}>{formatAmount(amt)}</span>
                        </div>
                        <div style={{ height: 3, background: '#F0E4D4', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${p * 100}%`, background: cat.color, borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CATEGORY_OPTIONS.map(cat => (
                <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CategoryBadge catId={cat.category} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#C0A888', marginBottom: 4 }}>{cat.name}</div>
                    <input
                      type="number"
                      value={budgetForm[cat.category] || ''}
                      placeholder="0"
                      onChange={e => setBudgetForm({ ...budgetForm, [cat.category]: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', border: '1.5px solid #F0E4D4', borderRadius: 10, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit', color: '#2C1810', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              ))}
              <div style={{ paddingTop: 8, borderTop: '1px dashed #F0E4D4', fontSize: 12, color: '#9333EA', textAlign: 'right', fontWeight: 700 }}>
                합계: {formatAmount(CATEGORY_OPTIONS.reduce((s, c) => s + (parseInt(String(budgetForm[c.category] ?? 0), 10) || 0), 0))}
              </div>
            </div>
          )}
        </div>

        {/* App info */}
        <div style={{ background: '#FFF3C4', borderRadius: 14, padding: '14px 16px', border: '1px solid #FFD970', boxShadow: '1px 2px 6px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="jua" style={{ fontSize: 14, color: '#2C1810' }}>하루</span>
            <span style={{ fontSize: 11, color: '#C0A888' }}>v1.0.0</span>
          </div>
          <div style={{ fontSize: 12, color: '#8B6200', marginTop: 4 }}>반려동물과 함께하는 똑똑한 지출 기록</div>
        </div>
      </div>
    </div>
  )
}
