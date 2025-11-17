import { AuthSession, User } from '@/types'
import { mockUsers } from './users'

const SESSION_KEY = 'factory_session'

export class MockAuthService {
  /**
   * Mock login - accepts any username from mockUsers with password "123456"
   */
  static async login(username: string, password: string): Promise<AuthSession> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user by username
    const user = mockUsers.find((u) => u.username === username)

    if (!user) {
      throw new Error('Tên đăng nhập không tồn tại')
    }

    // Mock password check (all users use password "123456")
    if (password !== '123456') {
      throw new Error('Mật khẩu không đúng')
    }

    // Create session
    const session: AuthSession = {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }

    return session
  }

  /**
   * Get current session from localStorage
   */
  static getSession(): AuthSession | null {
    if (typeof window === 'undefined') {
      return null
    }

    const sessionStr = localStorage.getItem(SESSION_KEY)
    if (!sessionStr) {
      return null
    }

    try {
      const session: AuthSession = JSON.parse(sessionStr)

      // Check if expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout()
        return null
      }

      return session
    } catch {
      return null
    }
  }

  /**
   * Logout - clear session
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getSession() !== null
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    const session = this.getSession()
    return session ? session.user : null
  }
}
