import { splitProps, type JSX } from "solid-js"

import { cn } from "@/lib/utils"

type SeparatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  decorative?: boolean
  orientation?: "horizontal" | "vertical"
}

function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, [
    "class",
    "decorative",
    "orientation",
  ])
  const orientation = () =>
    local.orientation === "vertical" ? "vertical" : "horizontal"
  const decorative = () => local.decorative ?? true

  return (
    <div
      data-orientation={orientation()}
      role={decorative() ? "none" : "separator"}
      aria-orientation={
        !decorative() && orientation() === "vertical" ? "vertical" : undefined
      }
      class={cn(
        "shrink-0 bg-neutral-200 dark:bg-neutral-800",
        orientation() === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        local.class,
      )}
      {...others}
    />
  )
}

export { Separator }
