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
    {/* Card Border */}
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />

    {/* J Letter */}
    <path d="M10 7 L10 13 Q10 15 12 15 Q14 15 14 13" />

    {/* Small decorative stars/diamonds */}
    <path d="M8 18 L9 19 L8 20 L7 19 Z" />
    <path d="M16 18 L17 19 L16 20 L15 19 Z" />
  </svg>
);
