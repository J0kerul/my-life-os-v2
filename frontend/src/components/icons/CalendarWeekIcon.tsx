export const CalendarWeekIcon = ({
  size = 24,
  className = "",
  ...props
}: {
  size?: number;
  className?: string;
  [key: string]: any;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Calendar frame */}
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />

    {/* Number 7 in center */}
    <path d="M9 13 L15 13 L11 20" strokeWidth="2.5" />
  </svg>
);
