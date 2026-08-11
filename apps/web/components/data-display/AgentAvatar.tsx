import { cn } from "@/lib/cn";

export function AgentAvatar({
  name,
  avatar,
  className,
}: {
  name: string;
  avatar?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote dicebear avatars
      <img
        src={avatar}
        alt=""
        className={cn(
          "border-border bg-surface-muted h-9 w-9 rounded-md border object-cover",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-accent-soft text-accent inline-flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold",
        className,
      )}
    >
      {initials || "?"}
    </span>
  );
}
