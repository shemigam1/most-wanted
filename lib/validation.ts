export interface ValidationError {
  field: string
  message: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return "Email is required"
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required"
  if (password.length < 8) return "Password must be at least 8 characters long"
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
  if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number"
  return null
}

export function validateUsername(username: string): string | null {
  if (!username) return "Full username is required"
  if (username.trim().length < 2) return "Username must be at least 2 characters long"
  return null
}

export function validateLoginForm(data: LoginFormData): ValidationError[] {
  const errors: ValidationError[] = []
  
  const emailError = validateEmail(data.email)
  if (emailError) {
    errors.push({ field: "email", message: emailError })
  }
  
  const passwordError = validatePassword(data.password)
  if (passwordError) {
    errors.push({ field: "password", message: passwordError })
  }
  
  return errors
}

export function validateSignupForm(data: SignupFormData): ValidationError[] {
  const errors: ValidationError[] = []
  
  const usernameError = validateUsername(data.username)
  if (usernameError) {
    errors.push({ field: "username", message: usernameError })
  }
  
  const emailError = validateEmail(data.email)
  if (emailError) {
    errors.push({ field: "email", message: emailError })
  }
  
  const passwordError = validatePassword(data.password)
  if (passwordError) {
    errors.push({ field: "password", message: passwordError })
  }
  
  if (!data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Please confirm your password" })
  } else if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Passwords do not match" })
  }
  
  return errors
}

