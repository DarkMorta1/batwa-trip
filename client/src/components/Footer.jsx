import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { contactMethods, socialLinks } from '../constants/contact'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const popularTreks = [
  'Annapurna Base Camp & Circuit',
  'Bhairav Kunda Sacred Alpine Lake',
  'Ama Yangri Peak & Helambu Ridge',
  'Langtang Valley & Gosaikunda',
  'Everest High Passes Expedition',
]

export default function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/website-settings`)
      .then(response => response.ok ? response.json() : null)
      .then(data => data && setSettings(data))
      .catch(() => {})
  }, [])

  const configuredContact = [
    { ...contactMethods[0], value: settings?.contactPhone || contactMethods[0].value, href: settings?.contactPhone ? `tel:${settings.contactPhone.replace(/\s+/g, '')}` : contactMethods[0].href },
    { ...contactMethods[1], value: settings?.contactEmail || contactMethods[1].value, href: settings?.contactEmail ? `mailto:${settings.contactEmail}` : contactMethods[1].href },
    { ...contactMethods[2], value: settings?.address || contactMethods[2].value, href: settings?.googleMapsUrl || contactMethods[2].href },
    contactMethods[3]
  ]

  const configuredSocials = socialLinks.map(social => {
    const configuredUrl = settings?.socialLinks?.[social.name.toLowerCase()]
    if (configuredUrl) return { ...social, url: configuredUrl }
    if (social.name === 'WhatsApp' && settings?.whatsappNumber) {
      return { ...social, url: `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}` }
    }
    return social
  })

  const supportContact = configuredContact.slice(0, 3)

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <h2>Batuwa Trip</h2>
          <p>
            Pioneering domestic exploration and Himalayan wilderness across Nepal. From legendary alpine
            passes to untouched cultural trails, we craft safe, memorable, and respectful eco-adventures.
          </p>
          <div className="site-footer__socials">
            {configuredSocials.map(social => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                <img src={social.icon} alt="" />
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__column site-footer__links">
          <h3>Popular Himalayan Treks</h3>
          <ul className="site-footer__list">
            {popularTreks.map((trek) => (
              <li key={trek}>
                <Link to="/trips/all">{trek}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__column site-footer__contact">
          <h3>Support &amp; Hub</h3>
          <div className="site-footer__contact-list">
            {supportContact.map(method => (
              <div key={method.label} className="site-footer__contact-row">
                <span className="site-footer__contact-icon" aria-hidden>{method.icon}</span>
                <span className="site-footer__contact-copy">
                  <strong>{method.label}</strong>
                  <span>{method.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer__column site-footer__newsletter-wrap">
  <h3>Suggestions For Us?</h3>

  <div className="site-footer__newsletter-box">
    <span className="site-footer__newsletter-label">
      Your feedback helps us improve! Feel free to share your thoughts and ideas.
    </span>

    <a
      className="site-footer__newsletter"
      href="mailto:batuwatrip@gmail.com"
      aria-label="Contact us by email"
    >
      Contact Us
    </a>
  </div>
</div>
      </div>

      <div className="site-footer__bottom">© {new Date().getFullYear()} Batuwa Trip Pvt. Ltd. Promoting Domestic Tourism &amp; Himalayan Trails in Nepal. All rights reserved.</div>
    </footer>
  )
}