/**
 * Where to buy Charah. Powers /store-locator: the map plus a list grouped by area
 * (see STOCKIST_AREAS and stockistsByArea).
 */

/** Sections of the store-locator page, in display order (home area first). */
export const STOCKIST_AREAS = ["New York City", "Hudson Valley", "Connecticut", "Seattle"] as const
export type StockistArea = (typeof STOCKIST_AREAS)[number]

export type Stockist = {
  name: string
  type: "retail" | "restaurant" | "online"
  address: string
  city: string
  state: string
  zip: string
  /** Section on the store-locator page. */
  area: StockistArea
  /** Sub-section inside "New York City" only. */
  borough?: "Manhattan" | "Brooklyn"
  /** Neighbourhood or town, shown next to the name. */
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
    area: "New York City",
    borough: "Manhattan",
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
    area: "New York City",
    borough: "Manhattan",
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
    area: "New York City",
    borough: "Manhattan",
    region: "Chelsea",
    url: "https://www.pearlriver.com",
    lat: 40.7420513,
    lng: -74.0048973,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Pearl+River+Mart+Foods,+75+9th+Ave,+New+York,+NY+10011",
    carries: ["original", "chili-oil"],
  },
  {
    name: "K-Slope Marketplace",
    type: "retail",
    address: "329 9th St",
    city: "Brooklyn",
    state: "NY",
    zip: "11215",
    area: "New York City",
    borough: "Brooklyn",
    region: "Park Slope",
    url: "https://kslopemarket.com",
    lat: 40.668979,
    lng: -73.985502,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=K-Slope+Marketplace,+329+9th+St,+Brooklyn,+NY+11215",
    carries: ["original", "chili-oil"],
  },
  {
    name: "Shelsky's of Brooklyn",
    type: "retail",
    address: "141 Court St",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    area: "New York City",
    borough: "Brooklyn",
    region: "Cobble Hill",
    url: "https://shelskys.com",
    lat: 40.6893645,
    lng: -73.9922608,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Shelsky's+of+Brooklyn,+141+Court+St,+Brooklyn,+NY+11201",
    carries: ["original"],
  },
  {
    name: "Eli's Market",
    type: "retail",
    address: "1411 Third Ave",
    city: "New York",
    state: "NY",
    zip: "10028",
    area: "New York City",
    borough: "Manhattan",
    region: "Upper East Side",
    url: "https://www.elizabar.com",
    lat: 40.7750655,
    lng: -73.9564976,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Eli's+Market,+1411+Third+Ave,+New+York,+NY+10028",
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
    area: "New York City",
    borough: "Brooklyn",
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
    area: "New York City",
    borough: "Brooklyn",
    region: "Fort Greene",
    url: "https://myrtlewombat.com",
    lat: 40.6941892,
    lng: -73.9608979,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Myrtle+Wombat,+581+Myrtle+Ave,+Brooklyn,+NY+11205",
    carries: ["original", "chili-oil"],
  },
  {
    name: "The Meat Hook",
    type: "retail",
    address: "397 Graham Ave",
    city: "Brooklyn",
    state: "NY",
    zip: "11211",
    area: "New York City",
    borough: "Brooklyn",
    region: "Williamsburg",
    url: "https://www.themeathook.com",
    lat: 40.7167566,
    lng: -73.9449556,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Meat+Hook,+397+Graham+Ave,+Brooklyn,+NY+11211",
    carries: ["original"],
  },
  {
    name: "The Meat Hook",
    type: "retail",
    address: "301 Sackett St",
    city: "Brooklyn",
    state: "NY",
    zip: "11231",
    area: "New York City",
    borough: "Brooklyn",
    region: "Carroll Gardens",
    url: "https://www.themeathook.com",
    lat: 40.6830591,
    lng: -73.9952256,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Meat+Hook,+301+Sackett+St,+Brooklyn,+NY+11231",
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
    area: "Hudson Valley",
    region: "Cold Spring",
    url: "https://marbledmeatshop.com",
    lat: 41.420094,
    lng: -73.954583,
    mapUrl: "https://www.google.com/maps?cid=18440461032392624536",
    carries: ["original"],
  },
  {
    // Centerbrook is a village within the town of Essex, CT.
    name: "Cooked Marketplace & Mercantile",
    type: "retail",
    address: "5 Main St",
    city: "Centerbrook",
    state: "CT",
    zip: "06409",
    area: "Connecticut",
    region: "Centerbrook",
    url: "https://www.cookedmarketplace.com",
    lat: 41.3520216,
    lng: -72.4071998,
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Cooked+Marketplace+%26+Mercantile,+5+Main+St,+Centerbrook,+CT+06409",
    carries: ["original"],
  },
  {
    name: "Mixed Pantry",
    type: "retail",
    address: "2233 1st Ave",
    city: "Seattle",
    state: "WA",
    zip: "98121",
    area: "Seattle",
    region: "Belltown",
    url: "https://www.mixedpantry.market",
    lat: 47.6131764,
    lng: -122.3465257,
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Mixed+Pantry,+2233+1st+Ave,+Seattle,+WA+98121",
    carries: ["original"],
  },
]

/**
 * Stockists for the list view: one section per area (see STOCKIST_AREAS), each
 * split into labelled groups only where that helps -- New York City is split
 * into Manhattan and Brooklyn, every other area is a single unlabelled group.
 * Alphabetical within a group (by name, then neighbourhood, so the two
 * Meat Hook shops stay in a stable order).
 */
export function stockistsByArea(): { area: StockistArea; groups: { label?: string; items: Stockist[] }[] }[] {
  const byName = (a: Stockist, b: Stockist) => a.name.localeCompare(b.name) || a.region.localeCompare(b.region)
  const BOROUGHS = ["Manhattan", "Brooklyn"] as const
  return STOCKIST_AREAS.map((area) => {
    const inArea = stockists.filter((s) => s.area === area)
    const groups =
      area === "New York City"
        ? BOROUGHS.map((b) => ({ label: b as string | undefined, items: inArea.filter((s) => s.borough === b).sort(byName) }))
        : [{ label: undefined, items: [...inArea].sort(byName) }]
    return { area, groups: groups.filter((g) => g.items.length > 0) }
  }).filter((a) => a.groups.length > 0)
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
