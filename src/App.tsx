import { useState, useEffect } from 'react'
import { usePetStore } from './store/usePetStore'
import { BottomNav } from './components/ui'
import HomeScreen from './pages/Home'
import CalendarScreen from './pages/Calendar'
import StatsScreen from './pages/Stats'
import ProfileScreen from './pages/Profile'
import AddExpenseSheet from './pages/AddExpense'
import OnboardingFlow from './pages/Onboarding'
import { Storage } from '@apps-in-toss/web-framework'

const OB_KEY = 'haru_onboarding_done'

async function getOnboarded(): Promise<boolean> {
  try {
    return (await Storage.getItem(OB_KEY)) === 'true'
  } catch {
    return localStorage.getItem(OB_KEY) === 'true'
  }
}

async function setOnboardedDone(): Promise<void> {
  try {
    await Storage.setItem(OB_KEY, 'true')
  } catch {
    localStorage.setItem(OB_KEY, 'true')
  }
}

type TabId = 'home' | 'calendar' | 'stats' | 'profile'

function StatusBar() {
  return (
    <div className="preview-only" style={{ height: 50, background: '#FFFDF7', flexShrink: 0, position: 'relative', zIndex: 10, borderBottom: '1px solid #F0E4D4' }}>
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 118, height: 30, background: '#1A0E0A', borderRadius: 20 }} />
      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 22px' }}>
        <span className="jua" style={{ fontSize: 14, color: '#2C1810' }}>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="#2C1810">
            <rect x="0" y="7" width="3" height="4" rx="0.8" />
            <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.8" />
            <rect x="9" y="2" width="3" height="9" rx="0.8" />
            <rect x="13.5" y="0" width="2.5" height="11" rx="0.8" opacity="0.3" />
          </svg>
          <svg width="16" height="11" viewBox="0 0 24 17" fill="none" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round">
            <path d="M1 6C5.4 2 10.4 0 12 0s6.6 2 11 6" opacity="0.3" />
            <path d="M4 9.5C7 7 10 5.5 12 5.5s5 1.5 8 4" />
            <path d="M7.5 13C9 11.5 10.5 11 12 11s3 .5 4.5 2" />
            <circle cx="12" cy="17" r="1.5" fill="#2C1810" stroke="none" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <div style={{ width: 22, height: 11, border: '1.5px solid #2C1810', borderRadius: 3, padding: 1.5, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '80%', height: '100%', background: '#2C1810', borderRadius: 1.5 }} />
            </div>
            <div style={{ width: 2.5, height: 5, background: '#2C1810', borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null)
  const [screen, setScreen] = useState<TabId>('home')
  const [showAdd, setShowAdd] = useState(false)
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const { pet, expenses, budget, updatePet, updateBudget, addExpense, deleteExpense } = usePetStore()

  useEffect(() => {
    getOnboarded().then(setOnboarded)
  }, [])

  async function handleOnboardingComplete(info: { petName: string; species: string; photo: string | null }) {
    if (info.petName && info.petName !== '내 아이') {
      updatePet({ ...pet, name: info.petName, species: info.species, photo: info.photo ?? undefined })
    } else if (info.species) {
      updatePet({ ...pet, species: info.species })
    }
    await setOnboardedDone()
    setOnboarded(true)
  }

  if (onboarded === null) {
    return <div style={{ width: '100%', height: '100%', background: '#FEF9F3' }} />
  }

  if (!onboarded) {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  function handleNav(id: TabId | 'add') {
    if (id === 'add') { setShowAdd(true); return }
    setScreen(id)
  }

  const commonProps = {
    expenses,
    month,
    onMonthChange: setMonth,
    onDeleteExpense: deleteExpense,
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#FEF9F3', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <StatusBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        {screen === 'home' && (
          <HomeScreen key="home" pet={pet} budget={budget} {...commonProps} />
        )}
        {screen === 'calendar' && (
          <CalendarScreen key="calendar" {...commonProps} />
        )}
        {screen === 'stats' && (
          <StatsScreen key="stats" budget={budget} petName={pet.name} {...commonProps} />
        )}
        {screen === 'profile' && (
          <ProfileScreen key="profile" pet={pet} budget={budget} onUpdatePet={updatePet} onUpdateBudget={updateBudget} />
        )}
      </div>
      <BottomNav current={screen} onChange={handleNav} />
      {showAdd && (
        <AddExpenseSheet onClose={() => setShowAdd(false)} onAdd={addExpense} />
      )}
    </div>
  )
}
