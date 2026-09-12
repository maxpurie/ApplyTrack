import { createFileRoute } from "@tanstack/react-router"

import { CareerCopilot } from "@/components/CareerCopilot"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - ApplyTrack",
      },
    ],
  }),
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  return (
    <div>
      <div>
        <h1 className="text-2xl truncate max-w-sm">
          Hi, {currentUser?.full_name || currentUser?.email} 👋
        </h1>
        <p className="text-muted-foreground">Your focused workspace for every application.</p>
      </div>
      <CareerCopilot />
    </div>
  )
}
