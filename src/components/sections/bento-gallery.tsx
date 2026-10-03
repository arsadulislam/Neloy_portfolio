"use client"

import { useRef } from "react"
import Image from "next/image"
import { useIsMobile, useAutoHighlight } from "@/hooks/use-mobile-view-effect"

export interface PhotoDetails {
  type: "portrait" | "landscape" | "square"
  id: string
  src: string
  alt: string
  caption: string
}

// Photo Pool
const ALL_PHOTOS: PhotoDetails[] = [
  { type: "portrait", id: "p1", src: "/photos/Viraj Mavani Western University.jpg", alt: "Viraj Mavani Western University", caption: "sys.admin // viraj" },
  { type: "portrait", id: "p2", src: "/photos/Viraj Mavani.jpg", alt: "Viraj Mavani", caption: "sys.admin // viraj" },
  { type: "portrait", id: "p3", src: "/photos/Viraj Mavani Suit.jpg", alt: "Viraj Mavani", caption: "sys.admin // viraj" },
  { type: "portrait", id: "p4", src: "/photos/Viraj Mavani Monochorme.jpg", alt: "Viraj Mavani", caption: "sys.admin // viraj" },
  { type: "landscape", id: "p1", src: "/photos/middlesex.jpg", alt: "University", caption: "University.config" },
  { type: "landscape", id: "p2", src: "/photos/Viraj Mavani Niagara Falls.jpg", alt: "Hobbies", caption: "offline_status" },
  { type: "square", id: "p1", src: "/photos/Viraj Mavani.jpeg", alt: "Hobbies", caption: "offline_status" },
  // { id: "p2", src: "/photos/setup.jpg", alt: "Desk Setup", caption: "workspace.config" },
  // { id: "p3", src: "/photos/event.jpg", alt: "Tech Event", caption: "networking_mode: active" },
  // { id: "p4", src: "/photos/extra.jpg", alt: "Extra Shot", caption: "compiling..." },
]

function getPhoto(type: PhotoDetails["type"], id?: string) {
  return ALL_PHOTOS.find((photo) => photo.type === type && (!id || photo.id === id))
}

export function BentoGallery() {
  const portraitPhoto = getPhoto("portrait")
  const portraitPhoto_m = getPhoto("portrait", "p2")
  const landscapePhoto = getPhoto("landscape")
  const squarePhoto = getPhoto("square")
  const isMobile = useIsMobile()

  if (!portraitPhoto || !landscapePhoto || !squarePhoto) return null

  return (
    <section className="mb-12 w-4/5 mx-auto md:w-3/5 lg:w-4/5">
      {/* Layout: 
        Mobile: 1 column (vertical stack) - Only Portrait
        Desktop: Flex row. Left item stretches to match height of right column.
      */}
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:h-[300px] lg:h-auto">
        
        {/* Photo 1: Large Left (Portrait/Primary) */}
        <PhotoCard 
          photo={portraitPhoto} 
          mobilePhoto={portraitPhoto_m}
          className="min-h-[350px] max-w-sm mx-auto md:max-w-none w-full md:w-3/5 md:min-h-0"
          isMobile={isMobile}
          priority
        />

        {/* Right Column - Hidden on mobile */}
        <div className="hidden w-full flex-col gap-4 md:flex md:w-2/5">
          
          {/* Photo 2: Top Right (Landscape) */}
          <PhotoCard 
            photo={landscapePhoto}
            className="min-h-[100px] max-h-[120px] lg:min-h-[170px] lg:max-h-[190px] w-full"
            isMobile={isMobile}
          />

          {/* Photo 3: Bottom Right (Square) */}
          <PhotoCard 
            photo={squarePhoto}
            className="aspect-square w-full"
            isMobile={isMobile}
          />

        </div>

      </div>
    </section>
  )
}

function PhotoCard({ 
  photo, 
  mobilePhoto, 
  className, 
  isMobile,
  priority = false 
}: { 
  photo: PhotoDetails, 
  mobilePhoto?: PhotoDetails, 
  className?: string, 
  isMobile: boolean,
  priority?: boolean 
}) {
  const ref = useRef(null)
  const isActive = useAutoHighlight(ref, isMobile)

  return (
    <div 
      ref={ref}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card ${className}`}
    >
      {/* Mobile Image (Optional override) */}
      {mobilePhoto && (
        <Image
          src={mobilePhoto.src}
          alt={mobilePhoto.alt}
          fill
          className={`object-cover transition-transform duration-700 ease-out lg:group-hover:scale-105 md:hidden ${isActive ? "scale-105" : ""}`}
          sizes="(max-width: 768px) 100vw, 1px"
          priority={priority}
        />
      )}
      
      {/* Default/Desktop Image */}
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className={`${mobilePhoto ? "hidden md:block" : ""} object-cover transition-transform duration-700 ease-out lg:group-hover:scale-105 ${isActive ? "scale-105" : ""}`}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />

      <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 lg:group-hover:opacity-100 ${isActive ? "opacity-100" : "opacity-0"}`} />
      
      {photo.caption && (
        <div className={`absolute bottom-6 left-6 transition-all duration-500 ease-out lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          <p className="font-mono text-xs lg:text-sm font-medium text-white/90">
            <span className="text-primary">{"> "}</span>
            {photo.caption}
          </p>
        </div>
      )}
    </div>
  )
}