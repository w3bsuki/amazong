/**
 * Server Actions - Barrel Export
 * 
 * Import actions from here for cleaner imports:
 * import { createProduct, updateProduct } from '@/app/actions'
 */

// Product Actions
export {
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  bulkUpdateProductStatus,
  bulkDeleteProducts,
  updateProductStock,
  type ProductInput,
} from './products'

// Order Actions
export {
  updateOrderItemStatus,
  getSellerOrders,
  getSellerOrderStats,
  type OrderItem,
} from './orders'

// Review Actions
export {
  submitReview,
  updateReview,
  deleteReview,
  getProductReviews,
  markReviewHelpful,
  getUserReviews,
  respondToReview,
  canUserReviewProduct,
  type Review,
  type ReviewWithProduct,
} from './reviews'

// Profile Actions
export {
  getProfile,
  updateProfile,
  uploadAvatar,
  setAvatarUrl,
  deleteAvatar,
  updateEmail,
  updatePassword,
  deleteAccount,
} from './profile'

// Username Actions
export {
  checkUsernameAvailability,
  setUsername,
  getPublicProfile,
} from './username'

// Subscription Actions
export {
  getSubscriptionDetails,
  cancelSubscription,
  reactivateSubscription,
  getAvailableUpgrades,
  type SubscriptionDetails,
} from './subscriptions'

// Seller Feedback Actions
export {
  submitSellerFeedback,
  updateSellerFeedback,
  deleteSellerFeedback,
  getSellerFeedback,
  canUserLeaveFeedback,
  respondToFeedback,
  type SellerFeedback,
  type SellerFeedbackStats,
} from './seller-feedback'

// Buyer Feedback Actions
export {
  submitBuyerFeedback,
  canSellerRateBuyer,
  getBuyerReceivedRatings,
  getPublicBuyerFeedback,
  getSellerGivenFeedback,
  updateBuyerFeedback,
  deleteBuyerFeedback,
  type BuyerFeedback,
  type BuyerFeedbackInput,
} from './buyer-feedback'

// Seller Follows Actions
export {
  isFollowingSeller,
  followSeller,
  unfollowSeller,
  toggleFollowSeller,
} from './seller-follows'

// Blocked Users Actions
export {
  blockUser,
  unblockUser,
  getBlockedUsers,
  isUserBlocked,
  type BlockedUser,
} from './blocked-users'
