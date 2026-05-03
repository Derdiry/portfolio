import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthState { token: string | null; username: string | null }
interface AuthCtx extends AuthState {
  setAuth: (token: string, username: string) => void
  clearAuth: () => void
}

const Ctx = createContext<AuthCtx | null>(null)
const TOKEN_KEY = 'admin_token'
const USER_KEY  = 'admin_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    token:    localStorage.getItem(TOKEN_KEY),
    username: localStorage.getItem(USER_KEY),
  }))

  const setAuth = useCallback((token: string, username: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, username)
    setState({ token, username })
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ token: null, username: null })
  }, [])

  return <Ctx.Provider value={{ ...state, setAuth, clearAuth }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
