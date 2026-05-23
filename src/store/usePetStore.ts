import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Pet, Expense, Budget } from '../types'
import { Storage } from '@apps-in-toss/web-framework'

const aitStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const val = await Storage.getItem(key)
      if (val !== null) return val
    } catch {}
    return localStorage.getItem(key)
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await Storage.setItem(key, value)
    } catch {}
    localStorage.setItem(key, value)
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await Storage.removeItem(key)
    } catch {}
    localStorage.removeItem(key)
  },
}

const INITIAL_PET: Pet = {
  id: '1',
  name: '',
  species: '',
  breed: '',
  birthday: '',
  gender: '',
}

const INITIAL_BUDGET: Budget = {
  total: 0,
  food: 0,
  vet: 0,
  groom: 0,
  toys: 0,
  insurance: 0,
  training: 0,
}

const INITIAL_EXPENSES: Expense[] = []

interface PetStore {
  pet: Pet
  expenses: Expense[]
  budget: Budget

  updatePet: (pet: Pet) => void
  updateBudget: (budget: Budget) => void
  addExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      pet: INITIAL_PET,
      expenses: INITIAL_EXPENSES,
      budget: INITIAL_BUDGET,

      updatePet: (pet) => set({ pet }),
      updateBudget: (budget) => set({ budget }),
      addExpense: (expense) => set((s) => ({ expenses: [expense, ...s.expenses] })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
    }),
    { name: 'harufriend-storage-v1', storage: createJSONStorage(() => aitStorage) }
  )
)
