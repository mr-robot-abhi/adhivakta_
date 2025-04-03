import { IUser } from "@/lib/models/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  token: string;
  user: IUser;
  requiresSignup?: boolean;
}

interface SignUpData {
  token: string;
  name: string;
  role: string;
  phone?: string;
  specialization?: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async login(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.requiresSignup) {
          throw new Error('REQUIRES_SIGNUP');
        }
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async socialLogin(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/social-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Social login failed');
      }

      const data = await response.json();
      
      // Store token
      if (typeof window !== 'undefined' && data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    }
  },

  async refreshToken(): Promise<{ token: string }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  async getProfile(token: string): Promise<IUser> {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};