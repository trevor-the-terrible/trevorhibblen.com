import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skills, type Skill } from "./skills";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default WebDevSkillsTable;

export function WebDevSkillsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(skills.map((skill) => skill.category))];

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || skill.category === categoryFilter)
  );

  return (
    <Card
      className="
        app-component
        relative
      "
    >
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-0 sm:gap-4">
        <Input
          name="hibblen-skills-search"
          type="search"
          placeholder="Filter skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:w-1/2 mb-4"
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-1/2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>

      <CardContent className="">
        <Table className='table table-fixed'>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Skill</TableHead>
              <TableHead className="font-bold hidden md:table-column">
                Category
              </TableHead>
              <TableHead className="font-bold">Level</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSkills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell>
                  {skill.name}
                  {skill.detail && (
                    <span
                      className="
                      "
                    >
                      ({skill.detail})
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-column">
                  {skill.category}
                </TableCell>
                <TableCell>{skill.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
