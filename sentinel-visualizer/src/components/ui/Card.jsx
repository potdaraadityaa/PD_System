import clsx from "clsx";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={clsx(
                "rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, title, description, ...props }) {
    return (
        <div className={clsx("mb-6 flex flex-col gap-1", className)} {...props}>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {description && <p className="text-sm text-white/50">{description}</p>}
        </div>
    );
}
