import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function authHeaders() {
  const t = localStorage.getItem('admin_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// Admin dashboard: full CRUD UI for blogs, vouchers, tours, reviews and upload
export default function AdminDashboard(){
  const nav = useNavigate()

  // lists
  const [blogs, setBlogs] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [tours, setTours] = useState([])
  const [reviews, setReviews] = useState([])
  const [gallery, setGallery] = useState([])

  // messages and loading
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // form states for create/edit
  const [blogForm, setBlogForm] = useState({ _id:'', title:'', excerpt:'', thumb:'', date:'', author:'', content:'' })
  const [voucherForm, setVoucherForm] = useState({ _id:'', code:'', discountPercent:10, active:true })
  const [tourForm, setTourForm] = useState({ _id:'', title:'', img:'', desc:'', price:0, days:1, location:'', trending:false, upcoming:false, photos: [], details: { expenses: '', itinerary: [] } })
  const [tourPhotoUrl, setTourPhotoUrl] = useState('')
  const [itineraryItem, setItineraryItem] = useState('')
  const [reviewForm, setReviewForm] = useState({ author:'', rating:5, message:'', tourId: '' })

  useEffect(()=>{
    // require token or redirect to login
    if (!localStorage.getItem('admin_token')) return nav('/admin/login')
    refreshAll()
  }, [])

  async function refreshAll(){
    setLoading(true)
    try{
      const [bRes, vRes, tRes, rRes, gRes] = await Promise.all([
        fetch(`${API}/api/blogs`),
        fetch(`${API}/api/vouchers`, { headers: authHeaders() }),
        fetch(`${API}/api/tours`),
        fetch(`${API}/api/reviews`),
        fetch(`${API}/api/gallery`, { headers: authHeaders() }),
      ])
      if (bRes.ok) setBlogs(await bRes.json())
      if (vRes.ok) setVouchers(await vRes.json())
      if (tRes.ok) setTours(await tRes.json())
      if (rRes.ok) setReviews(await rRes.json())
      if (gRes && gRes.ok) setGallery(await gRes.json())
    }catch(err){
      console.error(err)
      setMessage('Error fetching data')
    }
    setLoading(false)
  }

  // ----- Blogs -----
  async function saveBlog(e){
    e.preventDefault()
    const method = blogForm._id ? 'PUT' : 'POST'
    const url = blogForm._id ? `${API}/api/blogs/${blogForm._id}` : `${API}/api/blogs`
    const res = await fetch(url, { method, headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(blogForm) })
    if (!res.ok) return setMessage('Failed to save blog')
    setBlogForm({ _id:'', title:'', excerpt:'', thumb:'', date:'', author:'', content:'' })
    await refreshAll()
    setMessage('Blog saved')
  }

  function editBlog(b){ setBlogForm({ ...b }) }

  async function deleteBlog(id){
    await fetch(`${API}/api/blogs/${id}`, { method:'DELETE', headers: authHeaders() })
    setMessage('Blog deleted')
    await refreshAll()
  }

  // ----- Vouchers -----
  async function saveVoucher(e){
    e.preventDefault()
    const method = voucherForm._id ? 'PUT' : 'POST'
    const url = voucherForm._id ? `${API}/api/vouchers/${voucherForm._id}` : `${API}/api/vouchers`
    const res = await fetch(url, { method, headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(voucherForm) })
    if (!res.ok) return setMessage('Failed to save voucher')
    setVoucherForm({ _id:'', code:'', discountPercent:10, active:true })
    await refreshAll()
    setMessage('Voucher saved')
  }

  function editVoucher(v){ setVoucherForm({ ...v }) }

  async function deleteVoucher(id){
    await fetch(`${API}/api/vouchers/${id}`, { method:'DELETE', headers: authHeaders() })
    setMessage('Voucher deleted')
    await refreshAll()
  }

  // ----- Tours -----
  async function saveTour(e){
    e.preventDefault()
    // client-side validation for required tour fields
    if (!tourForm.title || !tourForm.img || !tourForm.desc || !tourForm.location) {
      return setMessage('Please fill Title, Image, Description and Location before saving')
    }
    const method = tourForm._id ? 'PUT' : 'POST'
    const url = tourForm._id ? `${API}/api/tours/${tourForm._id}` : `${API}/api/tours`
    const res = await fetch(url, { method, headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(tourForm) })
    if (!res.ok) return setMessage('Failed to save tour')
    setTourForm({ _id:'', title:'', img:'', desc:'', price:0, days:1, location:'', trending:false, upcoming:false, photos: [], details: { expenses: '', itinerary: [] } })
    await refreshAll()
    setMessage('Tour saved')
  }

  function editTour(t){ setTourForm({ ...t }) }

  async function deleteTour(id){
    await fetch(`${API}/api/tours/${id}`, { method:'DELETE', headers: authHeaders() })
    setMessage('Tour deleted')
    await refreshAll()
  }

  // ----- Reviews -----
  async function addReview(e){
    e.preventDefault()
    const res = await fetch(`${API}/api/reviews`, { method:'POST', headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(reviewForm) })
    if (!res.ok) return setMessage('Failed to add review')
    setReviewForm({ author:'', rating:5, message:'', tourId: '' })
    await refreshAll()
    setMessage('Review added')
  }

  async function handleToggleApprove(id, approve){
    const res = await fetch(`${API}/api/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ approved: approve }) })
    if (!res.ok) return setMessage('Failed to update review')
    setMessage(approve ? 'Review approved' : 'Review unapproved')
    await refreshAll()
  }

  async function deleteReview(id){
    await fetch(`${API}/api/reviews/${id}`, { method:'DELETE', headers: authHeaders() })
    setMessage('Review deleted')
    await refreshAll()
  }

  function handleLogout(){
    localStorage.removeItem('admin_token')
    nav('/admin/login')
  }

  // ----- Upload -----
  async function uploadImage(e){
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`${API}/api/upload`, { method: 'POST', body: fd, headers: authHeaders() })
    if (!res.ok) return setMessage('Upload failed')
    const data = await res.json()
    setMessage(`Uploaded: ${data.path}`)
    // helpful: put uploaded path into currently focused form thumb/img
    if (document.activeElement && document.activeElement.dataset && document.activeElement.dataset.target === 'blogThumb'){
      setBlogForm(f=>({ ...f, thumb: data.path }))
    }
    if (document.activeElement && document.activeElement.dataset && document.activeElement.dataset.target === 'tourImg'){
      setTourForm(f=>({ ...f, img: data.path }))
    }
    await refreshAll()
  }

  async function deleteGalleryItem(id){
    if (!window.confirm('Delete this photo?')) return
    try{
      const res = await fetch(`${API}/api/gallery/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) return setMessage('Failed to delete photo')
      setMessage('Photo deleted')
      await refreshAll()
    }catch(err){
      console.error('Delete gallery error', err)
      setMessage('Failed to delete photo')
    }
  }

  return (
    <div className="admin-dashboard" style={{ padding: 28 }}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <h1 style={{margin:0}}>Admin Dashboard</h1>
        <div style={{marginLeft:'auto'}}>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {message && <div style={{color:'lightgreen', marginTop:8}}>{message}</div>}
      {loading && <div style={{color:'#e70e0eff'}}>Loading...</div>}

      {/* Blogs form */}
      <section style={{marginTop:20}}>
        <h3>Add / Edit Blog</h3>
        <form onSubmit={saveBlog} style={{display:'grid',gap:8,maxWidth:720}}>
          <input value={blogForm.title} onChange={e=>setBlogForm({...blogForm, title:e.target.value})} placeholder="Title" />
          <input value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm, excerpt:e.target.value})} placeholder="Excerpt" />
          <div style={{display:'flex',gap:8}}>
            <input value={blogForm.thumb} onChange={e=>setBlogForm({...blogForm, thumb:e.target.value})} placeholder="Thumb path (or upload)" />
            <input data-target="blogThumb" type="file" onChange={uploadImage} />
          </div>
          <input value={blogForm.author} onChange={e=>setBlogForm({...blogForm, author:e.target.value})} placeholder="Author" />
          <input value={blogForm.date} onChange={e=>setBlogForm({...blogForm, date:e.target.value})} placeholder="Date" />
          <textarea value={blogForm.content} onChange={e=>setBlogForm({...blogForm, content:e.target.value})} placeholder="Content" rows={6} />
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn--pink" type="submit">Save Blog</button>
            <button className="btn" type="button" onClick={()=>setBlogForm({ _id:'', title:'', excerpt:'', thumb:'', date:'', author:'', content:'' })}>Clear</button>
          </div>
        </form>

        <div style={{marginTop:12}}>
          {blogs.map(b=> (
            <div key={b._id} style={{background:'#fff',padding:12,borderRadius:8,display:'flex',justifyContent:'space-between',marginTop:8}}>
              <div>
                <strong>{b.title}</strong>
                <div style={{fontSize:13,color:'#666'}}>{b.excerpt}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>editBlog(b)}>Edit</button>
                <button className="btn" onClick={()=>deleteBlog(b._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vouchers */}
      <section style={{marginTop:20}}>
        <h3>Vouchers</h3>
        <form onSubmit={saveVoucher} style={{display:'flex',gap:8,alignItems:'center'}}>
          <input value={voucherForm.code} onChange={e=>setVoucherForm({...voucherForm, code:e.target.value.toUpperCase()})} placeholder="CODE" />
          <input type="number" value={voucherForm.discountPercent} onChange={e=>setVoucherForm({...voucherForm, discountPercent: Number(e.target.value)})} style={{width:120}} />
          <label className="admin-label"><input type="checkbox" checked={voucherForm.active} onChange={e=>setVoucherForm({...voucherForm, active:e.target.checked})} /> Active</label>
          <button className="btn" type="submit">Save Voucher</button>
          <button className="btn" onClick={()=>setVoucherForm({ _id:'', code:'', discountPercent:10, active:true })} type="button">Clear</button>
        </form>

        <div style={{marginTop:12}}>
          {vouchers.map(v=> (
            <div key={v._id} style={{background:'#fff',padding:12,borderRadius:8,display:'flex',justifyContent:'space-between',marginTop:8}}>
              <div>
                <strong>{v.code}</strong> • {v.discountPercent}% • {v.active ? 'Active' : 'Inactive'}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>editVoucher(v)}>Edit</button>
                <button className="btn" onClick={()=>deleteVoucher(v._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tours */}
      <section style={{marginTop:20}}>
        <h3>Tours</h3>
        <form onSubmit={saveTour} style={{display:'grid',gap:8,maxWidth:720}}>
          <input value={tourForm.title} onChange={e=>setTourForm({...tourForm, title:e.target.value})} placeholder="Title" />
          <textarea value={tourForm.desc} onChange={e=>setTourForm({...tourForm, desc:e.target.value})} placeholder="Description" rows={4} />
          <div style={{display:'flex',gap:8}}>
            <input value={tourForm.img} onChange={e=>setTourForm({...tourForm, img:e.target.value})} placeholder="Image path (or upload)" />
            <input data-target="tourImg" type="file" onChange={uploadImage} />
          </div>
          {/* photos list (additional gallery) */}
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input value={tourPhotoUrl} onChange={e=>setTourPhotoUrl(e.target.value)} placeholder="Add photo URL" />
            <button type="button" className="btn" onClick={()=>{
              if (!tourPhotoUrl) return;
              setTourForm(f=>({ ...f, photos: [...(f.photos||[]), tourPhotoUrl] }));
              setTourPhotoUrl('')
            }}>Add Photo</button>
          </div>
          {tourForm.photos && tourForm.photos.length>0 && (
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {tourForm.photos.map((p,i)=> (
                <div key={i} style={{background:'#fff',padding:6,borderRadius:8}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <img src={p} alt={`photo-${i}`} style={{height:56,width:80,objectFit:'cover',borderRadius:6}} />
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <div style={{fontSize:12, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis'}}>{p}</div>
                      <div>
                        <button type="button" className="btn" onClick={()=>setTourForm(f=>({ ...f, photos: f.photos.filter((_,idx)=>idx!==i) }))}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{display:'flex',gap:8}}>
            <input type="number" value={tourForm.price} onChange={e=>setTourForm({...tourForm, price: Number(e.target.value)})} placeholder="Price" />
            <input type="number" value={tourForm.days} onChange={e=>setTourForm({...tourForm, days: Number(e.target.value)})} placeholder="Days" />
            <input value={tourForm.location} onChange={e=>setTourForm({...tourForm, location:e.target.value})} placeholder="Location" />
          </div>
          <div>
            <input value={tourForm.details.expenses} onChange={e=>setTourForm(f=>({ ...f, details: { ...f.details, expenses: e.target.value } }))} placeholder="Expenses (e.g. what's included)" />
          </div>
          <div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={itineraryItem} onChange={e=>setItineraryItem(e.target.value)} placeholder="Add itinerary item" />
              <button type="button" className="btn" onClick={()=>{
                if (!itineraryItem) return;
                setTourForm(f=>({ ...f, details: { ...f.details, itinerary: [...(f.details.itinerary||[]), itineraryItem] } }));
                setItineraryItem('')
              }}>Add Itinerary Item</button>
            </div>
            {tourForm.details.itinerary && tourForm.details.itinerary.length>0 && (
              <ol style={{marginTop:8}}>
                {tourForm.details.itinerary.map((it,i)=> (
                  <li key={i} style={{marginBottom:6}}>
                    {it} <button type="button" className="btn" onClick={()=>setTourForm(f=>({ ...f, details: { ...f.details, itinerary: f.details.itinerary.filter((_,idx)=>idx!==i) } }))}>Remove</button>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <label className="admin-label"><input type="checkbox" checked={tourForm.trending} onChange={e=>setTourForm({...tourForm, trending:e.target.checked})} /> Trending</label>
            <label className="admin-label"><input type="checkbox" checked={tourForm.upcoming} onChange={e=>setTourForm({...tourForm, upcoming:e.target.checked})} /> Upcoming</label>
            <div style={{marginLeft:'auto'}}>
              <button className="btn btn--pink" type="submit">Save Tour</button>
            </div>
          </div>
        </form>

        <div style={{marginTop:12}}>
          {tours.map(t=> (
            <div key={t._id} style={{background:'#fff',padding:12,borderRadius:8,display:'flex',justifyContent:'space-between',marginTop:8}}>
              <div>
                <strong>{t.title}</strong>
                <div style={{fontSize:13,color:'#666'}}>Price: {t.price}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>editTour(t)}>Edit</button>
                <button className="btn" onClick={()=>deleteTour(t._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{marginTop:20}}>
        <h3>Reviews</h3>
        <form onSubmit={addReview} style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <input value={reviewForm.author} onChange={e=>setReviewForm({...reviewForm, author:e.target.value})} placeholder="Author" />
          <input type="number" value={reviewForm.rating} onChange={e=>setReviewForm({...reviewForm, rating: Number(e.target.value)})} style={{width:80}} min={1} max={5} />
          <input value={reviewForm.tourId} onChange={e=>setReviewForm({...reviewForm, tourId: e.target.value})} placeholder="Tour ID (optional)" style={{width:180}} />
          <input value={reviewForm.message} onChange={e=>setReviewForm({...reviewForm, message:e.target.value})} placeholder="Message" />
          <button className="btn" type="submit">Add Review</button>
        </form>

        <div style={{marginTop:12}}>
          {reviews.map(r=> (
            <div key={r._id} style={{background:'#fff',padding:12,borderRadius:8,display:'flex',justifyContent:'space-between',marginTop:8,alignItems:'center'}}>
              <div>
                <strong>{r.author}</strong> • {r.rating}★ {r.tourId ? <span style={{fontSize:12,color:'#666'}}> — {r.tourId}</span> : null}
                <div style={{fontSize:13,color:'#666'}}>{r.message}</div>
                <div style={{fontSize:12,color:r.approved ? 'green' : '#999'}}>{r.approved ? 'Approved' : 'Pending'}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>handleToggleApprove(r._id, !r.approved)}>{r.approved ? 'Unapprove' : 'Approve'}</button>
                <button className="btn" onClick={()=>deleteReview(r._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload helper */}
      <section style={{marginTop:20}}>
        <h3>Upload Photo</h3>
        <input type="file" onChange={uploadImage} />
        <div style={{fontSize:13,color:'#ccc',marginTop:8}}>Uploaded images are saved to the project's <strong>/images</strong> folder and returned as a public path you can paste into forms.</div>

        {gallery && gallery.length > 0 && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
            {gallery.map(item => (
              <div key={item._id} style={{width:140,background:'#fff',padding:8,borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center'}}>
                <img src={item.path} alt={item.caption || 'uploaded'} style={{width:120,height:80,objectFit:'cover',borderRadius:6}} />
                <div style={{fontSize:12,color:'#333',marginTop:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:'100%'}}>{item.caption || item.path}</div>
                <div style={{display:'flex',gap:6,marginTop:8}}>
                  <button className="btn" onClick={()=>setBlogForm(f=>({ ...f, thumb: item.path }))}>Use Thumb</button>
                  <button className="btn" onClick={()=>setTourForm(f=>({ ...f, img: item.path }))}>Use Img</button>
                </div>
                <div style={{marginTop:8}}>
                  <button className="btn" onClick={()=>deleteGalleryItem(item._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
