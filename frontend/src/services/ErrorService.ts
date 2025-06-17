/**
 * Service for standardized error handling across the application
 */
export class ErrorService {
  /**
   * Extract a user-friendly error message from various error types
   * @param error - The error object
   * @param fallbackMessage - Default message if no specific error is found
   */
  static getErrorMessage(
    error: unknown, 
    fallbackMessage: string = 'An unexpected error occurred'
  ): string {
    // Handle different error types
    if (error instanceof Error) {
      return error.message;
    }
    
    // Handle Axios error responses
    if (typeof error === 'object' && error !== null) {
      const apiError = error as { 
        response?: { 
          data?: { 
            message?: string,
            errors?: Record<string, string[]>
          } 
        } 
      };
      
      // Check for API error message
      if (apiError.response?.data?.message) {
        return apiError.response.data.message;
      }
      
      // Check for validation errors and format them
      if (apiError.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = Object.values(errors)
          .flat()
          .filter(Boolean);
          
        if (errorMessages.length > 0) {
          return errorMessages.join(', ');
        }
      }
    }
    
    return fallbackMessage;
  }
  
  /**
   * Log an error with consistent formatting
   * @param context - Where the error occurred (e.g., 'ProfileService.getProfile')
   * @param error - The error object
   * @param additionalInfo - Any additional information to log
   */  static logError(
    context: string,
    error: unknown,
    additionalInfo: Record<string, unknown> = {}
  ): void {
    console.error(
      `Error in ${context}:`, 
      error, 
      Object.keys(additionalInfo).length ? additionalInfo : ''
    );
  }
}

export default ErrorService;
