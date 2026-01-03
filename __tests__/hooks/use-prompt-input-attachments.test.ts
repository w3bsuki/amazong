import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { usePromptInputAttachments } from '@/hooks/use-prompt-input-attachments'
import {
  LocalAttachmentsContext,
  ProviderAttachmentsContext,
} from '@/components/providers/prompt-input-context'

// Helper to create context wrappers
function createContextWrapper(
  ContextType: typeof LocalAttachmentsContext | typeof ProviderAttachmentsContext,
  value: unknown
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(ContextType.Provider, { value }, children)
  }
}

describe('hooks/use-prompt-input-attachments', () => {
  describe('without context', () => {
    it('throws error when used outside of provider', () => {
      // Suppress console.error for expected error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        renderHook(() => usePromptInputAttachments())
      }).toThrow('usePromptInputAttachments must be used within a PromptInput or PromptInputProvider')
      
      consoleSpy.mockRestore()
    })
  })

  describe('with LocalAttachmentsContext', () => {
    it('returns context value from LocalAttachmentsContext', () => {
      const mockAttachments = {
        files: [],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(LocalAttachmentsContext, mockAttachments),
      })
      
      expect(result.current).toBe(mockAttachments)
    })

    it('provides access to files array', () => {
      const mockAttachments = {
        files: [
          { id: '1', name: 'test.txt', size: 100, type: 'text/plain' },
          { id: '2', name: 'image.png', size: 5000, type: 'image/png' },
        ],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(LocalAttachmentsContext, mockAttachments),
      })
      
      expect(result.current.files).toHaveLength(2)
      expect(result.current.files[0].name).toBe('test.txt')
    })

    it('provides addFile function', () => {
      const addFileMock = vi.fn()
      const mockAttachments = {
        files: [],
        addFile: addFileMock,
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(LocalAttachmentsContext, mockAttachments),
      })
      
      result.current.addFile({ name: 'new.txt', size: 50 })
      expect(addFileMock).toHaveBeenCalledWith({ name: 'new.txt', size: 50 })
    })

    it('provides removeFile function', () => {
      const removeFileMock = vi.fn()
      const mockAttachments = {
        files: [{ id: '1', name: 'test.txt' }],
        addFile: vi.fn(),
        removeFile: removeFileMock,
        clearFiles: vi.fn(),
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(LocalAttachmentsContext, mockAttachments),
      })
      
      result.current.removeFile('1')
      expect(removeFileMock).toHaveBeenCalledWith('1')
    })

    it('provides clearFiles function', () => {
      const clearFilesMock = vi.fn()
      const mockAttachments = {
        files: [{ id: '1' }, { id: '2' }],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: clearFilesMock,
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(LocalAttachmentsContext, mockAttachments),
      })
      
      result.current.clearFiles()
      expect(clearFilesMock).toHaveBeenCalled()
    })
  })

  describe('with ProviderAttachmentsContext', () => {
    it('returns context value from ProviderAttachmentsContext', () => {
      const mockAttachments = {
        files: [],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
        maxFiles: 5,
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(ProviderAttachmentsContext, mockAttachments),
      })
      
      expect(result.current).toBe(mockAttachments)
    })

    it('provider context takes precedence over local context', () => {
      const localAttachments = {
        files: [{ id: 'local' }],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
      }
      
      const providerAttachments = {
        files: [{ id: 'provider' }],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
      }
      
      // Nest both contexts - provider should win
      function Wrapper({ children }: { children: ReactNode }) {
        return createElement(
          LocalAttachmentsContext.Provider,
          { value: localAttachments },
          createElement(
            ProviderAttachmentsContext.Provider,
            { value: providerAttachments },
            children
          )
        )
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: Wrapper,
      })
      
      expect(result.current.files[0].id).toBe('provider')
    })
  })

  describe('dual-mode behavior', () => {
    it('falls back to local context when provider is null', () => {
      const localAttachments = {
        files: [{ id: 'local-fallback' }],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
      }
      
      // Provider context is null, local has value
      function Wrapper({ children }: { children: ReactNode }) {
        return createElement(
          ProviderAttachmentsContext.Provider,
          { value: null },
          createElement(
            LocalAttachmentsContext.Provider,
            { value: localAttachments },
            children
          )
        )
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: Wrapper,
      })
      
      expect(result.current.files[0].id).toBe('local-fallback')
    })

    it('uses local context when only local is provided', () => {
      const localAttachments = {
        files: [],
        addFile: vi.fn(),
        removeFile: vi.fn(),
        clearFiles: vi.fn(),
        isLocal: true,
      }
      
      const { result } = renderHook(() => usePromptInputAttachments(), {
        wrapper: createContextWrapper(LocalAttachmentsContext, localAttachments),
      })
      
      expect(result.current.isLocal).toBe(true)
    })
  })
})
