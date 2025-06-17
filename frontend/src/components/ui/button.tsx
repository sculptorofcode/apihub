import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-500/50 active:bg-blue-800 active:scale-[0.98]",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md focus-visible:ring-red-500/50 active:bg-red-800 active:scale-[0.98]",
        success: "bg-green-600 text-white shadow-sm hover:bg-green-700 hover:shadow-md focus-visible:ring-green-500/50 active:bg-green-800 active:scale-[0.98]",
        warning: "bg-amber-600 text-white shadow-sm hover:bg-amber-700 hover:shadow-md focus-visible:ring-amber-500/50 active:bg-amber-800 active:scale-[0.98]",
        outline: "border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-500/50 active:bg-gray-100",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500/50 active:bg-gray-300 active:scale-[0.98]",
        ghost: "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500/50 active:bg-gray-200",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 focus-visible:ring-blue-500/50",
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 focus-visible:ring-blue-500/50 active:scale-[0.98]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 hover:bg-white/20 focus-visible:ring-white/50",
        primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md focus-visible:ring-primary-500/50 active:bg-primary-800 active:scale-[0.98]",
      },
      size: {
        xs: "h-7 px-2 text-xs [&_svg]:size-3 rounded-md",
        sm: "h-8 px-3 text-sm [&_svg]:size-4 rounded-md",
        default: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        xl: "h-14 px-8 text-lg [&_svg]:size-6",
        icon: "h-10 w-10 [&_svg]:size-4",
        "icon-sm": "h-8 w-8 [&_svg]:size-4 rounded-md",
        "icon-lg": "h-12 w-12 [&_svg]:size-5",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        loading: true,
        className: "bg-blue-400 hover:bg-blue-400",
      },
      {
        variant: "destructive",
        loading: true,
        className: "bg-red-400 hover:bg-red-400",
      },
      {
        variant: "success",
        loading: true,
        className: "bg-green-400 hover:bg-green-400",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    asChild = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, loading, className }),
          fullWidth && "w-full",
          "group"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent opacity-75"></div>
          </div>
        )}

        <span className={cn(
          "flex items-center gap-2",
          loading && "opacity-0"
        )}>
          {leftIcon && (
            <span className="flex-shrink-0">
              {leftIcon}
            </span>
          )}

          {children}

          {rightIcon && (
            <span className="flex-shrink-0">
              {rightIcon}
            </span>
          )}
        </span>

        {/* Ripple effect */}
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></span>
        </span>
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button }