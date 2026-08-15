import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/lib/brandAssets";

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
  const sizeClass = {
    sm: "h-12",
    md: "h-[3.75rem]",
    lg: "h-24",
  }[size];
  const isDarkBackgroundLockup = showMark && tone === "light";
  const intrinsicSize = !showMark
    ? { width: 512, height: 512 }
    : isDarkBackgroundLockup
      ? { width: 1077, height: 1600 }
      : { width: 1268, height: 510 };

  const image = (
    <Image
      src={
        showMark
          ? isDarkBackgroundLockup
            ? brandAssets.darkBackgroundLogo
            : brandAssets.horizontalLogo
          : brandAssets.faviconWebp
      }
      alt=""
      width={intrinsicSize.width}
      height={intrinsicSize.height}
      className={`${sizeClass} w-auto object-contain`}
    />
  );

  if (!asLink) return image;

  return (
    <Link href="/" aria-label="Nabil's Açaí Station home" className="inline-flex">
      {image}
    </Link>
  );
}
