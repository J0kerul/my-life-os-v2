import { ALL_DOMAINS, DOMAIN_COLORS, DOMAIN_ICONS } from "@/constants";

type DomainStat = {
  domain: string;
  count: number;
};

type StatsPanelProps = {
  stats: DomainStat[];
};

export function StatsPanel({ stats }: StatsPanelProps) {
  // Create a map for quick lookup
  const statsMap = new Map(stats.map((s) => [s.domain, s.count]));

  // Get all domains with their counts (0 if not in stats)
  const allDomainStats = ALL_DOMAINS.map((domain) => ({
    domain,
    count: statsMap.get(domain) || 0,
  }));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Domain Stats</h2>

      {/* Grid: 2 rows */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        {/* First Row: 5 Domains */}
        {allDomainStats.slice(0, 5).map((stat) => {
          const color = DOMAIN_COLORS[stat.domain];
          const Icon = DOMAIN_ICONS[stat.domain];

          return (
            <div key={stat.domain} className="flex flex-col items-center gap-2">
              {/* Outline circle with colored icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: color }}
              >
                <Icon className="w-6 h-6" style={{ color: color }} />
              </div>

              {/* Count below - colored */}
              <span className="text-sm font-bold" style={{ color: color }}>
                {stat.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Second Row: 6 Domains */}
      <div className="grid grid-cols-6 gap-3">
        {allDomainStats.slice(5, 11).map((stat) => {
          const color = DOMAIN_COLORS[stat.domain];
          const Icon = DOMAIN_ICONS[stat.domain];

          return (
            <div key={stat.domain} className="flex flex-col items-center gap-2">
              {/* Outline circle with colored icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: color }}
              >
                <Icon className="w-6 h-6" style={{ color: color }} />
              </div>

              {/* Count below - colored */}
              <span className="text-sm font-bold" style={{ color: color }}>
                {stat.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
