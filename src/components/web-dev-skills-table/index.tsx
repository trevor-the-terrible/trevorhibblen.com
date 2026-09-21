import { Select } from "@kobalte/core/select";
import { Check, ChevronDown } from "lucide-solid";
import { For, createMemo, createSignal } from "solid-js";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { skills } from "./skills";

const categories = [
  "All",
  ...new Set(skills.map((skill) => skill.category)),
];

export default function WebDevSkillsTable() {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [categoryFilter, setCategoryFilter] = createSignal("All");

  const filteredSkills = createMemo(() => {
    const query = searchTerm().toLowerCase();
    const category = categoryFilter();

    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) &&
        (category === "All" || skill.category === category),
    );
  });

  return (
    <Card class="app-component relative">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>

      <CardContent class="flex flex-col gap-0 sm:flex-row sm:gap-4">
        <Input
          name="hibblen-skills-search"
          type="search"
          placeholder="Filter skills..."
          value={searchTerm()}
          onInput={(event) => setSearchTerm(event.currentTarget.value)}
          class="mb-4 dark:bg-black sm:w-1/2"
        />

        <Select<string>
          options={categories}
          value={categoryFilter()}
          onChange={setCategoryFilter}
          placeholder="Select category"
          sameWidth
          itemComponent={(props) => (
            <Select.Item
              item={props.item}
              class="relative flex w-full cursor-default select-none items-center gap-2 rounded-base border-2 border-transparent py-1.5 pr-8 pl-2 text-sm font-base outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:border-neutral-900 dark:data-[highlighted]:border-neutral-800"
            >
              <Select.ItemIndicator class="absolute right-2 flex size-3.5 items-center justify-center">
                <Check class="size-4" />
              </Select.ItemIndicator>
              <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            </Select.Item>
          )}
        >
          <Select.HiddenSelect />
          <Select.Trigger
            aria-label="Filter skills by category"
            class="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-base border-2 border-neutral-900 bg-main px-3 py-2 text-sm font-base text-main-foreground ring-offset-white focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 sm:w-1/2"
          >
            <Select.Value<string>>
              {(state) => state.selectedOption()}
            </Select.Value>
            <Select.Icon>
              <ChevronDown class="size-4" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content class="relative z-50 max-h-96 min-w-[var(--kb-popper-anchor-width)] overflow-hidden rounded-base border-2 border-neutral-900 bg-main text-main-foreground dark:border-neutral-800">
              <Select.Listbox class="p-1" />
            </Select.Content>
          </Select.Portal>
        </Select>
      </CardContent>

      <CardContent>
        <Table class="table table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead class="font-bold">Skill</TableHead>
              <TableHead class="hidden font-bold md:table-cell">
                Category
              </TableHead>
              <TableHead class="font-bold">Level</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <For each={filteredSkills()}>
              {(skill) => (
                <TableRow>
                  <TableCell>
                    {skill.name}
                    {skill.detail ? <span>({skill.detail})</span> : null}
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {skill.category}
                  </TableCell>
                  <TableCell>{skill.level}</TableCell>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
