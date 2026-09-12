import { Sparkles } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CareerCopilot() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [advice, setAdvice] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const analyze = async () => {
    setError("")
    setAdvice("")
    setIsLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ""}/api/v1/career/copilot`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail ?? "Unable to generate advice right now.")
      }
      setAdvice(data.advice)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to generate advice right now.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h2 className="font-semibold">AI Application Copilot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare a resume with a job description to identify genuine strengths,
            gaps, and a tailored next step.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Input
          aria-label="Resume text"
          className="min-h-32 h-auto py-3"
          onChange={(event) => setResumeText(event.target.value)}
          placeholder="Paste a short resume summary or key skills…"
          value={resumeText}
        />
        <Input
          aria-label="Job description"
          className="min-h-32 h-auto py-3"
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Paste the role's job description…"
          value={jobDescription}
        />
      </div>
      <Button
        className="mt-4"
        disabled={isLoading || resumeText.length < 40 || jobDescription.length < 40}
        onClick={analyze}
      >
        <Sparkles />
        {isLoading ? "Analyzing…" : "Analyze fit"}
      </Button>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {advice && (
        <div className="mt-5 whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-6">
          {advice}
        </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        AI is optional and uses a server-side key only when the project owner enables it.
        Resume and job-description text is not saved by ApplyTrack.
      </p>
    </section>
  )
}
