// Order Status Types and Utilities
// ================================

export type OrderItemStatus = 
  | 'pending' 
  | 'received' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItemStatusConfig {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  nextStatus?: OrderItemStatus;
  nextActionLabel?: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderItemStatus, OrderItemStatusConfig> = {
  pending: {
    label: 'Pending',
    description: 'Waiting for seller confirmation',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: '⏳',
    nextStatus: 'received',
    nextActionLabel: 'Mark as Received',
  },
  received: {
    label: 'Received',
    description: 'Seller confirmed the order',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '✅',
    nextStatus: 'processing',
    nextActionLabel: 'Start Processing',
  },
  processing: {
    label: 'Processing',
    description: 'Order is being prepared',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: '📦',
    nextStatus: 'shipped',
    nextActionLabel: 'Mark as Shipped',
  },
  shipped: {
    label: 'Shipped',
    description: 'Order is on the way',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: '🚚',
    nextStatus: 'delivered',
    nextActionLabel: 'Mark as Delivered',
  },
  delivered: {
    label: 'Delivered',
    description: 'Order has been delivered',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '🎉',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order was cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '❌',
  },
};

// Get status configuration
export function getStatusConfig(status: OrderItemStatus): OrderItemStatusConfig {
  return ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
}

// Check if status can be updated by seller
export function canSellerUpdateStatus(currentStatus: OrderItemStatus): boolean {
  return ['pending', 'received', 'processing', 'shipped'].includes(currentStatus);
}

// Get available next statuses for seller
export function getNextStatusOptions(currentStatus: OrderItemStatus): OrderItemStatus[] {
  const statusOrder: OrderItemStatus[] = ['pending', 'received', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  if (currentIndex === -1 || currentIndex >= statusOrder.length - 1) {
    return [];
  }
  
  // Can go to next status or skip to shipped (if received/processing)
  const options: OrderItemStatus[] = [statusOrder[currentIndex + 1]];
  
  // Allow marking as cancelled from any non-delivered status
  if (currentStatus !== 'delivered' && currentStatus !== 'cancelled') {
    options.push('cancelled');
  }
  
  return options;
}

// Format status for display
export function formatStatus(status: OrderItemStatus): string {
  return getStatusConfig(status).label;
}

// Check if order is complete (delivered or cancelled)
export function isOrderComplete(status: OrderItemStatus): boolean {
  return status === 'delivered' || status === 'cancelled';
}

// Bulgarian shipping carriers
export const SHIPPING_CARRIERS = [
  { value: 'speedy', label: 'Speedy' },
  { value: 'econt', label: 'Econt' },
  { value: 'dhl', label: 'DHL' },
  { value: 'ups', label: 'UPS' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'bulgarian_posts', label: 'Bulgarian Posts' },
  { value: 'other', label: 'Other' },
] as const;

export type ShippingCarrier = typeof SHIPPING_CARRIERS[number]['value'];
