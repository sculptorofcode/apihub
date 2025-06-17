import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "font-medium leading-none transition-colors duration-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-gray-900",
        subtle: "text-gray-600",
        muted: "text-gray-500",
        error: "text-red-600",
        success: "text-green-600",
        warning: "text-amber-600",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      weight: "medium",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  optional?: boolean
  tooltip?: string
  description?: string
  error?: boolean
  success?: boolean
  warning?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size, 
  weight,
  required = false,
  optional = false,
  tooltip,
  description,
  error = false,
  success = false,
  warning = false,
  children,
  ...props 
}, ref) => {
  // Determine variant based on state props
  const computedVariant = React.useMemo(() => {
    if (error) return "error"
    if (success) return "success"
    if (warning) return "warning"
    return variant
  }, [variant, error, success, warning])

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <LabelPrimitive.Root
          ref={ref}
          className={cn(labelVariants({ variant: computedVariant, size, weight }), className)}
          {...props}
        >
          {children}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
          {optional && (
            <span className="text-gray-400 ml-1 font-normal text-xs">
              (optional)
            </span>
          )}
        </LabelPrimitive.Root>
        
        {tooltip && (
          <div className="group relative">
            <button
              type="button"
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              aria-label="More information"
            >
              <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0zM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM6.75 8a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v2.75a.75.75 0 0 1-1.5 0V8.5h-.75A.75.75 0 0 1 6.75 8z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap max-w-xs">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {description && (
        <p className={cn(
          "text-xs leading-relaxed",
          error && "text-red-600",
          success && "text-green-600", 
          warning && "text-amber-600",
          !error && !success && !warning && "text-gray-500"
        )}>
          {description}
        </p>
      )}
    </div>
  )
})

Label.displayName = LabelPrimitive.Root.displayName

export { Label }