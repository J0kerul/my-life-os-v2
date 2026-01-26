export const JokerIcon = ({
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
    <g transform="rotate(-15 12 12)">
      {/* Card Border */}
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />

      {/* J Letter */}
      <path d="M10 7 L10 13 Q10 15 12 15 Q14 15 14 13" />

      {/* Decorative diamonds in all 4 corners - weiter nach innen */}

      {/* Top-left */}
      <path d="M7 5 L8 6 L7 7 L6 6 Z" />

      {/* Top-right */}
      <path d="M17 5 L18 6 L17 7 L16 6 Z" />

      {/* Bottom-left */}
      <path d="M7 17 L8 18 L7 19 L6 18 Z" />

      {/* Bottom-right */}
      <path d="M17 17 L18 18 L17 19 L16 18 Z" />
    </g>
  </svg>
);
