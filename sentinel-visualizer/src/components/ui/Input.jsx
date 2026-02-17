import clsx from "clsx";
import { forwardRef } from "react";

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-xs font-medium text-white/50">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={clsx(
                    "flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500/50 focus:border-red-500",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";
