import { toast } from "sonner"

export type ToastVariant = "default" | "success" | "error" | "warning"

interface ToastOptions {
  variant?: ToastVariant
  description?: string
  duration?: number
}

export function showToast(message: string, options: ToastOptions = {}) {
  const { variant = "default", description, duration = 5000 } = options

  const toastOptions = {
    description,
    duration,
    className: "font-roboto",
  }

  switch (variant) {
    case "success":
      toast.success(message, toastOptions)
      break
    case "error":
      toast.error(message, toastOptions)
      break
    case "warning":
      toast.warning(message, toastOptions)
      break
    default:
      toast(message, toastOptions)
  }
}

export { TOAST_MESSAGES } from "./constants"