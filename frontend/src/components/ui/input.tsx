import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: "default" | "ghost" | "filled"
  size?: "sm" | "md" | "lg"
  error?: boolean
  success?: boolean
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    variant = "default",
    size = "md",
    error = false,
    success = false,
    loading = false,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "relative flex w-full rounded-lg border transition-all duration-200 ease-in-out font-medium placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed file:border-0 file:bg-transparent file:font-medium"
    
    const variantStyles = {
      default: "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 hover:border-gray-300 focus-visible:border-blue-500 focus-visible:ring-blue-500/20",
      ghost: "bg-transparent border-transparent text-gray-900 placeholder:text-gray-500 hover:bg-gray-50 focus-visible:bg-white focus-visible:border-gray-200 focus-visible:ring-gray-500/20",
      filled: "bg-gray-50 border-transparent text-gray-900 placeholder:text-gray-500 hover:bg-gray-100 focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
    }
    
    const sizeStyles = {
      sm: "h-8 px-3 py-1 text-sm file:text-xs",
      md: "h-10 px-3 py-2 text-sm file:text-sm",
      lg: "h-12 px-4 py-3 text-base file:text-sm"
    }
    
    const stateStyles = React.useMemo(() => {
      if (disabled) {
        return "opacity-50 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed hover:border-gray-200"
      }
      
      if (error) {
        return "border-red-300 bg-red-50/50 text-red-900 placeholder:text-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20 hover:border-red-400"
      }
      
      if (success) {
        return "border-green-300 bg-green-50/50 text-green-900 placeholder:text-green-400 focus-visible:border-green-500 focus-visible:ring-green-500/20 hover:border-green-400"
      }
      
      if (loading) {
        return "border-blue-300 bg-blue-50/50 text-blue-900 placeholder:text-blue-400"
      }
      
      return ""
    }, [disabled, error, success, loading])

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            stateStyles,
            className
          )}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-r-blue-600"></div>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }