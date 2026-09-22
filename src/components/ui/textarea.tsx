import { splitProps, type JSX } from "solid-js"

import { cn } from "@/lib/utils"

function Textarea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <textarea
      data-slot="textarea"
      class={cn(
        "flex min-h-[80px] w-full rounded-base border-2 border-neutral-900 bg-secondary-background selection:bg-main selection:text-main-foreground px-3 py-2 text-sm font-base text-neutral-950 placeholder:text-neutral-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-50/50",
        local.class,
      )}
      {...others}
    />
  )
}

export { Textarea }
