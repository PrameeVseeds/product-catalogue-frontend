export interface Admin {
  id: number
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  admin: Admin
  token: string
}
