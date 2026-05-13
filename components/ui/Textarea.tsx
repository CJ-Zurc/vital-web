import { cn } from "@/lib/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

/**
 * BGH OneUI Textarea
 *
 * Same visual language as Input — rounded corners, label above,
 * green focus ring, red error state.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, disabled, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-sans font-semibold text-sm text-gray-800"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={4}
          className={cn(
            // Base
            "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-sans text-sm text-gray-800 placeholder-gray-400 resize-none",
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

Textarea.displayName = "Textarea";