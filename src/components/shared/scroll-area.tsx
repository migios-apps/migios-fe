import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          relative overflow-auto
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-gray-300
          hover:scrollbar-thumb-gray-400
          dark:scrollbar-thumb-gray-600
          dark:hover:scrollbar-thumb-gray-500
          ${className}
        `}
        {...props}
      >
        <div className="h-full w-full">{children}</div>
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
