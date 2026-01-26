import { Menu } from "lucide-react";
import { useMemo } from "react";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = "Alex";

    if (hour >= 6 && hour < 12) {
      return `Good Morning, ${name}`;
    } else if (hour >= 12 && hour < 18) {
      return `Hey, ${name}`;
    } else if (hour >= 18 && hour < 24) {
      return `Good Evening, ${name}`;
    } else {
      // 0-6 Uhr - Random auswählen
      const lateNightGreetings = [
        `Still awake, ${name}?`,
        `Late night, ${name}?`,
        `Can't sleep, ${name}?`,
        `You're up late, ${name}`,
        `Working late, ${name}?`,
        `Midnight session, ${name}?`,
      ];
      const randomIndex = Math.floor(Math.random() * lateNightGreetings.length);
      return lateNightGreetings[randomIndex];
    }
  }, []);

  const formattedDate = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Burger Button - ganz links */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer ml-6"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Greeting - mit Abstand rechts vom Button */}
          <div className="pl-20">
            <h1 className="text-3xl font-bold">{greeting}</h1>
          </div>
        </div>

        {/* Date - ganz rechts */}
        <div className="text-2xl font-bold mr-32">
          Today is the {formattedDate}
        </div>
      </div>

      {/* Separator - sichtbarer */}
      <div className="h-px bg-border opacity-50 ml-6 mr-6" />
    </div>
  );
}
