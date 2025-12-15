import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Gallery from '../components/Gallery'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Tour(){
  const { id } = useParams()
  const nav = useNavigate()
  const [tour, setTour] = useState(null)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherMessage, setVoucherMessage] = useState('')
  const [priceHidden, setPriceHidden] = useState(false)

  useEffect(()=>{
    fetch(`${API}/api/tours`).then(r=>r.json()).then(data=>{
      const found = data.map(d=>({ ...d, id: d.id || d._id })).find(t => t.id === id)
      setTour(found)
    }).catch(()=>setTour(null))
  }, [id])

  async function applyVoucher(){
    setVoucherMessage('')
    if(!voucherCode) return setVoucherMessage('Enter voucher code')
    try{
      const res = await fetch(`${API}/api/vouchers/validate`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ code: voucherCode }) })
      const data = await res.json()
      if (!res.ok) return setVoucherMessage(data.message || 'Invalid voucher')
      setPriceHidden(true)
      setVoucherMessage(`Voucher applied: ${data.discountPercent || 0}% off`)
    }catch(err){
      setVoucherMessage('Error validating voucher')
    }
  }

  const scrollToContact = () => {
    if (window.location.pathname !== '/'){
      nav('/')
      setTimeout(()=>{
        const el = document.getElementById('contact')
        if(el) el.scrollIntoView({behavior:'smooth'})
      }, 200)
    } else {
      const el = document.getElementById('contact')
      if(el) el.scrollIntoView({behavior:'smooth'})
    }
  }

  if(tour === null) return <div style={{padding:40, color:'#fff'}}>Tour not found</div>

  return (
    <div className="tour-page">
      <div style={{padding:'20px'}}>
        <button className="back" onClick={() => nav('/')} style={{
          background: '#3f51b5',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#fff',
          transition: 'all 200ms'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2d3a8c'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#3f51b5'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        >←</button>
      </div>

      <div className="tour-hero" style={{backgroundImage:`url(${tour.img})`}}>
        <div className="hero-overlay">
          <h1>{tour.title}</h1>
          <p>{tour.location} • {tour.days} days</p>
        </div>
      </div>

      <div className="tour-content">
        <div className="left">
          <h2>About this tour</h2>
          <p>{tour.desc}</p>
          <h3>Itinerary</h3>
          <ul>{(tour.details?.itinerary||[]).map((it, i)=> <li key={i}>{it}</li>)}</ul>
          <h3>Gallery</h3>
          {tour.photos && <Gallery photos={tour.photos} />}
        </div>

        <aside className="right">
          <div className="box">
            <h3>Price</h3>
            {!priceHidden ? (
              <div className="price big">${tour.price}</div>
            ) : (
              <div style={{fontSize:16,fontWeight:700,color:'#2ecc71'}}>Price hidden — voucher applied</div>
            )}

            <div style={{marginTop:12,display:'flex',gap:8,alignItems:'center'}}>
              <input value={voucherCode} onChange={e=>setVoucherCode(e.target.value)} placeholder="Voucher code" style={{padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
              <button className="btn" onClick={applyVoucher}>Apply</button>
            </div>
            {voucherMessage && <div style={{marginTop:8,color:'#ffd700',fontWeight:700}}>{voucherMessage}</div>}

            <p className="muted" style={{marginTop:12}}>{tour.details?.expenses}</p>

            <button className="btn" onClick={() => window.open("https://wa.me/9779801113350?text=Hello%20I%20want%20to%20know%20more%20about%20your%20offers%20and%20pacakages", "_blank")}>Book Now</button>
          </div>
        </aside>
      </div>
    </div>
  )
}

