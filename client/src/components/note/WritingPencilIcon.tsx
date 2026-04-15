import { Pencil } from "lucide-react";

type WritingPencilIconProps = {
  sizeClassName?: string;
  className?: string;
  tone?: "default" | "onPrimary";
};

/**
 * Pencil with a small scribble-style motion for the streaming / “writing” phase.
 */
export function WritingPencilIcon({
  sizeClassName = "h-14 w-14",
  className = "",
  tone = "default",
}: WritingPencilIconProps) {
  const strokeClass = tone === "onPrimary" ? "text-primary-foreground" : "text-primary";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${sizeClassName} ${className}`}
      aria-hidden
    >
      <Pencil
        className={`h-[62%] w-[62%] origin-[70%_85%] animate-pencil-write ${strokeClass}`}
        strokeWidth={2}
      />
    </div>
  );
}
