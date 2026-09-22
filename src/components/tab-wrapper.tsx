import { Tabs } from "@kobalte/core/tabs";
import { For, createSignal, onMount } from "solid-js";

export type Tab = Readonly<{
  id: string;
  label: string;
}>;

type TabWrapperProps = Readonly<{
  tabs: readonly Tab[];
  defaultValue?: string;
  group?: string;
}>;

const showTab = (tabId: string, group: string): void => {
  for (const element of document.getElementsByClassName(group)) {
    element.classList.toggle("hidden", element.id !== tabId);
  }
};

export default function TabWrapper(props: TabWrapperProps) {
  const defaultValue = () => props.defaultValue ?? "";
  const group = () => props.group ?? "tab-content";
  const [selected, setSelected] = createSignal(defaultValue());

  const selectTab = (tabId: string) => {
    setSelected(tabId);
    showTab(tabId, group());
  };

  onMount(() => showTab(selected(), group()));

  return (
    <Tabs value={selected()} onChange={selectTab} class="w-auto">
      <Tabs.List class="inline-flex h-12 items-center justify-center rounded-base border-2 border-neutral-900 bg-white p-1 text-neutral-950 dark:border-neutral-800 dark:bg-secondary-background dark:text-neutral-50">
        <For each={props.tabs}>
          {(tab) => (
            <Tabs.Trigger
              id={`${group()}-tab-${tab.id}`}
              value={tab.id}
              aria-controls={tab.id}
              data-state={selected() === tab.id ? "active" : "inactive"}
              class="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-base border-2 border-transparent px-2 py-1 text-sm font-heading ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-neutral-900 data-[state=active]:bg-main data-[state=active]:text-main-foreground dark:focus-visible:ring-neutral-300 dark:data-[state=active]:border-neutral-800"
            >
              {tab.label}
            </Tabs.Trigger>
          )}
        </For>
      </Tabs.List>
    </Tabs>
  );
}
