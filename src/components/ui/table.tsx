import { splitProps, type JSX } from "solid-js"

import { cn } from "@/lib/utils"

function Table(props: JSX.HTMLAttributes<HTMLTableElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <div class="relative w-full overflow-auto">
      <table
        data-slot="table"
        class={cn(
          "w-full caption-bottom border-2 border-neutral-900 text-sm dark:border-neutral-800",
          local.class,
        )}
        {...others}
      />
    </div>
  )
}

function TableHeader(props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <thead
      data-slot="table-header"
      class={cn(
        "[&_tr]:border-b-2 [&_tr]:border-neutral-900 dark:[&_tr]:border-neutral-800",
        local.class,
      )}
      {...others}
    />
  )
}

function TableBody(props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <tbody
      data-slot="table-body"
      class={cn("[&_tr:last-child]:border-0", local.class)}
      {...others}
    />
  )
}

function TableFooter(props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        "border-t-2 border-neutral-900 bg-main font-base text-secondary-foreground_ last:[&>tr]:border-b-0 dark:border-neutral-800",
        local.class,
      )}
      {...others}
    />
  )
}

function TableRow(props: JSX.HTMLAttributes<HTMLTableRowElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <tr
      data-slot="table-row"
      class={cn(
        "border-b-2 border-neutral-900 transition-colors text-secondary-foreground_ bg-secondary-background font-base data-[state=selected]:bg-secondary-background data-[state=selected]:text-secondary-foreground_ dark:border-neutral-800",
        local.class,
      )}
      {...others}
    />
  )
}

function TableHead(props: JSX.ThHTMLAttributes<HTMLTableCellElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <th
      data-slot="table-head"
      class={cn(
        "h-12 px-4 text-left align-middle font-heading text-secondary-foreground_ [&:has([role=checkbox])]:pr-0",
        local.class,
      )}
      {...others}
    />
  )
}

function TableCell(props: JSX.TdHTMLAttributes<HTMLTableCellElement>) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <td
      data-slot="table-cell"
      class={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        local.class,
      )}
      {...others}
    />
  )
}

function TableCaption(
  props: JSX.CaptionHTMLAttributes<HTMLTableCaptionElement>,
) {
  const [local, others] = splitProps(props, ["class"])

  return (
    <caption
      data-slot="table-caption"
      class={cn(
        "mt-4 text-sm text-neutral-950 font-base dark:text-neutral-50",
        local.class,
      )}
      {...others}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
