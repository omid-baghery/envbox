"use client"

import { ActionButton } from "@/shared/components/ui/action-button"
import { ComponentProps } from "react"

export function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  action: () => Promise<{ error: null | { message?: string } }>
  successMessage?: string
}) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action()

        if (res.error) {
          return { error: true, message: res.error.message || "Action failed" }
        } else {
          return { error: false, message: successMessage }
        }
      }}
    />
  )
}
