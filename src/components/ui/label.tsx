import { splitProps, type JSX } from "solid-js"

import { cn } from "@/lib/utils"

function Label(props: JSX.LabelHTMLAttributes<HTMLLabelElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <label
      data-slot="label"
      class={cn(
        "text-sm font-heading leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        local.class,
      )}
      {...others}
    />
  )
}

export { Label }
