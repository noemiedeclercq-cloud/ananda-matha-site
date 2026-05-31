import Image from "next/image";
import type { HomePhotoBand } from "@/lib/types";

const heightClasses = {
  medium: "h-[18rem] md:h-[24rem]",
  large: "h-[24rem] md:h-[34rem]",
  xlarge: "h-[30rem] md:h-[44rem]"
};

export function PhotoBands({ bands }: { bands?: HomePhotoBand[] }) {
  if (!bands?.length) return null;

  return (
    <>
      {bands.map((band, index) =>
        band.image ? (
          <figure
            key={`${band.image}-${index}`}
            className={`relative my-10 w-full overflow-hidden ${heightClasses[band.height || "medium"]}`}
          >
            <Image
              src={band.image}
              alt={band.alt || ""}
              fill
              sizes="100vw"
              className="object-cover"
            />
            {band.overlay ? <div className="absolute inset-0 bg-forest/35" /> : null}
            {band.caption ? (
              <figcaption className="absolute bottom-5 left-1/2 max-w-[90vw] -translate-x-1/2 rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-forest shadow-sm">
                {band.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null
      )}
    </>
  );
}
