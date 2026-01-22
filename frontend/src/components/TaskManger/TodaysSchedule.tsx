import { Card } from "@/components/ui/card";
import { Clock, Calendar, CheckCircle2, Users, Coffee } from "lucide-react";

type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  type: "meeting" | "task" | "break" | "event";
  completed?: boolean;
};

const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: "1",
    time: "09:00",
    title: "Team Standup",
    type: "meeting",
    completed: true,
  },
  {
    id: "2",
    time: "10:30",
    title: "Review Pull Request",
    type: "task",
    completed: true,
  },
  {
    id: "3",
    time: "12:00",
    title: "Lunch Break",
    type: "break",
  },
  {
    id: "4",
    time: "14:00",
    title: "Prepare presentation",
    type: "task",
  },
  {
    id: "5",
    time: "16:00",
    title: "Client Meeting",
    type: "meeting",
  },
  {
    id: "6",
    time: "18:00",
    title: "Dinner with friends",
    type: "event",
  },
];

const getTypeIcon = (type: ScheduleItem["type"]) => {
  switch (type) {
    case "meeting":
      return <Users className="w-4 h-4" />;
    case "task":
      return <CheckCircle2 className="w-4 h-4" />;
    case "break":
      return <Coffee className="w-4 h-4" />;
    case "event":
      return <Calendar className="w-4 h-4" />;
  }
};

const getTypeColor = (type: ScheduleItem["type"]) => {
  switch (type) {
    case "meeting":
      return "text-blue-500";
    case "task":
      return "text-green-500";
    case "break":
      return "text-orange-500";
    case "event":
      return "text-purple-500";
  }
};

export function TodaysSchedule() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
      <Card className="p-4">
        <div className="space-y-3">
          {MOCK_SCHEDULE.map((item, index) => {
            const typeColor = getTypeColor(item.type);
            const TypeIcon = getTypeIcon(item.type);

            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 pb-3 ${
                  index !== MOCK_SCHEDULE.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                {/* Time */}
                <div className="flex items-center gap-1.5 min-w-15">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.time}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-2 flex-1">
                  <div className={typeColor}>{TypeIcon}</div>
                  <span
                    className={`text-sm ${
                      item.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
