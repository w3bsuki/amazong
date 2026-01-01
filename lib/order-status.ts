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
    color: 'text-order-pending',
    bgColor: 'bg-order-pending/10',
    borderColor: 'border-order-pending/25',
    icon: '⏳',
    nextStatus: 'received',
    nextActionLabel: 'Mark as Received',
  },
  received: {
    label: 'Received',
    description: 'Seller confirmed the order',
    color: 'text-order-received',
    bgColor: 'bg-order-received/10',
    borderColor: 'border-order-received/25',
    icon: '✅',
    nextStatus: 'processing',
    nextActionLabel: 'Start Processing',
  },
  processing: {
    label: 'Processing',
    description: 'Order is being prepared',
    color: 'text-order-processing',
    bgColor: 'bg-order-processing/10',
    borderColor: 'border-order-processing/25',
    icon: '📦',
    nextStatus: 'shipped',
    nextActionLabel: 'Mark as Shipped',
  },
  shipped: {
    label: 'Shipped',
    description: 'Order is on the way',
    color: 'text-order-shipped',
    bgColor: 'bg-order-shipped/10',
    borderColor: 'border-order-shipped/25',
    icon: '🚚',
    nextStatus: 'delivered',
    nextActionLabel: 'Mark as Delivered',
  },
  delivered: {
    label: 'Delivered',
    description: 'Order has been delivered',
    color: 'text-order-delivered',
    bgColor: 'bg-order-delivered/10',
    borderColor: 'border-order-delivered/25',
    icon: '🎉',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order was cancelled',
    color: 'text-order-cancelled',
    bgColor: 'bg-order-cancelled/10',
    borderColor: 'border-order-cancelled/25',
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
  const next = statusOrder[currentIndex + 1]
  const options: OrderItemStatus[] = next ? [next] : []
  
  // Allow marking as cancelled from any non-delivered status
  if (currentStatus !== 'delivered' && currentStatus !== 'cancelled') {
    options.push('cancelled');
  }
  
  return options;
}

// Format status for display
function formatStatus(status: OrderItemStatus): string {
  return getStatusConfig(status).label;
}

// Check if order is complete (delivered or cancelled)
function isOrderComplete(status: OrderItemStatus): boolean {
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
