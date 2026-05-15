import { useState, useEffect } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import type { Ship } from '../../lib/schema'

const WIKI_API = 'https://star-citizen.wiki/api.php'

async function fetchShipImage(model: string): Promise<string | null> {
  const normalized = model.replace(/\s+/g, '_')
  const url = `${WIKI_API}?action=query&titles=${encodeURIComponent(normalized)}&prop=pageimages&format=json&pithumbsize=320&origin=*`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const json = (await res.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source: string } }> }
    }
    const pages = json.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0]
    return page?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

interface ShipCardProps {
  ship: Ship
  onClick: () => void
}

export function ShipCard({ ship, onClick }: ShipCardProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchShipImage(ship.model).then((src) => {
      if (!cancelled) setImgSrc(src)
    })
    return () => { cancelled = true }
  }, [ship.model])

  return (
    <article
      className="bg-bg-panel border border-border-subtle hover:border-border-active transition-colors cursor-pointer active:bg-bg-elevated"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-bg-void overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={ship.model}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-aldrich text-xs text-text-disabled tracking-widest uppercase">
              {ship.manufacturer}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={ship.status} />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="font-aldrich text-sm text-text-primary tracking-wide leading-tight">
          {ship.name}
        </h3>
        <p className="text-xs font-inter text-text-secondary">
          {ship.model} &middot; {ship.manufacturer}
        </p>

        {ship.location && (
          <p className="text-xs font-inter text-text-secondary flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{ship.location}</span>
          </p>
        )}

        {ship.buildLink && (
          <a
            href={ship.buildLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:text-accent-glow mt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={11} />
            {ship.buildSiteName ?? 'Build'}
          </a>
        )}
      </div>
    </article>
  )
}
