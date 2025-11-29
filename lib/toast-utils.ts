import { toast } from 'sonner'

/**
 * Toast Utility Functions
 * 
 * Pre-configured toast functions for common e-commerce actions.
 * Ensures consistent messaging and timing across the application.
 */

// Default durations
const DURATIONS = {
  default: 3000,
  error: 5000,
  success: 3000,
  action: 4000, // For toasts with action buttons
} as const

/**
 * Cart-related toasts
 */
export const cartToast = {
  added: (productName?: string) => {
    toast.success(productName ? `"${productName}" added to cart` : 'Added to cart', {
      duration: DURATIONS.success,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    })
  },
  
  removed: (productName?: string, onUndo?: () => void) => {
    toast.success(productName ? `"${productName}" removed from cart` : 'Removed from cart', {
      duration: DURATIONS.action,
      action: onUndo ? {
        label: 'Undo',
        onClick: onUndo,
      } : undefined,
    })
  },
  
  updated: (quantity: number) => {
    toast.success(`Quantity updated to ${quantity}`, {
      duration: DURATIONS.success,
    })
  },
  
  error: (message = 'Failed to update cart') => {
    toast.error(message, {
      duration: DURATIONS.error,
    })
  },
}

/**
 * Wishlist-related toasts
 */
export const wishlistToast = {
  added: (productName?: string) => {
    toast.success(productName ? `"${productName}" saved to wishlist` : 'Saved to wishlist', {
      duration: DURATIONS.success,
      action: {
        label: 'View Wishlist',
        onClick: () => window.location.href = '/account/wishlist',
      },
    })
  },
  
  removed: (productName?: string, onUndo?: () => void) => {
    toast.success(productName ? `"${productName}" removed from wishlist` : 'Removed from wishlist', {
      duration: DURATIONS.action,
      action: onUndo ? {
        label: 'Undo',
        onClick: onUndo,
      } : undefined,
    })
  },
  
  movedToCart: (productName?: string) => {
    toast.success(productName ? `"${productName}" moved to cart` : 'Moved to cart', {
      duration: DURATIONS.success,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    })
  },
  
  error: (message = 'Failed to update wishlist') => {
    toast.error(message, {
      duration: DURATIONS.error,
    })
  },
}

/**
 * Auth-related toasts
 */
export const authToast = {
  signedIn: (name?: string) => {
    toast.success(name ? `Welcome back, ${name}!` : 'Successfully signed in', {
      duration: DURATIONS.success,
    })
  },
  
  signedOut: () => {
    toast.success('Successfully signed out', {
      duration: DURATIONS.success,
    })
  },
  
  error: (message = 'Authentication failed') => {
    toast.error(message, {
      duration: DURATIONS.error,
    })
  },
  
  sessionExpired: () => {
    toast.warning('Your session has expired. Please sign in again.', {
      duration: DURATIONS.error,
      action: {
        label: 'Sign In',
        onClick: () => window.location.href = '/auth/login',
      },
    })
  },
}

/**
 * Order-related toasts
 */
export const orderToast = {
  placed: (orderId?: string) => {
    toast.success(orderId ? `Order #${orderId} placed successfully!` : 'Order placed successfully!', {
      duration: DURATIONS.action,
      action: {
        label: 'View Order',
        onClick: () => window.location.href = '/account/orders',
      },
    })
  },
  
  cancelled: (orderId?: string) => {
    toast.success(orderId ? `Order #${orderId} cancelled` : 'Order cancelled', {
      duration: DURATIONS.success,
    })
  },
  
  error: (message = 'Failed to process order') => {
    toast.error(message, {
      duration: DURATIONS.error,
    })
  },
}

/**
 * Generic toasts
 */
export const appToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: DURATIONS.success,
    })
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: DURATIONS.error,
    })
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: DURATIONS.default,
    })
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: DURATIONS.default,
    })
  },
  
  loading: (message: string) => {
    return toast.loading(message)
  },
  
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toast.promise(promise, options)
  },

  // Dismiss a specific toast or all toasts
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },
}

export default appToast
