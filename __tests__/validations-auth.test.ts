import { describe, expect, it } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  signUpSchema,
  getPasswordStrength,
  validatePassword,
  validateEmail,
  getLocalizedPasswordErrors,
  getLocalizedEmailErrors,
  RESERVED_USERNAMES
} from '@/lib/validations/auth'

describe('lib/validations/auth', () => {
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
        expect(result.error.errors[0].message).toBe('Email is required')
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
        expect(result.error.errors[0].message).toBe('Password must be at least 8 characters')
      }
    })
    
    it('rejects passwords without letters', () => {
      const result = passwordSchema.safeParse('12345678')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some(e => e.message.includes('letter'))).toBe(true)
      }
    })
    
    it('rejects passwords without numbers', () => {
      const result = passwordSchema.safeParse('abcdefgh')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some(e => e.message.includes('number'))).toBe(true)
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
          expect(result.error.errors.some(e => e.message === 'Passwords do not match')).toBe(true)
        }
      })
    })
    
    describe('account type', () => {
      it('accepts personal account type', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, accountType: 'personal' })
        expect(result.success).toBe(true)
      })
      
      it('accepts business account type', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, accountType: 'business' })
        expect(result.success).toBe(true)
      })
      
      it('rejects invalid account type', () => {
        const result = signUpSchema.safeParse({ ...validSignUp, accountType: 'invalid' })
        expect(result.success).toBe(false)
      })
    })
  })
  
  describe('getPasswordStrength', () => {
    it('returns Weak for very short passwords', () => {
      const result = getPasswordStrength('abc')
      expect(result.label).toBe('Weak')
      expect(result.score).toBeLessThanOrEqual(2)
    })
    
    it('returns Fair for medium strength passwords', () => {
      const result = getPasswordStrength('password1')
      expect(result.label).toBe('Fair')
    })
    
    it('returns Good for good passwords', () => {
      const result = getPasswordStrength('Password123')
      expect(result.label).toBe('Good')
    })
    
    it('returns Strong for strong passwords', () => {
      const result = getPasswordStrength('Password123!')
      expect(result.label).toBe('Strong')
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
      const result = validatePassword('Password1', 'en')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
    
    it('returns errors for invalid password in English', () => {
      const result = validatePassword('abc', 'en')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters')
      expect(result.errors).toContain('Password must contain at least one number')
    })
    
    it('returns errors for invalid password in Bulgarian', () => {
      const result = validatePassword('abc', 'bg')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Паролата трябва да е поне 8 символа')
      expect(result.errors).toContain('Паролата трябва да съдържа поне една цифра')
    })
    
    it('returns letter error when password has no letters', () => {
      const result = validatePassword('12345678', 'en')
      expect(result.errors).toContain('Password must contain at least one letter')
    })
  })
  
  describe('validateEmail', () => {
    it('returns valid for good email', () => {
      const result = validateEmail('test@example.com', 'en')
      expect(result.valid).toBe(true)
      expect(result.error).toBeNull()
    })
    
    it('returns required error for empty email in English', () => {
      const result = validateEmail('', 'en')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Email is required')
    })
    
    it('returns required error for empty email in Bulgarian', () => {
      const result = validateEmail('', 'bg')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Имейлът е задължителен')
    })
    
    it('returns invalid error for bad email in English', () => {
      const result = validateEmail('invalid', 'en')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please enter a valid email address')
    })
    
    it('returns invalid error for bad email in Bulgarian', () => {
      const result = validateEmail('invalid', 'bg')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Моля, въведете валиден имейл адрес')
    })
    
    it('handles whitespace-only email', () => {
      const result = validateEmail('   ', 'en')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Email is required')
    })
  })
  
  describe('getLocalizedPasswordErrors', () => {
    it('returns English messages for en locale', () => {
      const messages = getLocalizedPasswordErrors('en')
      expect(messages.min).toBe('Password must be at least 8 characters')
      expect(messages.letter).toBe('Password must contain at least one letter')
      expect(messages.number).toBe('Password must contain at least one number')
      expect(messages.match).toBe('Passwords do not match')
    })
    
    it('returns Bulgarian messages for bg locale', () => {
      const messages = getLocalizedPasswordErrors('bg')
      expect(messages.min).toBe('Паролата трябва да е поне 8 символа')
      expect(messages.letter).toBe('Паролата трябва да съдържа поне една буква')
      expect(messages.number).toBe('Паролата трябва да съдържа поне една цифра')
      expect(messages.match).toBe('Паролите не съвпадат')
    })
    
    it('defaults to English for unknown locale', () => {
      const messages = getLocalizedPasswordErrors('fr')
      expect(messages.min).toBe('Password must be at least 8 characters')
    })
  })
  
  describe('getLocalizedEmailErrors', () => {
    it('returns English messages for en locale', () => {
      const messages = getLocalizedEmailErrors('en')
      expect(messages.required).toBe('Email is required')
      expect(messages.invalid).toBe('Please enter a valid email address')
    })
    
    it('returns Bulgarian messages for bg locale', () => {
      const messages = getLocalizedEmailErrors('bg')
      expect(messages.required).toBe('Имейлът е задължителен')
      expect(messages.invalid).toBe('Моля, въведете валиден имейл адрес')
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
