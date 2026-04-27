// Singapore postal sector lookup table
// First 2 digits of a 6-digit postal code indicate the sector
// Each entry maps sector prefixes to a planning area centroid

export const postalAreas = [
  { label: "Raffles Place, Cecil, Marina, People's Park", prefixes: ["01", "02", "03", "04", "05", "06"], lat: 1.2840, lng: 103.8510 },
  { label: "Anson, Tanjong Pagar", prefixes: ["07", "08"], lat: 1.2750, lng: 103.8430 },
  { label: "Telok Blangah, Harbourfront", prefixes: ["09", "10"], lat: 1.2710, lng: 103.8200 },
  { label: "Pasir Panjang, Hong Leong Garden, Clementi New Town", prefixes: ["11", "12", "13"], lat: 1.3100, lng: 103.7650 },
  { label: "Queenstown, Tiong Bahru", prefixes: ["14", "15", "16"], lat: 1.2900, lng: 103.8050 },
  { label: "High Street, Beach Road", prefixes: ["17"], lat: 1.2960, lng: 103.8540 },
  { label: "Middle Road, Golden Mile", prefixes: ["18", "19"], lat: 1.3020, lng: 103.8600 },
  { label: "Little India", prefixes: ["20", "21"], lat: 1.3070, lng: 103.8520 },
  { label: "Orchard, Cairnhill, River Valley", prefixes: ["22", "23"], lat: 1.3040, lng: 103.8320 },
  { label: "Ardmore, Bukit Timah, Holland Road, Tanglin", prefixes: ["24", "25", "26", "27"], lat: 1.3100, lng: 103.8150 },
  { label: "Watten Estate, Novena, Thomson", prefixes: ["28", "29", "30"], lat: 1.3250, lng: 103.8380 },
  { label: "Balestier, Toa Payoh, Serangoon", prefixes: ["31", "32", "33"], lat: 1.3350, lng: 103.8500 },
  { label: "Macpherson, Braddell", prefixes: ["34", "35", "36", "37"], lat: 1.3400, lng: 103.8650 },
  { label: "Geylang, Eunos", prefixes: ["38", "39", "40", "41"], lat: 1.3200, lng: 103.8900 },
  { label: "Katong, Joo Chiat, Amber Road", prefixes: ["42", "43", "44", "45"], lat: 1.3050, lng: 103.9050 },
  { label: "Bedok, Upper East Coast, Eastwood, Kew Drive", prefixes: ["46", "47", "48"], lat: 1.3270, lng: 103.9300 },
  { label: "Loyang, Changi", prefixes: ["49", "50", "81"], lat: 1.3560, lng: 103.9750 },
  { label: "Pasir Ris, Tampines", prefixes: ["51", "52"], lat: 1.3520, lng: 103.9550 },
  { label: "Serangoon Garden, Hougang, Punggol", prefixes: ["53", "54", "55", "82"], lat: 1.3750, lng: 103.8900 },
  { label: "Bishan, Ang Mo Kio", prefixes: ["56", "57"], lat: 1.3600, lng: 103.8470 },
  { label: "Upper Bukit Timah, Clementi Park, Ulu Pandan", prefixes: ["58", "59"], lat: 1.3350, lng: 103.7750 },
  { label: "Jurong, Bukit Batok", prefixes: ["60", "61", "62", "63", "64"], lat: 1.3450, lng: 103.7450 },
  { label: "Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang", prefixes: ["65", "66", "67", "68"], lat: 1.3780, lng: 103.7650 },
  { label: "Lim Chu Kang, Tengah", prefixes: ["69", "70", "71"], lat: 1.3900, lng: 103.7200 },
  { label: "Kranji, Woodgrove, Woodlands", prefixes: ["72", "73"], lat: 1.4380, lng: 103.7890 },
  { label: "Yishun, Sembawang", prefixes: ["75", "76"], lat: 1.4180, lng: 103.8200 },
  { label: "Upper Thomson, Springleaf", prefixes: ["77", "78"], lat: 1.3900, lng: 103.8300 },
  { label: "Sengkang, Seletar", prefixes: ["79", "80"], lat: 1.3925, lng: 103.8950 },
]

/**
 * Resolve a 6-digit Singapore postal code to coordinates.
 * Returns { lat, lng, label } or null if invalid/unrecognized.
 */
export function resolvePostalCode(postal) {
  if (!/^\d{6}$/.test(postal)) return null
  const prefix = postal.slice(0, 2)
  const area = postalAreas.find(a => a.prefixes.includes(prefix))
  if (!area) return null
  return { lat: area.lat, lng: area.lng, label: area.label }
}
