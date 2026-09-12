import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
}: LogoProps) {
  const content =
    variant === "responsive" ? (
      <>
        <span className={cn("font-bold tracking-tight group-data-[collapsible=icon]:hidden", className)}>ApplyTrack</span>
        <span className={cn("hidden size-6 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground group-data-[collapsible=icon]:flex", className)}>A</span>
      </>
    ) : (
      <span className={cn(variant === "full" ? "font-bold tracking-tight" : "flex size-6 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground", className)}>
        {variant === "full" ? "ApplyTrack" : "A"}
      </span>
    )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}
