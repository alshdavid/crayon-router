import { createContext, useContext } from 'react'
import crayon from 'crayon';

export interface AppState {
    router?: crayon.Router
}

export const ctx: AppState = {}
export const AppContext = createContext<AppState>(null)
export const useAppContext = () => useContext(AppContext)