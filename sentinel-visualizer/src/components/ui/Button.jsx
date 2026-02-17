import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

const variants = {
    primary: "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    outline: "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/40",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
};

const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

export const Button = forwardRef(({
    className,
    variant = "primary",
    size = "md",
    isLoading,
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";
