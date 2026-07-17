import { useMemo, useState } from "react";
import { driveUrlFallbackChain } from "../lib/driveImage";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/** Review photos from Google Drive need thumbnail URLs + fallbacks to show on the live site. */
export default function ReviewPhoto({ src, alt, className }: Props) {
  const chain = useMemo(() => driveUrlFallbackChain(src), [src]);
  const [index, setIndex] = useState(0);

  return (
    <img
      src={chain[index]}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={() => {
        setIndex((i) => (i + 1 < chain.length ? i + 1 : i));
      }}
    />
  );
}
