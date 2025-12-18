import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import TravelCard from '../components/TravelCard'
import localTours from '../data/tours'
import localBlogs from '../data/blogs'
import { buildWhatsAppLink } from '../constants/whatsapp'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
import { useNavigate } from 'react-router-dom'

const memoryPhotos = [
  '/images/1765290625930.JPG',
  '/images/1765290625942.JPG',
  '/images/1765290625950.jpg',
  '/images/1765290625960.jpg',
  '/images/1765290625968.jpg',
  '/images/1765290625980.jpg',
]

export default function Home() {
  const [tours, setTours] = useState(localTours)
  const [blogs, setBlogs] = useState(localBlogs)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ author:'', rating:5, message:'' })
  const [reviewMessage, setReviewMessage] = useState('')
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showAllAvailable, setShowAllAvailable] = useState(false)
  useEffect(() => {
    // try fetching from backend; fallback to local data if unavailable
    fetch(`${API}/api/tours`).then(r=>r.json()).then(data=>setTours(data.map(d=>({ ...d, id: d.id || d._id })))).catch(()=>{})
    fetch(`${API}/api/blogs`).then(r=>r.json()).then(data=>setBlogs(data.map(d=>({ ...d, id: d.id || d._id })))).catch(()=>{})
    fetch(`${API}/api/reviews?approved=true`).then(r=>r.json()).then(data=>setReviews(data)).catch(()=>{})
  }, [])

  const trending = tours.filter(t => t.trending)
  const upcoming = tours.filter(t=>t.upcoming)
  const visibleUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, 3)
  const visibleAvailable = showAllAvailable ? trending : trending.slice(0, 3)
  const nav = useNavigate()
  
  return (
    <div className="home-page">
      <Banner />

      <section className="section">
        <h2 className="section__title section__title--strong">Upcoming Trips</h2>
        <div style={{margin:'8px 0 16px', textAlign:'right'}}>
          <a
            className="btn btn--pink"
            href={buildWhatsAppLink('Hi, I would like to customize a trip.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Customize a trip via WhatsApp"
          >
            Customize Trip
          </a>
        </div>
        <div className="grid grid--cards">
          {visibleUpcoming.map(t => (
            <TravelCard key={t.id} tour={t} />
          ))}
        </div>
        {upcoming.length > 3 && (
          <div style={{textAlign:'center', marginTop:16}}>
            <button className="btn" onClick={()=>setShowAllUpcoming(s => !s)}>
              {showAllUpcoming ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section__title section__title--strong">Available Trips</h2>
        <div className="grid grid--cards">
          {visibleAvailable.map(tour => (
            <TravelCard key={tour.id} tour={tour} />
          ))}
        </div>
        {trending.length > 3 && (
          <div style={{textAlign:'center', marginTop:16}}>
            <button className="btn" onClick={()=>setShowAllAvailable(s => !s)}>
              {showAllAvailable ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </section>


      <section className="section section--tight">
        <div className="section__heading">
          <div>
            <h2 className="section__title section__title--pink">Latest Blogs</h2>
            <span className="section__subtitle">Stories from our travelers</span>
          </div>
          <div className="pager">
            <button className="pager__btn" onClick={() => nav('/blogs')}>All</button>
          </div>
        </div>

        <div className="cards cards--scroll">
          {blogs.slice(0, 3).map(b => (
            <article key={b.id} className="mini-blog" onClick={() => nav('/blogs')}>
              <img src={b.thumb} alt={b.title} />
              <h3 style={{margin: '8px 0 4px', fontSize: 15}}>{b.title}</h3>
              <p className="muted" style={{fontSize:13, margin:0}}>{b.excerpt}</p>
              <p className="meta" style={{marginTop:8}}>{b.date} • {b.author}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__heading">
          <div>
            <h2 className="section__title section__title--pink">Send us your valuable feedback</h2>
            <span className="section__subtitle">Share your experience — we read every message</span>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{maxWidth:780}}>
            <button className="btn btn--pink" onClick={()=>setShowReviewForm(s=>!s)}>{showReviewForm ? 'Hide Feedback Form' : 'Send us your valuable feedback'}</button>

            {showReviewForm && (
              <form onSubmit={async (e)=>{
                e.preventDefault()
                setReviewMessage('')
                try{
                  const res = await fetch(`${API}/api/reviews`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(reviewForm) })
                  if (!res.ok) return setReviewMessage('Failed to submit feedback')
                  setReviewForm({ author:'', rating:5, message:'' })
                  setReviewMessage('Thanks — your feedback was submitted and will appear after approval.')
                }catch(err){
                  setReviewMessage('Error submitting feedback')
                }
              }} style={{display:'grid',gap:8,marginTop:12}}>
                <input value={reviewForm.author} onChange={e=>setReviewForm({...reviewForm, author:e.target.value})} placeholder="Your name" />

                {/* Star rating */}
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{display:'flex',gap:6}}>
                    {[1,2,3,4,5].map(i=> (
                      <button type="button" key={i} onClick={()=>setReviewForm(f=>({ ...f, rating: i }))} style={{background:'transparent',border:'none',cursor:'pointer',fontSize:22,color: i <= (reviewForm.rating||0) ? '#ffd166' : '#444'}} aria-label={`${i} star`}>
                        {i <= (reviewForm.rating||0) ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                  <div style={{fontSize:13,color:'#999'}}>{reviewForm.rating} / 5</div>
                </div>

                <textarea value={reviewForm.message} onChange={e=>setReviewForm({...reviewForm, message:e.target.value})} placeholder="Your feedback" rows={4} />
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn--pink" type="submit">Submit</button>
                  <button type="button" className="btn" onClick={()=>{ setShowReviewForm(false); setReviewMessage('') }}>Cancel</button>
                </div>
                {reviewMessage && <div style={{marginTop:8,color:'#9f9'}}>{reviewMessage}</div>}
              </form>
            )}
          </div>

          <div style={{maxWidth:780}}>
            <h3 style={{marginTop:0}}>Recent reviews</h3>
            {reviews.length===0 && <div className="muted">No reviews yet</div>}
            {reviews.slice(0,5).map(rv=> (
              <div key={rv._id} style={{background:'#fff',padding:12,borderRadius:8,marginTop:8}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontWeight:700}}>{rv.author}</div>
                  <div style={{color:'#ffd166'}}>{'★'.repeat(Math.max(0, Math.min(5, Math.round(rv.rating || 0))))}</div>
                </div>
                <div style={{fontSize:13,color:'#333',marginTop:6}}>{rv.message}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="section">
        <div className="section__heading">
          <h2 className="section__title section__title--strong">Blogs</h2>
        </div>
        <p className="muted">Send us your story....</p>
      
      </section> */}
    </div>
  )
}
