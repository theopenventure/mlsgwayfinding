export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

const categoryColors = {
  'enquiry-support': '#3B82F6',
  'therapy-counselling': '#10B981',
  'medical-advice': '#F59E0B',
}

const categoryLabels = {
  'enquiry-support': 'Enquiry & Support',
  'therapy-counselling': 'Therapy & Counselling',
  'medical-advice': 'Medical Advice',
}

const categoryTailwind = {
  'enquiry-support': 'bg-cat-enquiry',
  'therapy-counselling': 'bg-cat-therapy',
  'medical-advice': 'bg-cat-medical',
}

export function getCategoryColor(category) {
  return categoryColors[category] || '#777777'
}

export function getCategoryLabel(category) {
  return categoryLabels[category] || category
}

export function getCategoryTailwind(category) {
  return categoryTailwind[category] || 'bg-gray-400'
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
