import { createContext, useContext } from 'react'
import { Router } from 'crayon';

export interface AppState {
    router?: Router
}

export const ctx: AppState = {}
export const AppContext = createContext<AppState>(null)
export const useAppContext = () => useContext(AppContext)