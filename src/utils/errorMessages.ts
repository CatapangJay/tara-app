/**
 * User-friendly error messages for common error scenarios
 */

export const ErrorMessages = {
  // Location errors
  LOCATION_PERMISSION_DENIED: {
    title: 'Location Permission Required',
    message: 'Please enable location services to use Tara. Go to Settings > Tara > Location and select "While Using the App".',
  },
  LOCATION_UNAVAILABLE: {
    title: 'Location Unavailable',
    message: 'Unable to get your current location. Please check if location services are enabled.',
  },
  GEOCODING_FAILED: {
    title: 'Address Not Found',
    message: 'We couldn&apos;t find the address for this location. Please try selecting a different location.',
  },

  // Network errors
  NETWORK_ERROR: {
    title: 'Network Error',
    message: 'Please check your internet connection and try again.',
  },
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  TIMEOUT_ERROR: {
    title: 'Request Timeout',
    message: 'The request took too long. Please check your connection and try again.',
  },

  // Ride booking errors
  NO_DRIVERS_AVAILABLE: {
    title: 'No Drivers Available',
    message: 'There are no drivers available in your area right now. Please try again in a few minutes.',
  },
  BOOKING_FAILED: {
    title: 'Booking Failed',
    message: 'Unable to create your ride request. Please try again.',
  },
  INVALID_LOCATIONS: {
    title: 'Invalid Locations',
    message: 'Please select valid pickup and destination locations.',
  },
  RIDE_CANCELLED: {
    title: 'Ride Cancelled',
    message: 'Your ride has been cancelled.',
  },

  // Driver errors
  DRIVER_OFFLINE: {
    title: 'You&apos;re Offline',
    message: 'Please go online to start receiving ride requests.',
  },
  RIDE_EXPIRED: {
    title: 'Ride Request Expired',
    message: 'The ride request has expired. You can go back online to receive new requests.',
  },

  // Storage errors
  STORAGE_ERROR: {
    title: 'Storage Error',
    message: 'Unable to save data. Please check your device storage.',
  },
  LOAD_DATA_ERROR: {
    title: 'Load Error',
    message: 'Unable to load data. Please try again.',
  },

  // Generic error
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
} as const;

export type ErrorType = keyof typeof ErrorMessages;

/**
 * Get user-friendly error message from error object
 */
export function getErrorMessage(error: unknown): { title: string; message: string } {
  // If it's already a known error type
  if (typeof error === 'string' && error in ErrorMessages) {
    return ErrorMessages[error as ErrorType];
  }

  // Check error message for specific patterns
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
      return ErrorMessages.LOCATION_PERMISSION_DENIED;
    }

    if (errorMessage.includes('location') || errorMessage.includes('unavailable')) {
      return ErrorMessages.LOCATION_UNAVAILABLE;
    }

    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return ErrorMessages.NETWORK_ERROR;
    }

    if (errorMessage.includes('timeout')) {
      return ErrorMessages.TIMEOUT_ERROR;
    }

    if (errorMessage.includes('geocod') || errorMessage.includes('address')) {
      return ErrorMessages.GEOCODING_FAILED;
    }
  }

  // Default to unknown error
  return ErrorMessages.UNKNOWN_ERROR;
}

/**
 * Format error for logging (preserves technical details)
 */
export function formatErrorForLogging(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  return JSON.stringify(error, null, 2);
}
