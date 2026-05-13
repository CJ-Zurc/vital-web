import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

/**
 * BGH OneUI Button
 *
 * Variants:
 *  - primary:   Dark green background, white text (default CTA)
 *  - secondary: White background, green border + text (back/cancel actions)
 */
export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-sans font-semibold text-base transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-bgh-green focus-visible:ring-offset-2",
        // Full width
        fullWidth && "w-full",
        // Primary variant
        variant === "primary" && [
          "bg-bgh-dark text-white",
          "hover:bg-bgh-green",
          "active:bg-bgh-dark",
          "disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed",
        ],
        // Secondary variant
        variant === "secondary" && [
          "bg-white text-bgh-dark border-2 border-bgh-dark",
          "hover:bg-bgh-soft hover:border-bgh-green hover:text-bgh-dark",
          "active:bg-bgh-soft",
          "disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}