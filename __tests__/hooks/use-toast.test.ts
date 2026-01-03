import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast, toast, reducer } from '@/hooks/use-toast'

describe('hooks/use-toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  describe('reducer', () => {
    const initialState = { toasts: [] }
    
    describe('ADD_TOAST', () => {
      it('adds a toast to empty state', () => {
        const newToast = { id: '1', title: 'Test', open: true }
        const result = reducer(initialState, {
          type: 'ADD_TOAST',
          toast: newToast
        })
        
        expect(result.toasts).toHaveLength(1)
        expect(result.toasts[0]).toEqual(newToast)
      })
      
      it('prepends new toast to existing toasts', () => {
        const existingState = {
          toasts: [{ id: '1', title: 'First', open: true }]
        }
        const newToast = { id: '2', title: 'Second', open: true }
        
        const result = reducer(existingState, {
          type: 'ADD_TOAST',
          toast: newToast
        })
        
        expect(result.toasts).toHaveLength(1) // Due to TOAST_LIMIT = 1
        expect(result.toasts[0].id).toBe('2')
      })
      
      it('respects TOAST_LIMIT of 1', () => {
        const state = { toasts: [] }
        let newState = reducer(state, {
          type: 'ADD_TOAST',
          toast: { id: '1', title: 'First', open: true }
        })
        newState = reducer(newState, {
          type: 'ADD_TOAST',
          toast: { id: '2', title: 'Second', open: true }
        })
        
        expect(newState.toasts).toHaveLength(1)
        expect(newState.toasts[0].id).toBe('2')
      })
    })
    
    describe('UPDATE_TOAST', () => {
      it('updates existing toast by id', () => {
        const state = {
          toasts: [{ id: '1', title: 'Original', open: true }]
        }
        
        const result = reducer(state, {
          type: 'UPDATE_TOAST',
          toast: { id: '1', title: 'Updated' }
        })
        
        expect(result.toasts[0].title).toBe('Updated')
        expect(result.toasts[0].open).toBe(true) // Preserved
      })
      
      it('does not update non-matching toasts', () => {
        const state = {
          toasts: [{ id: '1', title: 'Original', open: true }]
        }
        
        const result = reducer(state, {
          type: 'UPDATE_TOAST',
          toast: { id: '999', title: 'Updated' }
        })
        
        expect(result.toasts[0].title).toBe('Original')
      })
    })
    
    describe('DISMISS_TOAST', () => {
      it('sets open to false for specific toast', () => {
        const state = {
          toasts: [{ id: '1', title: 'Test', open: true }]
        }
        
        const result = reducer(state, {
          type: 'DISMISS_TOAST',
          toastId: '1'
        })
        
        expect(result.toasts[0].open).toBe(false)
      })
      
      it('sets open to false for all toasts when no id provided', () => {
        const state = {
          toasts: [
            { id: '1', title: 'First', open: true },
            { id: '2', title: 'Second', open: true }
          ]
        }
        
        const result = reducer(state, {
          type: 'DISMISS_TOAST',
          toastId: undefined
        })
        
        expect(result.toasts.every(t => t.open === false)).toBe(true)
      })
    })
    
    describe('REMOVE_TOAST', () => {
      it('removes specific toast by id', () => {
        const state = {
          toasts: [
            { id: '1', title: 'First', open: false },
            { id: '2', title: 'Second', open: true }
          ]
        }
        
        const result = reducer(state, {
          type: 'REMOVE_TOAST',
          toastId: '1'
        })
        
        expect(result.toasts).toHaveLength(1)
        expect(result.toasts[0].id).toBe('2')
      })
      
      it('removes all toasts when no id provided', () => {
        const state = {
          toasts: [
            { id: '1', title: 'First', open: false },
            { id: '2', title: 'Second', open: false }
          ]
        }
        
        const result = reducer(state, {
          type: 'REMOVE_TOAST',
          toastId: undefined
        })
        
        expect(result.toasts).toHaveLength(0)
      })
    })
  })
  
  describe('useToast hook', () => {
    it('returns initial empty state', () => {
      const { result } = renderHook(() => useToast())
      
      expect(result.current.toasts).toEqual([])
      expect(typeof result.current.toast).toBe('function')
      expect(typeof result.current.dismiss).toBe('function')
    })
    
    it('adds toast via toast function', () => {
      const { result } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({ title: 'Test Toast' })
      })
      
      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('Test Toast')
      expect(result.current.toasts[0].open).toBe(true)
    })
    
    it('dismisses toast by id', () => {
      const { result } = renderHook(() => useToast())
      
      let toastId: string
      act(() => {
        const { id } = result.current.toast({ title: 'Test' })
        toastId = id
      })
      
      act(() => {
        result.current.dismiss(toastId!)
      })
      
      expect(result.current.toasts[0]?.open).toBe(false)
    })
    
    it('dismisses all toasts when no id provided', () => {
      const { result } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({ title: 'First' })
      })
      
      act(() => {
        result.current.dismiss()
      })
      
      expect(result.current.toasts.every(t => t.open === false)).toBe(true)
    })
  })
  
  describe('toast function', () => {
    it('returns update and dismiss methods', () => {
      const { result } = renderHook(() => useToast())
      
      let toastMethods: { id: string; update: (props: unknown) => void; dismiss: () => void }
      act(() => {
        toastMethods = result.current.toast({ title: 'Test' })
      })
      
      expect(toastMethods!.id).toBeDefined()
      expect(typeof toastMethods!.update).toBe('function')
      expect(typeof toastMethods!.dismiss).toBe('function')
    })
    
    it('generates unique ids for each toast', () => {
      const { result } = renderHook(() => useToast())
      
      const ids: string[] = []
      act(() => {
        ids.push(result.current.toast({ title: 'First' }).id)
        ids.push(result.current.toast({ title: 'Second' }).id)
        ids.push(result.current.toast({ title: 'Third' }).id)
      })
      
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(3)
    })
    
    it('update method updates toast properties', () => {
      const { result } = renderHook(() => useToast())
      
      let toastMethods: { id: string; update: (props: { title?: string }) => void; dismiss: () => void }
      act(() => {
        toastMethods = result.current.toast({ title: 'Original' })
      })
      
      act(() => {
        toastMethods!.update({ title: 'Updated' })
      })
      
      expect(result.current.toasts[0]?.title).toBe('Updated')
    })
    
    it('dismiss method closes the toast', () => {
      const { result } = renderHook(() => useToast())
      
      let toastMethods: { id: string; update: (props: unknown) => void; dismiss: () => void }
      act(() => {
        toastMethods = result.current.toast({ title: 'Test' })
      })
      
      act(() => {
        toastMethods!.dismiss()
      })
      
      expect(result.current.toasts[0]?.open).toBe(false)
    })
  })
  
  describe('toast with description and action', () => {
    it('includes description in toast', () => {
      const { result } = renderHook(() => useToast())
      
      act(() => {
        result.current.toast({
          title: 'Title',
          description: 'This is a description'
        })
      })
      
      expect(result.current.toasts[0].description).toBe('This is a description')
    })
    
    it('includes action element in toast', () => {
      const { result } = renderHook(() => useToast())
      
      const mockAction = { altText: 'Undo' }
      act(() => {
        result.current.toast({
          title: 'Title',
          action: mockAction as unknown as React.ReactElement
        })
      })
      
      expect(result.current.toasts[0].action).toBe(mockAction)
    })
  })
})
