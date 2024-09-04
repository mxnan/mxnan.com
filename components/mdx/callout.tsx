import { cn } from "@/lib/utils";

export interface CalloutProps {
  children?: React.ReactNode;
  type?: "default" | "warning" | "danger";
}

export function Callout({
  children,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "my-10 w-full max-w-3xl pr-5 p-3 font-medium text-sm flex items-start rounded-md border-l-[5px] border-b-[5px] bg-secondary/50",
        {
          " text-secondary bg-destructive dark:text-primary": type === "danger",
          " bg-yellow-400 text-primary": type === "warning",
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
}
