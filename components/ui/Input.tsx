import { cn } from "@/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * BGH OneUI Text Input
 *
 * States handled:
 *  - Default:  Light bg, gray border, rounded corners, label above
 *  - Focused:  Green border (bgh-green)
 *  - Error:    Red border + red helper text below
 *  - Disabled: Gray bg, reduced opacity, non-editable appearance
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, disabled, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans font-semibold text-sm text-gray-800"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            // Base
            "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-sans text-sm text-gray-800 placeholder-gray-400",
            "transition-colors duration-150",
            "focus:outline-none focus:border-bgh-green focus:ring-1 focus:ring-bgh-green",
            // Error state
            error && "border-bgh-red focus:border-bgh-red focus:ring-bgh-red",
            // Disabled state
            disabled && "bg-gray-100 opacity-60 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && (
          <p className="font-sans text-xs text-bgh-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";