import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ALL_DOMAINS, DOMAIN_COLORS, DOMAIN_ICONS } from "../../constants";

type FilterSidebarProps = {
  completedFilter: "all" | "finished" | "unfinished";
  setCompletedFilter: (filter: "all" | "finished" | "unfinished") => void;
  selectedDomains: string[];
  toggleDomain: (domain: string) => void;
  deadlineFilter: "all" | "today" | "tomorrow" | "next-week" | "next-month";
  setDeadlineFilter: (
    filter: "all" | "today" | "tomorrow" | "next-week" | "next-month",
  ) => void;
  sortBy: "default" | "priority";
  setSortBy: (value: "default" | "priority") => void;
};

export function FilterSidebar({
  completedFilter,
  setCompletedFilter,
  selectedDomains,
  toggleDomain,
  deadlineFilter,
  setDeadlineFilter,
  sortBy,
  setSortBy,
}: FilterSidebarProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Filters</h2>

      {/* Domain Filter - Buttons mit Icons */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Domain</Label>
        <div className="space-y-2">
          {ALL_DOMAINS.map((domain) => {
            const isSelected = selectedDomains.includes(domain);
            const color = DOMAIN_COLORS[domain];
            const Icon = DOMAIN_ICONS[domain];

            return (
              <button
                key={domain}
                onClick={() => toggleDomain(domain)}
                className="w-full px-3 py-2 rounded-md text-sm font-medium transition-all text-left cursor-pointer hover:opacity-80 flex items-center gap-2"
                style={{
                  backgroundColor: isSelected ? color : "transparent",
                  color: isSelected ? "#ffffff" : color,
                  border: `2px solid ${color}`,
                }}
              >
                <Icon size={16} />
                <span className="capitalize">{domain}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Deadline Filter - Dropdown */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Deadline</Label>
        <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Select deadline filter" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="next-week">Next Week</SelectItem>
            <SelectItem value="next-month">Next Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      {/* Completed Filter - Dropdown */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Completed</Label>
        <Select value={completedFilter} onValueChange={setCompletedFilter}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Select completed filter" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
            <SelectItem value="unfinished">Unfinished</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      {/* Sort By - Dropdown */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Sort By</Label>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "default" | "priority")}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
            <SelectItem value="default">Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
