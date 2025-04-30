import { cn } from "@/lib/utils"

interface MatchScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function MatchScore({ score, size = "md", showLabel = false, className }: MatchScoreProps) {
  // Déterminer la couleur en fonction du score
  const getColor = () => {
    if (score >= 90) return "from-[#ff3b8b] to-[#ff8cc8]"
    if (score >= 75) return "from-[#ff3b8b] to-[#ff8cc8]/80"
    if (score >= 60) return "from-[#ff8cc8] to-[#ff8cc8]/70"
    if (score >= 45) return "from-purple-500 to-purple-400"
    if (score >= 30) return "from-purple-400 to-purple-300"
    return "from-purple-300 to-purple-200"
  }

  // Déterminer la taille
  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6 text-xs"
      case "lg":
        return "h-12 w-12 text-lg"
      default:
        return "h-8 w-8 text-sm"
    }
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r",
          getColor(),
          getSize(),
        )}
      >
        {score}
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {score >= 90
            ? "Match parfait"
            : score >= 75
              ? "Très compatible"
              : score >= 60
                ? "Compatible"
                : score >= 45
                  ? "Intéressant"
                  : "Match possible"}
        </span>
      )}
    </div>
  )
}
