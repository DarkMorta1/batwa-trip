export const WHATSAPP_NUMBER = '9779801113350'

export function buildWhatsAppLink(message = 'Hi, I would like to customize a trip.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

