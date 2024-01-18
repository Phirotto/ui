import { cn } from "@/lib/utils";

function Skeleton({
  className,
  active = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { active?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        { "animate-pulse": active },
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
