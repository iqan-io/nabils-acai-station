"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/*
  Nabil's own phone footage of walking into Mount Lawley, supplied 2026-08-19.
  It is the first real moving frame on this site — everything moving above it
  is generated.

  Three things about the source drive this component:

  1. It is portrait. The file carries `rotation=-90` over a 1024x576 stream, so
     it *displays* 576x1024; the rotation is baked into the encode here so no
     browser has to honour the metadata. It is a phone video and it is presented
     as one, in a phone-shaped column, rather than being cropped into a
     landscape band it was never shot for.
  2. It is 576px wide and that is the ceiling — WhatsApp already compressed it.
     The column is capped well under that so it is never upscaled.
  3. It does not loop. The clip ends inside the shop, on the counter; cutting
     from there back to the dark arcade every eight seconds reads as a glitch,
     not a loop. It plays once and holds on the last frame. Scrolling away and
     back replays it, because play() on an ended element restarts it.
*/

const POSTER = "/media/mt-lawley/arrival-poster.webp";
const CLIP = "/media/mt-lawley/arrival.mp4";

const DESCRIPTION =
  "Walking in to Nabil's Açaí Station in Mount Lawley at night — through the " +
  "front door, past the terrazzo floor and timber counter.";

export function ArrivalClip({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // `null` until the client has answered the query. The poster renders for
  // that first beat, which is also exactly what a reduced-motion visitor keeps.
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced !== false) return;
    const video = videoRef.current;
    if (!video) return;

    /*
      The page above this already ships a ~4MB scroll-scrubbed film whose frame
      budget is 16-18ms and whose scrub lag is measured in hundredths. A second
      video must never decode while that act is on screen, so this one stays at
      preload="none" and only loads when it is actually in view — and pauses
      the moment it leaves.
    */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* Autoplay refused; the poster frame stays up. Nothing is lost. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  if (reduced !== false) {
    return (
      <Image
        className={className}
        src={POSTER}
        alt={DESCRIPTION}
        width={576}
        height={1024}
        sizes="(min-width: 48rem) 20rem, 70vw"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      src={CLIP}
      poster={POSTER}
      muted
      playsInline
      preload="none"
      aria-label={DESCRIPTION}
    />
  );
}
