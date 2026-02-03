import { describe, expect, it } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  signUpSchema,
  getPasswordStrength,
  validatePassword,
  validateEmail,
  RESERVED_USERNAMES
} from '@/lib/validation/auth'

describe('lib/validation/auth', () => {
  describe('emailSchema', () => {
    it('accepts valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@company.co.uk',
        'a@b.io',
        'TEST@EXAMPLE.COM'
      ]
      
      for (const email of validEmails) {
        const result = emailSchema.safeParse(email)
        expect(result.success, `${email} should be valid`).toBe(true)
      }
    })
    
    it('rejects emails without @ symbol', () => {
      const result = emailSchema.safeParse('invalid-email')
      expect(result.success).toBe(false)
    })
    
    it('rejects emails without domain dot', () => {
      const result = emailSchema.safeParse('test@domain')
      expect(result.success).toBe(false)
    })
    
    it('rejects empty string', () => {
      const result = emailSchema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.emailRequired')
      }
    })
    
    it('rejects whitespace-only string', () => {
      const result = emailSchema.safeParse('   ')
      expect(result.success).toBe(false)
    })
  })
  
  describe('passwordSchema', () => {
    it('accepts valid passwords', () => {
      const validPasswords = [
        'Password1',
        'test1234',
        'MyP4ssw0rd!',
        '12345678a',
        'abcdefgh1'
      ]
      
      for (const password of validPasswords) {
        const result = passwordSchema.safeParse(password)
        expect(result.success, `${password} should be valid`).toBe(true)
      }
    })
    
    it('rejects passwords shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Pass1')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('errors.passwordMin')
      }
    })
    
    it('rejects passwords without letters', () => {
      const result = passwordSchema.safeParse('12345678')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(e => e.message === 'errors.passwordLetter')).toBe(true)
      }
    })
    
    it('rejects passwords without numbers', () => {
      const result = passwordSchema.safeParse('abcdefgh')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(e => e.message === 'errors.passwordNumber')).toBe(true)
      }
    })
  })
  
  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result.success).toBe(true)
    })
    
    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'password123'
      })
      expect(result.success).toBe(false)
    })
    
    it('rejects short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '12345'
      })
      expect(result.success).toBe(false)
    })
  })
  
  describe('signUpSchema', () => {
    const validSignUp = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      accountType: 'personal' as const,
      password: 'Password123',
      confirmPassword: 'Password123'
    }
    
    it('accepts valid sign up data', () => {
      const result = signUpSchema.safeParse(validSignUp)
      expect(result.success).toBe(true)
    })
    
    describe('name validation', () => {
      it('rejects empty name', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, name: '' })
        expect(result.success).toBe(false)
      })
      
      it('rejects name shorter than 2 characters', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, name: 'J' })
        expect(result.success).toBe(false)
      })
      
      it('rejects name longer than 50 characters', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, name: 'a'.repeat(51) })
        expect(result.success).toBe(false)
      })
    })
    
    describe('username validation', () => {
      it('rejects username shorter than 3 characters', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: 'ab' })
        expect(result.success).toBe(false)
      })
      
      it('rejects username longer than 30 characters', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: 'a'.repeat(31) })
        expect(result.success).toBe(false)
      })
      
      it('rejects username starting with underscore', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: '_user' })
        expect(result.success).toBe(false)
      })
      
      it('rejects username with uppercase letters', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: 'JohnDoe' })
        expect(result.success).toBe(false)
      })
      
      it('rejects username with consecutive underscores', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: 'john__doe' })
        expect(result.success).toBe(false)
      })
      
      it('rejects username ending with underscore', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: 'johndoe_' })
        expect(result.success).toBe(false)
      })
      
      it('accepts username with single underscores', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, username: 'john_doe' })
        expect(result.success).toBe(true)
      })
      
      it('rejects reserved usernames', () => {
        for (const reserved of ['admin', 'support', 'treido', 'api', 'auth']) {
          const result = signUpSchema.safeParse({ ...validSignUp, username: reserved })
          expect(result.success, `${reserved} should be rejected`).toBe(false)
        }
      })
    })
    
    describe('password validation', () => {
      it('rejects password without uppercase', () => {
        const result = signUpSchema.safeParse({ 
          ...validSignUp, 
          password: 'password123',
          confirmPassword: 'password123'
        })
        expect(result.success).toBe(false)
      })
      
      it('rejects password without lowercase', () => {
        const result = signUpSchema.safeParse({ 
          ...validSignUp, 
          password: 'PASSWORD123',
          confirmPassword: 'PASSWORD123'
        })
        expect(result.success).toBe(false)
      })
      
      it('rejects password without number', () => {
        const result = signUpSchema.safeParse({ 
          ...validSignUp, 
          password: 'PasswordABC',
          confirmPassword: 'PasswordABC'
        })
        expect(result.success).toBe(false)
      })
      
      it('rejects password longer than 72 characters', () => {
        const longPassword = 'Aa1' + 'a'.repeat(70)
        const result = signUpSchema.safeParse({ 
          ...validSignUp, 
          password: longPassword,
          confirmPassword: longPassword
        })
        expect(result.success).toBe(false)
      })
    })
    
    describe('password confirmation', () => {
      it('rejects mismatched passwords', () => {
        const result = signUpSchema.safeParse({
          ...validSignUp,
          password: 'Password123',
          confirmPassword: 'Password456'
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.some(e => e.message === 'passwordsDoNotMatch')).toBe(true)
        }
      })
    })
    
    it('ignores accountType (selected during onboarding)', () => {
      const result = signUpSchema.safeParse({ ...validSignUp, accountType: 'invalid' })
      expect(result.success).toBe(true)
    })
  })
  
  describe('getPasswordStrength', () => {
    it('returns Weak for very short passwords', () => {
      const result = getPasswordStrength('abc')
      expect(result.labelKey).toBe('strengthWeak')
      expect(result.score).toBeLessThanOrEqual(2)
    })
    
    it('returns Fair for medium strength passwords', () => {
      const result = getPasswordStrength('password1')
      expect(result.labelKey).toBe('strengthFair')
    })
    
    it('returns Good for good passwords', () => {
      const result = getPasswordStrength('Password123')
      expect(result.labelKey).toBe('strengthGood')
    })
    
    it('returns Strong for strong passwords', () => {
      const result = getPasswordStrength('Password123!')
      expect(result.labelKey).toBe('strengthStrong')
    })
    
    it('includes correct color classes', () => {
      expect(getPasswordStrength('abc').color).toBe('bg-destructive')
      expect(getPasswordStrength('password1').color).toBe('bg-status-warning')
      expect(getPasswordStrength('Password123').color).toBe('bg-status-success/80')
      expect(getPasswordStrength('Password123!').color).toBe('bg-status-success')
    })
    
    it('includes correct width classes', () => {
      expect(getPasswordStrength('abc').width).toBe('w-1/4')
      expect(getPasswordStrength('password1').width).toBe('w-2/4')
      expect(getPasswordStrength('Password123').width).toBe('w-3/4')
      expect(getPasswordStrength('Password123!').width).toBe('w-full')
    })
  })
  
  describe('validatePassword', () => {
    it('returns valid for good password', () => {
      const result = validatePassword('Password1')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
    
    it('returns error keys for invalid password', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('errors.passwordMin')
      expect(result.errors).toContain('errors.passwordNumber')
    })
    
    it('returns letter error when password has no letters', () => {
      const result = validatePassword('12345678')
      expect(result.errors).toContain('errors.passwordLetter')
    })
  })
  
  describe('validateEmail', () => {
    it('returns valid for good email', () => {
      const result = validateEmail('test@example.com')
      expect(result.valid).toBe(true)
      expect(result.error).toBeNull()
    })
    
    it('returns required error for empty email', () => {
      const result = validateEmail('')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('errors.emailRequired')
    })
    
    it('returns invalid error for bad email', () => {
      const result = validateEmail('invalid')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('errors.emailInvalid')
    })
    
    it('handles whitespace-only email', () => {
      const result = validateEmail('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('errors.emailRequired')
    })
  })
  
  describe('RESERVED_USERNAMES', () => {
    it('contains critical reserved usernames', () => {
      const criticalReserved = [
        'admin', 'administrator', 'support', 'help', 'treido',
        'api', 'auth', 'login', 'signup', 'checkout', 'cart'
      ]
      
      for (const username of criticalReserved) {
        expect(RESERVED_USERNAMES, `${username} should be reserved`).toContain(username)
      }
    })
    
    it('has more than 30 reserved usernames', () => {
      expect(RESERVED_USERNAMES.length).toBeGreaterThan(30)
    })
  })
})
