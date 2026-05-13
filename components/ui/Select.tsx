import { cn } from "@/lib/cn";
import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

/**
 * BGH OneUI Select / Dropdown
 *
 * States handled:
 *  - Default:  Rounded input, dropdown arrow icon, neutral border
 *  - Focused:  Green border (bgh-green)
 *  - Error:    Red border + red helper text
 *  - Disabled: Gray inactive background, muted arrow
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, disabled, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-sans font-semibold text-sm text-gray-800"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              // Base
              "w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 font-sans text-sm text-gray-800",
              "transition-colors duration-150",
              "focus:outline-none focus:border-bgh-green focus:ring-1 focus:ring-bgh-green",
              // Error state
              error && "border-bgh-red focus:border-bgh-red focus:ring-bgh-red",
              // Disabled state
              disabled && "bg-gray-100 opacity-60 cursor-not-allowed",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Dropdown chevron icon */}
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4",
              disabled ? "text-gray-400" : "text-bgh-dark"
            )}
          />
        </div>
        {error && (
          <p className="font-sans text-xs text-bgh-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";