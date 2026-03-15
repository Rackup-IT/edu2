interface LogoProps {
  light?: boolean;
  url?: string;
  companyName?: string;
}

export default function Logo({ light = false, url, companyName }: LogoProps) {
  const textColor = light ? "text-white" : "text-black";
  const borderColor = light ? "border-white/20" : "border-black";
  const iconColor = light ? "text-white" : "text-black";

  return (
    <div className="flex items-center">
      <div className="w-[256px] h-[42px] relative flex items-center justify-start bg-transparent">
        {url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url}
            alt="Logo"
            className="w-full h-full object-contain object-left"
          />
        ) : (
          /* Plant/Grass Icon fallback */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-full h-full max-w-[48px] ${iconColor}`}
          >
            <path d="M12 20V10" />
            <path d="M12 20C12 20 7 18 7 12C7 9 9 7 12 7" />
            <path d="M12 20C12 20 17 18 17 12C17 9 15 7 12 7" />
            <path d="M8 20L12 16" />
            <path d="M16 20L12 16" />
          </svg>
        )}
      </div>
    </div>
  );
}
