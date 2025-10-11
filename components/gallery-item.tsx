"use client";

import { motion } from "motion/react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { Position, SearchResult } from "@/lib/types";

interface GalleryItemProps {
  image: SearchResult;
  index: number;
  isLoaded: boolean;
  isHovered: boolean;
  onLoad: () => void;
  onHover: (hovered: boolean) => void;
  isActive: boolean;
  position?: Position;
}

export function GalleryItem({
  image,
  index,
  isLoaded,
  isHovered,
  onLoad,
  onHover,
  isActive,
  position,
}: GalleryItemProps) {
  const isMobile = useIsMobile();
  const imageUrl = image.metadata.image_url ?? "";
  const dialogTitle = image.metadata.title ?? "Artwork";
  const displayTitle = image.metadata.title ?? "Untitled";

  const imageContent = (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{
        layout: { duration: 0.8, ease: "easeInOut" },
        opacity: { delay: isLoaded ? index * 0.05 : 0, duration: 0.5 },
      }}
      className={isActive ? "relative aspect-square" : "absolute"}
      style={
        !isActive && position
          ? {
              left: position.x,
              top: position.y,
              width: position.size,
              height: position.size,
            }
          : undefined
      }
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="w-full h-full rounded-md overflow-hidden p-0 border cursor-pointer">
        {/* biome-ignore lint/performance/noImgElement: Next.js Image cannot easily support the randomly sized scatter layout without layout shift. */}
        <img
          src={imageUrl}
          alt={dialogTitle}
          className="w-full h-full object-cover"
          onLoad={onLoad}
          loading="lazy"
        />
      </div>

      <ProgressiveBlur
        direction="bottom"
        blurLayers={8}
        blurIntensity={0.5}
        className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full rounded-md"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background/80 via-background/60 to-transparent rounded-b-md"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex flex-col items-start gap-0 px-4 py-3 text-xs">
          <p className="text-sm font-medium truncate w-full">{displayTitle}</p>
          {image.metadata.artist && (
            <span className="truncate w-full mb-0.5">{image.metadata.artist}</span>
          )}
          {image.metadata.date && <span className="text-muted-foreground">{image.metadata.date}</span>}
        </div>
      </motion.div>
    </motion.div>
  );

  // On mobile, render without dialog
  if (isMobile) {
    return imageContent;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{imageContent}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="p-0 border-0 w-auto h-auto max-w-[95vw] sm:max-w-[90vw] max-h-[90vh] sm:max-h-[90vh] overflow-auto bg-transparent place-items-center"
      >
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
        <Image
          src={imageUrl}
          alt={dialogTitle}
          width={1200}
          height={1200}
          className="rounded-lg max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain"
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
}
