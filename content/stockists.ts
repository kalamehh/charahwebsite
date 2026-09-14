/**
 * Where to buy Charah. Powers /store-locator (grouped list now; an interactive
 * map drops in once this list passes ~10 locations — see docs/rebuild-plan.md).
 *
 * lat/lng are optional today; fill them in before wiring the map.
 */

export type Stockist = {
  name: string
  type: "retail" | "restaurant" | "online"
  address: string
  city: string
  state: string
  zip: string
  region: string
  url?: string
  lat?: number
  lng?: number
  /** Exclude from the map (kept in the list). */
  mapHidden?: boolean
  /** Exact Google Maps link. If unset, a link to the coordinates is used. */
  mapUrl?: string
  /** Which products this location carries. */
  carries: ("original" | "chili-oil")[]
}

export const stockists: Stockist[] = [
  {
    name: "Kam Man Market",
    type: "retail",
    address: "200 Canal St",
    city: "New York",
    state: "NY",
    zip: "10013",
    region: "Chinatown",
    url: "http://www.kamman.com/chinatown",
    lat: 40.7168553,
    lng: -73.9983507,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=New+Kam+Man+Supermarket,+200+Canal+St,+Manhattan,+NY&query_place_id=ChIJGzxzbidawokR9vNKERzJCog",
    carries: ["original", "chili-oil"],
  },
  {
    name: "Pearl River Mart",
    type: "retail",
    address: "452 Broadway",
    city: "New York",
    state: "NY",
    zip: "10013",
    region: "SoHo",
    url: "https://www.pearlriver.com",
    lat: 40.7204665,
    lng: -74.0007941,
    mapUrl: "https://maps.app.goo.gl/4Aj8fUhZSn7Q6m6s7",
    carries: ["original", "chili-oil"],
  },
  {
    name: "Pearl River Mart Foods",
    type: "retail",
    address: "Chelsea Market, 75 9th Ave",
    city: "New York",
    state: "NY",
    zip: "10011",
    region: "Chelsea",
    url: "https://www.pearlriver.com",
    lat: 40.7420513,
    lng: -74.0048973,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Pearl+River+Mart+Foods,+75+9th+Ave,+New+York,+NY+10011",
    carries: ["original", "chili-oil"],
  },
  {
    // Corrected from "765 Fulton St" — that's the adjacent Greene Grape Wine &
    // Spirits; the grocery (Provisions) is next door at 767.
    name: "Greene Grape Provisions",
    type: "retail",
    address: "767 Fulton St",
    city: "Brooklyn",
    state: "NY",
    zip: "11217",
    region: "Fort Greene",
    url: "https://greenegrape.com",
    lat: 40.686288,
    lng: -73.973961,
    mapUrl:
      "https://www.google.com/maps/place/Greene+Grape+Provisions/@40.686288,-73.9765359,17z/data=!3m1!4b1!4m6!3m5!1s0x89c25bb04dab08cb:0x8ff8888948cef724!8m2!3d40.686288!4d-73.973961!16s/g/1tczftwg",
    carries: ["original"],
  },
  {
    name: "Myrtle Wombat",
    type: "retail",
    address: "581 Myrtle Ave",
    city: "Brooklyn",
    state: "NY",
    zip: "11205",
    region: "Fort Greene",
    url: "https://myrtlewombat.com",
    lat: 40.6941892,
    lng: -73.9608979,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Myrtle+Wombat,+581+Myrtle+Ave,+Brooklyn,+NY+11205",
    carries: ["original", "chili-oil"],
  },
  {
    // Corrected from "460 Main St, Beacon" — the shop is actually in Cold
    // Spring, not Beacon.
    name: "Marbled Meat Shop",
    type: "retail",
    address: "3091 US-9, Ste 101",
    city: "Cold Spring",
    state: "NY",
    zip: "10516",
    region: "Hudson Valley",
    url: "https://marbledmeatshop.com",
    lat: 41.420094,
    lng: -73.954583,
    mapUrl: "https://www.google.com/maps?cid=18440461032392624536",
    mapHidden: true,
    carries: ["original"],
  },
]

/** Stockists grouped by region, for the list view. */
export function stockistsByRegion(): { region: string; items: Stockist[] }[] {
  const map = new Map<string, Stockist[]>()
  for (const s of stockists) {
    const list = map.get(s.region) ?? []
    list.push(s)
    map.set(s.region, list)
  }
  return [...map.entries()].map(([region, items]) => ({ region, items }))
}

/**
 * Google Maps link for a stockist — what the store-locator list links out to.
 * Prefers an exact `mapUrl`; otherwise links to the coordinates, which always
 * resolves to a single point (no ambiguous results list).
 */
export function googleMapsUrl(s: Stockist): string {
  if (s.mapUrl) return s.mapUrl
  if (s.lat != null && s.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`
  }
  const query = `${s.name}, ${s.address}, ${s.city}, ${s.state} ${s.zip}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
