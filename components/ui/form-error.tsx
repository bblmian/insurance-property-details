import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  message?: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 mt-1 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="h-4 w-4" />
      <p className="font-medium">{message}</p>
    </div>
  )
} 