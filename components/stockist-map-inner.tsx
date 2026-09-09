"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import type { Stockist } from "@/content/stockists"

// Brand-red pin, drawn inline so we don't depend on Leaflet's default marker
// images (which don't resolve correctly through Next's bundler).
const pinIcon = L.divIcon({
  className: "charah-map-pin",
  html: `<svg width="28" height="38" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#F43711"/>
    <circle cx="15" cy="15" r="6" fill="#FBF6EF"/>
  </svg>`,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -34],
})

/** Fits the map to every marker on first render (or when the point set changes). */
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 13)
      return
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 13 })
  }, [map, points])
  return null
}

export function StockistMapInner({ stockists }: { stockists: Stockist[] }) {
  const located = useMemo(
    () =>
      stockists.filter(
        (s): s is Stockist & { lat: number; lng: number } =>
          !s.mapHidden && s.lat != null && s.lng != null,
      ),
    [stockists],
  )
  const points = useMemo<[number, number][]>(() => located.map((s) => [s.lat, s.lng]), [located])

  if (located.length === 0) return null

  return (
    <MapContainer
      center={points[0]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {located.map((s) => (
        <Marker key={s.name} position={[s.lat, s.lng]} icon={pinIcon}>
          <Popup>
            <p className="font-semibold text-charah-ink">{s.name}</p>
            <p className="text-charah-stone">
              {s.address}, {s.city}, {s.state} {s.zip}
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
