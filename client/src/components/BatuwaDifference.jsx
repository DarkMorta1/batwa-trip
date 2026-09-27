import React from 'react'

const features = [
  {
    title: 'Local Sherpa Guides',
    text: 'Trails guided exclusively by seasoned local mountaineers certified in high-altitude medicine, wilderness rescue, and regional folklore.',
    icon: 'shield'
  },
  {
    title: 'Uncrowded Trails',
    text: 'We bypass overcrowded tourist bottlenecks to reveal raw ridgelines, sacred pilgrimage tarns, and welcoming homestay communities.',
    icon: 'trail'
  },
  {
    title: 'Fair & Transparent',
    text: 'Zero hidden charges. Direct bookings guarantee fair porter wages, eco-trail conservation contributions, and genuine local pricing.',
    icon: 'fair'
  },
  {
    title: 'Hassle-Free Logistics',
    text: 'From 4WD off-road mountain jeeps to alpine tents, park permits, and warm home-cooked meals, every step is carefully curated.',
    icon: 'logistics'
  }
]

const stats = [
  { value: '4.4', tone: 'pink' },
  { value: '1.8K', tone: 'dark' },
  { value: '100%', tone: 'mid' }
]

function FeatureIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  switch (name) {
    case 'shield':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3l7 3v5c0 4.5-2.8 8.7-7 10-4.2-1.3-7-5.5-7-10V6l7-3z" />
          <path d="M9.5 12.5l1.5 1.5 3.5-4" />
        </svg>
      )
    case 'trail':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 19c2.5-2.5 4.5-3.7 6.5-3.7 2.5 0 3.5 1.7 4.5 3.7" />
          <path d="M7 16.5V7.5l6-3 5 2.5v7" />
          <path d="M13 8h3.5" />
          <path d="M11 13h4" />
        </svg>
      )
    case 'fair':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 8.5h16" />
          <path d="M7 8.5V5.8A1.8 1.8 0 0 1 8.8 4h6.4A1.8 1.8 0 0 1 17 5.8v2.7" />
          <path d="M6.5 8.5v8.7h11V8.5" />
          <path d="M10 12.5h4" />
        </svg>
      )
    case 'logistics':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 9.5h11v7H3z" />
          <path d="M14 12h3l2.5 2.3V16.5H14z" />
          <circle cx="7.5" cy="17.5" r="1.8" />
          <circle cx="17.8" cy="17.5" r="1.8" />
        </svg>
      )
    default:
      return null
  }
}

export default function BatuwaDifference() {
  return (
    <section className="batuwa-difference">
      <div className="batuwa-difference__header">
        <div className="batuwa-difference__copy-wrap">
          <p className="batuwa-difference__eyebrow">THE BATUWA DIFFERENCE</p>
          <h2 className="batuwa-difference__title">Why Adventurers Choose Batuwa Trip</h2>
          <p className="batuwa-difference__subtitle">
            We prioritize safe trail leadership, direct community empowerment, and zero-headache logistics across every corner of Nepal.
          </p>
        </div>

        <div className="batuwa-difference__stats" aria-label="Customer satisfaction and safety stats">
          <div className="batuwa-difference__stat-stack" aria-hidden="true">
            {stats.map((stat) => (
              <span key={stat.value} className={`batuwa-difference__bubble batuwa-difference__bubble--${stat.tone}`}>
                {stat.value}
              </span>
            ))}
          </div>
          <span className="batuwa-difference__stats-text">Verified traveler feedback &amp; domestic summit safety record</span>
        </div>
      </div>

      <div className="batuwa-difference__grid">
        {features.map((feature) => (
          <article key={feature.title} className="batuwa-difference__card">
            <div className="batuwa-difference__icon-wrap" aria-hidden="true">
              <FeatureIcon name={feature.icon} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
