import Image from "next/image";
import Link from "next/link";

type Props = {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  showMark?: boolean;
};

export function Wordmark({
  tone = "dark",
  size = "md",
  asLink = true,
  showMark = true,
}: Props) {
  const dark = tone === "dark";
  const sizes = {
    sm: {
      primary: "text-2xl",
      secondary: "text-[0.58rem]",
      mark: "size-10",
      markPx: 40,
    },
    md: {
      primary: "text-3xl",
      secondary: "text-[0.66rem]",
      mark: "size-12",
      markPx: 48,
    },
    lg: {
      primary: "text-5xl",
      secondary: "text-sm",
      mark: "size-16",
      markPx: 64,
    },
  }[size];

  const inner = (
    <span className="inline-flex items-center gap-3 leading-none">
      {showMark && (
        <span
          className={`relative shrink-0 overflow-hidden rounded-full ring-1 ${
            dark
              ? "ring-[var(--acai)]/20 shadow-[0_8px_18px_-12px_rgba(31,11,37,0.55)]"
              : "ring-[var(--cream)]/25"
          } ${sizes.mark}`}
        >
          <Image
            src="/images/enhanced/brand-mascot-medallion.jpg"
            alt=""
            aria-hidden
            width={sizes.markPx}
            height={sizes.markPx}
            className="h-full w-full object-cover"
          />
        </span>
      )}
      <span className="inline-flex flex-col items-start">
        <span
          className={`brand-bubble-text ${sizes.primary} ${
            dark ? "text-[var(--acai)]" : "text-[var(--cream)]"
          }`}
        >
          Nabil&rsquo;s
        </span>
        <span
          className={`brand-mini-text mt-0.5 uppercase ${sizes.secondary} ${
            dark ? "text-[var(--acai-deep)]" : "text-[var(--lavender)]"
          }`}
        >
          Açaí&nbsp;Station
        </span>
      </span>
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link href="/" aria-label="Nabil's Açaí Station home" className="group">
      {inner}
    </Link>
  );
}
