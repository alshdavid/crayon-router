import { createContext, useContext } from 'react'

export const AppState = {}
export const AppContext = createContext(null)
export const useAppContext = useContext(AppContext)