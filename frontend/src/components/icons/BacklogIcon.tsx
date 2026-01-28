export const BacklogIcon = ({
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
    {/* Stack of cards/tasks */}
    <rect x="3" y="11" width="18" height="9" rx="2" />
    <rect x="5" y="7" width="14" height="4" rx="1" opacity="0.6" />
    <rect x="7" y="3" width="10" height="4" rx="1" opacity="0.3" />

    {/* Horizontal lines on main card */}
    <line x1="7" y1="14" x2="17" y2="14" />
    <line x1="7" y1="17" x2="14" y2="17" />
  </svg>
);
