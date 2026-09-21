import { splitProps, type JSX } from "solid-js"

import { cn } from "@/lib/utils"

type CardProps = JSX.HTMLAttributes<HTMLDivElement>

function Card(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card"
      class={cn(
        "card rounded-base flex flex-col shadow-shadow border-2 gap-6 py-6 border-neutral-900 bg-white text-neutral-950 font-base dark:border-neutral-800 dark:bg-secondary-background dark:text-neutral-50",
        local.class,
      )}
      {...others}
    />
  )
}

function CardHeader(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card-header"
      class={cn(
        "card-header @container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        local.class,
      )}
      {...others}
    />
  )
}

function CardTitle(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card-title"
      class={cn("card-title font-heading leading-none", local.class)}
      {...others}
    />
  )
}

function CardDescription(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card-description"
      class={cn("text-sm font-base", local.class)}
      {...others}
    />
  )
}

function CardAction(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card-action"
      class={cn(
        "card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        local.class,
      )}
      {...others}
    />
  )
}

function CardContent(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card-content"
      class={cn("card-content px-6", local.class)}
      {...others}
    />
  )
}

function CardFooter(props: CardProps) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div
      data-slot="card-footer"
      class={cn(
        "card-footer flex items-center px-6 [.border-t]:pt-6",
        local.class,
      )}
      {...others}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
}
