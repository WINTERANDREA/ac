import { useTranslations } from "next-intl";

interface FlagIconProps {
  locale: "it" | "en";
  size?: number;
  className?: string;
}

export default function FlagIcon({
  locale,
  size = 24,
  className = "",
}: FlagIconProps) {
  const t = useTranslations("languageSelector");

  if (locale === "it") {
    return (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 18'
        className={className}
        aria-label={t("italian")}
        role='img'
      >
        <rect width='8' height='18' fill='#009246' />
        <rect x='8' width='8' height='18' fill='#FFFFFF' />
        <rect x='16' width='8' height='18' fill='#CE2B37' />
      </svg>
    );
  }

  // Improved Union Jack (EN)
  if (locale === "en") {
    return (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 18'
        className={className}
        aria-label={t("english")}
        role='img'
      >
        <defs>
          {/* rounded corners + clip all strokes inside */}
          <clipPath id='uk-clip'>
            <rect x='0' y='0' width='24' height='18' rx='2' ry='2' />
          </clipPath>
        </defs>

        <g clipPath='url(#uk-clip)' shapeRendering='geometricPrecision'>
          {/* Navy blue field */}
          <rect width='24' height='18' fill='#012169' />

          {/* White diagonals (broad saltires) */}
          <path
            d='M0 0L24 18'
            stroke='#FFFFFF'
            strokeWidth='6'
            strokeLinecap='square'
          />
          <path
            d='M24 0L0 18'
            stroke='#FFFFFF'
            strokeWidth='6'
            strokeLinecap='square'
          />

          {/* Red diagonals (narrower) */}
          <path
            d='M0 0L24 18'
            stroke='#C8102E'
            strokeWidth='3'
            strokeLinecap='square'
          />
          <path
            d='M24 0L0 18'
            stroke='#C8102E'
            strokeWidth='3'
            strokeLinecap='square'
          />

          {/* Central white cross (broad) */}
          <rect x='0' y='6' width='24' height='6' fill='#FFFFFF' />
          <rect x='9' y='0' width='6' height='18' fill='#FFFFFF' />

          {/* Central red cross (narrow) */}
          <rect x='0' y='7.5' width='24' height='3' fill='#C8102E' />
          <rect x='10.5' y='0' width='3' height='18' fill='#C8102E' />
        </g>
      </svg>
    );
  }

  return null;
}
