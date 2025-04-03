// adhivakta_ui/lib/types/auth.ts
export interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
  }
  
  export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: 'lawyer' | 'client';
    terms: boolean;
  }
  
  export interface UserData {
    name: string;
    role: string;
  }