import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TravelCard from '../components/TravelCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function TripsPage(){
  const { section } = useParams()
  const nav = useNavigate()
  const [tours, setTours] = useState([])
  const [query, setQuery] = useState('')

  useEffect(()=>{
    window.scrollTo(0,0)
    fetch(`${API}/api/display-settings/tours`)
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json() })
      .then(data => setTours(data.map(d => ({ ...d, id: d.id || d._id }))))
      .catch(err => { console.error('Failed to load tours for TripsPage', err); setTours([]) })
  }, [section])

  const sectionFiltered = tours.filter(t => {
    if(section === 'upcoming') return t.upcoming && t.status === 'published'
    if(section === 'available' || section === 'trending') return t.trending && t.status === 'published'
    return t.status === 'published'
  })

  const q = query.trim().toLowerCase()
  const filtered = q === '' ? sectionFiltered : sectionFiltered.filter(t => {
    const parts = []
    if(t.title) parts.push(t.title)
    if(t.location) parts.push(t.location)
    if(t.desc) parts.push(t.desc)
    if(t.details && Array.isArray(t.details.highlights)) parts.push(t.details.highlights.join(' '))
    if(Array.isArray(t.itinerary)) parts.push(t.itinerary.map(d => `${d.title || ''} ${d.description || ''}`).join(' '))
    const hay = parts.join(' ').toLowerCase()
    return hay.includes(q)
  })

  const title = section === 'upcoming' ? 'Upcoming Trips' : (section === 'available' ? 'Available Trips' : 'Trips')

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <button className="back" onClick={() => nav(-1)} style={{
          background: '#3f51b5', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color:'#fff'
        }}>←</button>
      </div>

      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div className="search-bar" style={{ margin: '12px 0 20px' }}>
        <input
          className="search-bar__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search trips by name, location or keyword"
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
          No trips match your search.
        </div>
      ) : (
        <div className="grid grid--cards">
          {filtered.map(tour => (
            <TravelCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  )
}
