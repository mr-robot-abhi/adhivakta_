import { IUser } from "@/lib/models/user" // Changed to IUser

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface AuthResponse {
  token: string
  user: IUser
}

export const authService = {
  async signUp(token: string, userData: {
    name: string
    role: string
    phone?: string
    specialization?: string
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        ...userData
      }),
    })

    if (!response.ok) throw new Error('Signup failed')
    return response.json()
  },

  async login(token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) throw new Error('Login failed')
    return response.json()
  }
}