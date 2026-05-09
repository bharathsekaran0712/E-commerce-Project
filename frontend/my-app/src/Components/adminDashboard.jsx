import React, { useState, useEffect } from "react"

// ─── API Config ───────────────────────────────────────────────────────────────
const BASE = "https://e-commerce-backend-zg40.onrender.com"
const token = () => localStorage.getItem("token")
const authHeader = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` })

const api = {
  // Users
  editUser:    (body) => fetch(`${BASE}/api/v1/user/edit`,{ method:"POST", headers:authHeader(), body:JSON.stringify(body) }).then(r=>r.json()),
  // Orders
  getAllOrders: (body) => fetch(`${BASE}/api/v1/orders/user`,{ method:"POST", headers:authHeader(), body:JSON.stringify(body) }).then(r=>r.json()),
  updateStatus: (body) => fetch(`${BASE}/api/v1/order/status`,{ method:"POST", headers:authHeader(), body:JSON.stringify(body) }).then(r=>r.json()),
  cancelOrder:  (body) => fetch(`${BASE}/api/v1/order/cancel`,{ method:"POST", headers:authHeader(), body:JSON.stringify(body) }).then(r=>r.json()),
  // Products
  getProducts:  () => fetch(`${BASE}/api/v1/products/getAllProducts`).then(r=>r.json()),
  addProduct:   (body) => fetch(`${BASE}/api/v1/product/addProduct`,{ method:"POST", headers:authHeader(), body:JSON.stringify(body) }).then(r=>r.json()),
  updateProduct:(id,body)=> fetch(`${BASE}/api/v1/product/${id}`,{ method:"PUT",  headers:authHeader(), body:JSON.stringify(body) }).then(r=>r.json()),
  deleteProduct:(id) => fetch(`${BASE}/api/v1/product/${id}`,{ method:"DELETE",headers:authHeader() }).then(r=>r.json()),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || { name:"Admin", role:"Admin" } }
  catch { return { name:"Admin", role:"Admin" } }
}

const statusStyle = {
  "Order Placed": "bg-blue-100 text-blue-800",
  Processing:     "bg-yellow-100 text-yellow-800",
  Shipped:        "bg-purple-100 text-purple-800",
  "Out for Delivery": "bg-orange-100 text-orange-800",
  Delivered:      "bg-green-100 text-green-800",
  Cancelled:      "bg-red-100 text-red-800",
}

const ORDER_STATUSES = ["Order Placed","Processing","Shipped","Out for Delivery","Delivered","Cancelled"]
const CATEGORIES     = ["Accessories","Fashion","Laptops","Mobile Phones","Other"]
const stockDot       = s => s===0 ? "bg-red-500" : s<=4 ? "bg-yellow-400" : "bg-green-500"
const stockLabel     = s => s===0 ? "Out of stock" : s<=4 ? `Low (${s})` : `${s} units`
const stockKey       = s => s===0 ? "out" : s<=4 ? "low" : "ok"
const defProdForm    = { name:"", description:"", price:"", stock:"", category:"", image:"" }

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Grid:    ()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Cart:    ()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M2 2h2l2 8h6l2-6H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="13" r="1" fill="currentColor"/><circle cx="12" cy="13" r="1" fill="currentColor"/></svg>,
  Box:     ()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 3V2M11 3V2M2 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Users:   ()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M11 7c1.5 0 3 .8 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Profile: ()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 13c0-2.21 1.79-3 4-3s4 .79 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Settings:()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Bell:    ()=><svg viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5ZM6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Search:  ()=><svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M13 7A5 5 0 1 1 3 7a5 5 0 0 1 10 0ZM11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────
const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative max-w-xs flex-1">
    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Ic.Search/></span>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"/>
  </div>
)

const Sel = ({ value, onChange, children }) => (
  <select value={value} onChange={e=>onChange(e.target.value)}
    className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none">
    {children}
  </select>
)

const StatCard = ({ label, value, color="" }) => (
  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-lg font-medium ${color||"text-gray-800"}`}>{value}</p>
  </div>
)

const ActionBtn = ({ onClick, variant="default", children, disabled }) => {
  const cls = {
    default: "border-gray-200 text-gray-500 hover:bg-gray-50",
    blue:    "border-blue-200 text-blue-600 hover:bg-blue-50",
    red:     "border-red-200 text-red-500 hover:bg-red-50",
    green:   "border-green-200 text-green-600 hover:bg-green-50",
  }
  return (
    <button onClick={onClick} disabled={disabled}
      className={`text-xs px-3 py-1 rounded border ${cls[variant]} disabled:opacity-40`}>
      {children}
    </button>
  )
}

const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={()=>onChange(!checked)}
    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked?"bg-blue-600":"bg-gray-200"}`}>
    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked?"left-5":"left-0.5"}`}/>
  </button>
)

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
  </div>
)

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, user, onLogout }) => {
  const groups = [
    { section:"Main",    items:[
      { key:"dashboard", label:"Dashboard", Icon:Ic.Grid },
      { key:"orders",    label:"Orders",    Icon:Ic.Cart },
      { key:"products",  label:"Products",  Icon:Ic.Box  },
    ]},
    { section:"Users",   items:[
      { key:"customers", label:"Customers", Icon:Ic.Users },
    ]},
    { section:"Account", items:[
      { key:"profile",   label:"Profile",   Icon:Ic.Profile}
    ]},
  ]
  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xl font-bold text-blue-800">ShoppingHub</p>
        <p className="text-xs text-gray-400 mt-0.5">Admin panel</p>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {groups.map(g=>(
          <div key={g.section}>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 pt-4 pb-1">{g.section}</p>
            {g.items.map(({key,label,Icon})=>(
              <button key={key} onClick={()=>setActive(key)}
                className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-xs border-l-2 transition-all
                  ${active===key
                    ?"border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    :"border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                <span className="w-4 h-4 flex-shrink-0"><Icon/></span>{label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
            {user.name?.charAt(0).toUpperCase()||"A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{user.name||"Admin"}</p>
            <p className="text-[11px] text-gray-400">{user.role||"Admin"}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs text-red-500 hover:text-red-700">Logout</button>
      </div>
    </div>
  )
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
const DashboardTab = () => {
  const [orders,   setOrders]   = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const user = getUser()

  useEffect(()=>{
    const load = async () => {
      try {
        // your getAllOrders route: POST /api/v1/orders/user with {user} in body
        const [oRes, pRes] = await Promise.all([
          api.getAllOrders({ user }),
          api.getProducts()
        ])
        if (oRes.success) setOrders(oRes.orders   || [])
        if (pRes.success) setProducts(pRes.products || [])
      } catch(e) { console.log(e) }
      finally { setLoading(false) }
    }
    load()
  },[])

  if (loading) return <Spinner/>

  const revenue    = orders.filter(o=>o.orderStatus!=="Cancelled").reduce((a,o)=>a+o.totalPrice,0)
  const delivered  = orders.filter(o=>o.orderStatus==="Delivered").length
  const pending    = orders.filter(o=>o.orderStatus==="Order Placed"||o.orderStatus==="Processing").length
  const cancelled  = orders.filter(o=>o.orderStatus==="Cancelled").length
  const outOfStock = products.filter(p=>p.stock===0).length

  // Build last 7 days revenue from orders
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  const today = new Date()
  const barData = Array.from({length:7},(_,i)=>{
    const d = new Date(today); d.setDate(today.getDate()-(6-i))
    const dayOrders = orders.filter(o=>{
      const od = new Date(o.createdAt||o._id?.toString().substring(0,8))
      return od.toDateString()===d.toDateString() && o.orderStatus!=="Cancelled"
    })
    return { day:days[d.getDay()], val:dayOrders.reduce((a,o)=>a+o.totalPrice,0) }
  })
  const maxBar = Math.max(...barData.map(d=>d.val),1)

  const statusCounts = ORDER_STATUSES.map(s=>({
    label:s, count:orders.filter(o=>o.orderStatus===s).length
  })).filter(s=>s.count>0)

  const donutColors = {
  "Order Placed": "#3b82f6",       // blue
  "Processing": "#8b5cf6",         // violet
  "Shipped": "#6b7280",            // gray
  "Out for Delivery": "#f59e0b",  // amber
  "Delivered": "#22c55e",          // green
  "Cancelled": "#ef4444",          // red
}

  return (
    <div className="p-6 space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:"Total Revenue",    value:`₹${revenue.toLocaleString()}`,   up:true,  change:"All time" },
          { label:"Total Orders",     value:orders.length,                     up:true,  change:`${delivered} delivered` },
          { label:"Pending Orders",   value:pending,                           up:false, change:`${cancelled} cancelled` },
          { label:"Out of Stock",     value:outOfStock,                        up:false, change:`${products.length} products total` },
        ].map((m,i)=>(
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1.5">{m.label}</p>
            <p className="text-xl font-medium text-gray-800 mb-1">{m.value}</p>
            <p className={`text-xs ${m.up?"text-green-700":"text-red-600"}`}>{m.change}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Bar chart */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-700 mb-4">Revenue — last 7 days</p>
          <div className="flex items-end gap-2 h-28">
            {barData.map((d,i)=>{
              const h = Math.round((d.val/maxBar)*100)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div style={{height:`${h||2}%`}} title={`₹${d.val.toLocaleString()}`}
                    className={`w-full rounded-t transition-all ${i===6?"bg-blue-600":"bg-blue-200 hover:bg-blue-400"}`}/>
                  <span className="text-[10px] text-gray-400">{d.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Donut */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-700 mb-3">Order status</p>
          <div className="flex flex-col items-center gap-3">
            <svg width="110" height="110" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" fill="none" stroke="#f3f4f6" strokeWidth="16"/>
              {statusCounts.length===0
                ? <circle cx="60" cy="60" r="46" fill="none" stroke="#e5e7eb" strokeWidth="16"/>
                : statusCounts.map((s,i)=>{
                    const total = orders.length||1
                    const pct   = s.count/total
                    const circ  = 2*Math.PI*46
                    const dash  = pct*circ
                    const offset= statusCounts.slice(0,i).reduce((a,c)=>a+(c.count/total)*circ,0)
                    return (
                      <circle key={s.label} cx="60" cy="60" r="46" fill="none"
                        stroke={donutColors[s.label] || "#ccc"} strokeWidth="16"
                        strokeDasharray={`${dash} ${circ-dash}`}
                        strokeDashoffset={29 - offset}/>
                    )
                  })
              }
              <text x="60" y="57" textAnchor="middle" fontSize="16" fontWeight="500" fill="#1f2937">{orders.length}</text>
              <text x="60" y="70" textAnchor="middle" fontSize="9"  fill="#9ca3af">total</text>
            </svg>
            <div className="w-full space-y-1.5">
              {statusCounts.map((s,i)=>(
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{background:donutColors[s.label]}}/>
                    <span className="text-gray-500">{s.label}</span>
                  </div>
                  <span className="font-medium text-gray-700">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-700 mb-3">Recent orders</p>
          {orders.length===0
            ? <p className="text-xs text-gray-400 text-center py-6">No orders yet</p>
            : <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Order","Amount","Status"].map(h=>(
                      <th key={h} className="text-left text-gray-400 font-medium pb-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0,5).map((o,i)=>(
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 text-blue-600 font-medium">#{o._id?.slice(-5)}</td>
                      <td className="py-2 font-medium">₹{o.totalPrice?.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyle[o.orderStatus]||"bg-gray-100 text-gray-600"}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

        {/* Low stock products */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-700 mb-3">Low / out of stock</p>
          {products.filter(p=>p.stock<=5).length===0
            ? <p className="text-xs text-gray-400 text-center py-6">All products in stock</p>
            : <div className="space-y-2">
                {products.filter(p=>p.stock<=5).slice(0,5).map((p,i)=>(
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-7 h-7 rounded object-cover bg-gray-100"
                        onError={e=>{ e.target.style.display="none" }}/>
                      <div>
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[140px]">{p.name}</p>
                        <p className="text-[11px] text-gray-400">{p.category}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${stockDot(p.stock)}`}/>
                      {stockLabel(p.stock)}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  )
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
const OrdersTab = () => {
  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page,         setPage]         = useState(1)
  const [actionMsg,    setActionMsg]    = useState("")
  const LIMIT = 8
  const user = getUser()

  useEffect(()=>{ fetchOrders() },[])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // POST /api/v1/orders/user  body: { user }
      // your controller checks user.role — Admin gets all orders
      const data = await api.getAllOrders({ user })
      if (data.success) setOrders(data.orders||[])
    } catch(e) { console.log(e) }
    finally { setLoading(false) }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      // POST /api/v1/order/status  body: { orderId, status }
      const data = await api.updateStatus({ orderId, status })
      if (data.success) {
        setOrders(prev => prev.map(o => o._id===orderId ? {...o, orderStatus:status} : o))
        showMsg("Status updated!")
      }
    } catch(e) { console.log(e) }
  }

  const handleCancel = async (orderId, userId) => {
    if (!window.confirm("Cancel this order?")) return
    try {
      // POST /api/v1/order/cancel  body: { orderId, userId }
      const data = await api.cancelOrder({ orderId, userId })
      if (data.success) {
        setOrders(prev => prev.map(o => o._id===orderId ? {...o, orderStatus:"Cancelled"} : o))
        showMsg("Order cancelled!")
      }
    } catch(e) { console.log(e) }
  }

  const showMsg = (msg) => { setActionMsg(msg); setTimeout(()=>setActionMsg(""),2500) }

  const filtered = orders.filter(o => {
    const mq = !search || o._id?.toLowerCase().includes(search.toLowerCase())
    const ms = !statusFilter || o.orderStatus===statusFilter
    return mq && ms
  })

  const totalPages = Math.ceil(filtered.length/LIMIT)
  const paginated  = filtered.slice((page-1)*LIMIT, page*LIMIT)

  const summaryStats = [
    { label:"All orders",    value:orders.length,                                                color:"" },
    { label:"Order Placed",  value:orders.filter(o=>o.orderStatus==="Order Placed").length,      color:"text-blue-700" },
    { label:"Delivered",     value:orders.filter(o=>o.orderStatus==="Delivered").length,         color:"text-green-700" },
    { label:"Cancelled",     value:orders.filter(o=>o.orderStatus==="Cancelled").length,         color:"text-red-700" },
  ]

  return (
    <div>
      {actionMsg && (
        <div className="mx-6 mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs">{actionMsg}</div>
      )}

      <div className="px-6 py-4 grid grid-cols-4 gap-3">
        {summaryStats.map((s,i)=><StatCard key={i} {...s}/>)}
      </div>

      <div className="bg-white border-y border-gray-200 px-6 py-3 flex items-center gap-3">
        <SearchBar value={search} onChange={v=>{setSearch(v);setPage(1)}} placeholder="Search by order ID..."/>
        <Sel value={statusFilter} onChange={v=>{setStatusFilter(v);setPage(1)}}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map(s=><option key={s}>{s}</option>)}
        </Sel>
        <button onClick={fetchOrders} className="ml-auto text-xs border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <div className="px-6 py-4">
        {loading ? <Spinner/> : (
          <>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Order ID","Items","Amount","Shipping","Status","Actions"].map(h=>(
                      <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length===0
                    ? <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No orders found</td></tr>
                    : paginated.map((o,i)=>(
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                        <td className="px-4 py-3 font-medium text-blue-600">#{o._id?.slice(-5)}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {o.orderItem?.length} item{o.orderItem?.length!==1?"s":""}
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {o.orderItem?.slice(0,2).map(it=>it.name).join(", ")}
                            {o.orderItem?.length>2?` +${o.orderItem.length-2} more`:""}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">₹{o.totalPrice?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-400 text-[11px]">
                          <div>{o.shippingAddress?.address}</div>
                          <div>{o.shippingAddress?.city}, {o.shippingAddress?.pinCode}</div>
                          <div>{o.shippingAddress?.phoneNo}</div>
                        </td>
                        <td className="px-4 py-3">
                          {/* inline status dropdown — maps to POST /api/v1/order/status */}
                          <select value={o.orderStatus}
                            onChange={e=>handleStatusChange(o._id, e.target.value)}
                            disabled={o.orderStatus==="Cancelled"}
                            className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer
                              ${statusStyle[o.orderStatus]||"bg-gray-100 text-gray-600"}
                              disabled:cursor-not-allowed`}>
                            {ORDER_STATUSES.map(s=><option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <ActionBtn
                            variant="red"
                            disabled={o.orderStatus==="Shipped"||o.orderStatus==="Out for Delivery"||o.orderStatus==="Delivered" || o.orderStatus==="Cancelled"}
                            onClick={()=>handleCancel(o._id, o.user)}>
                            Cancel
                          </ActionBtn>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>Showing {filtered.length===0?0:(page-1)*LIMIT+1}–{Math.min(page*LIMIT,filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
                {Array.from({length:Math.min(5,totalPages||1)},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded border text-xs
                      ${page===p?"bg-blue-700 text-white border-blue-700":"border-gray-200 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
const ProductsTab = () => {
  const [products,     setProducts]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState("")
  const [catFilter,    setCatFilter]    = useState("")
  const [stockFilter,  setStockFilter]  = useState("")
  const [view,         setView]         = useState("grid")
  const [showModal,    setShowModal]    = useState(false)
  const [editProduct,  setEditProduct]  = useState(null)
  const [form,         setForm]         = useState(defProdForm)
  const [msg,          setMsg]          = useState("")
  const [saving,       setSaving]       = useState(false)

  useEffect(()=>{ fetchProducts() },[])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // GET /api/v1/products/getAllProducts
      const data = await api.getProducts()
      if (data.success) setProducts(data.products||[])
    } catch(e) { console.log(e) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      let data
      if (editProduct) {
        // PUT /api/v1/product/:id
        data = await api.updateProduct(editProduct._id, {
          ...form, price:Number(form.price), stock:Number(form.stock)
        })
      } else {
        // POST /api/v1/product/addProduct
        data = await api.addProduct({
          ...form, price:Number(form.price), stock:Number(form.stock)
        })
      }
      if (data.success) {
        fetchProducts()
        setShowModal(false); setEditProduct(null); setForm(defProdForm)
        setMsg(editProduct?"Product updated!":"Product added!")
        setTimeout(()=>setMsg(""),3000)
      }
    } catch(e) { console.log(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      // DELETE /api/v1/product/:id
      const data = await api.deleteProduct(id)
      if (data.success) {
        setProducts(prev=>prev.filter(p=>p._id!==id))
        setMsg("Product deleted!")
        setTimeout(()=>setMsg(""),3000)
      }
    } catch(e) { console.log(e) }
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ name:p.name, description:p.description, price:p.price, stock:p.stock, category:p.category, image:p.image||"" })
    setShowModal(true)
  }

  const filtered = products.filter(p => {
    const mq = !search    || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    const mc = !catFilter || p.category===catFilter
    const ms = !stockFilter || stockKey(p.stock)===stockFilter
    return mq && mc && ms
  })

  const PRODUCT_EMOJIS = { "Electronics":"🔌","Clothing":"👕","Home & Kitchen":"🏠","Books":"📚" }

  return (
    <div>
      {msg && <div className="mx-6 mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs">{msg}</div>}

      {/* Product summary strip */}
      <div className="px-6 py-4 grid grid-cols-4 gap-3">
        {[
          { label:"Total products",  value:products.length,                                      color:"" },
          { label:"In stock",        value:products.filter(p=>p.stock>4).length,                 color:"text-green-700" },
          { label:"Low stock",       value:products.filter(p=>p.stock>0&&p.stock<=4).length,     color:"text-yellow-700" },
          { label:"Out of stock",    value:products.filter(p=>p.stock===0).length,               color:"text-red-700" },
        ].map((s,i)=><StatCard key={i} {...s}/>)}
      </div>

      <div className="bg-white border-y border-gray-200 px-6 py-3 flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..."/>
        <Sel value={catFilter} onChange={setCatFilter}>
          <option value="">All categories</option>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </Sel>
        <Sel value={stockFilter} onChange={setStockFilter}>
          <option value="">All stock</option>
          <option value="ok">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </Sel>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {["grid","list"].map(v=>(
            <button key={v} onClick={()=>setView(v)}
              className={`px-3 py-1 rounded text-xs transition-all ${view===v?"bg-white border border-gray-200 text-gray-800":"text-gray-400"}`}>
              {v==="grid"?"Grid":"List"}
            </button>
          ))}
        </div>
        <button onClick={()=>{setEditProduct(null);setForm(defProdForm);setShowModal(true)}}
          className="ml-auto bg-blue-700 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-800">
          + Add product
        </button>
      </div>

      <div className="p-6">
        {loading ? <Spinner/> : view==="grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p,i)=>(
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all">
                <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="h-full w-full object-cover"
                        onError={e=>{ e.target.style.display="none"; e.target.nextSibling.style.display="flex" }}/>
                    : null
                  }
                  <span className="text-4xl" style={{display:p.image?"none":"flex"}}>
                    {PRODUCT_EMOJIS[p.category]||"📦"}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-800 truncate mb-0.5">{p.name}</p>
                  <p className="text-xs text-gray-400 mb-1 truncate">{p.description}</p>
                  <p className="text-xs text-gray-400 mb-2">{p.category}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">₹{Number(p.price).toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${stockDot(p.stock)}`}/>
                      {stockLabel(p.stock)}
                    </span>
                  </div>
                  <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                    <button onClick={()=>openEdit(p)} className="flex-1 text-xs py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50">Edit</button>
                    <button onClick={()=>handleDelete(p._id)} className="flex-1 text-xs py-1 rounded border border-red-200 text-red-500 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length===0 && (
              <div className="col-span-4 text-center py-10 text-xs text-gray-400">No products found</div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Product","Description","Category","Price","Stock","Status","Actions"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.length===0
                  ? <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No products found</td></tr>
                  : filtered.map((p,i)=>(
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover bg-gray-100"/>
                            : <span className="text-xl">{PRODUCT_EMOJIS[p.category]||"📦"}</span>
                          }
                          <span className="font-medium text-gray-800 max-w-[120px] truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">{p.description}</td>
                      <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{p.category}</span></td>
                      <td className="px-4 py-3 font-medium">₹{Number(p.price).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{stockLabel(p.stock)}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${stockDot(p.stock)}`}/>
                          {p.stock===0?"Out of stock":p.stock<=4?"Low stock":"In stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <ActionBtn variant="blue" onClick={()=>openEdit(p)}>Edit</ActionBtn>
                          <ActionBtn variant="red"  onClick={()=>handleDelete(p._id)}>Delete</ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 w-[440px] p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={()=>setShowModal(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-lg">✕</button>
            <h2 className="text-sm font-medium text-gray-800 mb-5">{editProduct?"Edit product":"Add new product"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[
                { label:"Product name", key:"name",        placeholder:"e.g. Wireless Earbuds", required:true  },
                { label:"Description",  key:"description", placeholder:"Product description",   required:true  },
                { label:"Image URL",    key:"image",       placeholder:"https://...",            required:true  },
              ].map(f=>(
                <div key={f.key}>
                  <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    placeholder={f.placeholder} required={f.required}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"/>
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
                  <option value="">Select category</option>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[{label:"Price (₹)",key:"price"},{label:"Stock qty",key:"stock"}].map(f=>(
                  <div key={f.key}>
                    <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                    <input type="number" value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                      placeholder="0" required min="0"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"/>
                  </div>
                ))}
              </div>
              {/* Preview */}
              {form.image && (
                <div className="mt-1">
                  <label className="text-xs text-gray-400 block mb-1">Image preview</label>
                  <img src={form.image} alt="preview" className="h-20 w-full object-cover rounded-lg bg-gray-100"/>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={()=>setShowModal(false)}
                  className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-gray-500 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 text-xs bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 disabled:opacity-60">
                  {saving?"Saving...":editProduct?"Save changes":"Add product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Customers Tab ────────────────────────────────────────────────────────────
// Note: your backend has no customers list endpoint yet
// This shows orders grouped by user as a proxy
const CustomersTab = () => {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState("")
  const user = getUser()

  useEffect(()=>{
    const load = async () => {
      try {
        const data = await api.getAllOrders({ user })
        if (data.success) setOrders(data.orders||[])
      } catch(e) { console.log(e) }
      finally { setLoading(false) }
    }
    load()
  },[])

  // Group orders by user ID to simulate customer list
  const customerMap = {}
  orders.forEach(o => {
    const uid = o.user?._id || o.user || "unknown"
    if (!customerMap[uid]) {
    customerMap[uid] = {
    _id: uid,
    name: o.user?.name || "Unknown User",
    orders: 0,
    totalSpent: 0,
    lastOrder: o.orderStatus,
    statuses: [],
  }
}
    customerMap[uid].orders++
    customerMap[uid].totalSpent += o.totalPrice||0
    customerMap[uid].statuses.push(o.orderStatus)
  })
  const customers = Object.values(customerMap)

  const filtered = customers.filter(c =>
    !search || c._id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="px-6 py-4 grid grid-cols-4 gap-3">
        {[
          { label:"Unique customers",    value:customers.length,                                             color:"" },
          { label:"Total orders",        value:orders.length,                                                color:"" },
          { label:"Total revenue",       value:`₹${orders.reduce((a,o)=>a+o.totalPrice,0).toLocaleString()}`,color:"" },
          { label:"Avg order value",     value:`₹${customers.length?Math.round(orders.reduce((a,o)=>a+o.totalPrice,0)/orders.length):0}`, color:"" },
        ].map((s,i)=><StatCard key={i} {...s}/>)}
      </div>

      <div className="bg-white border-y border-gray-200 px-6 py-3 flex items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by user ID..."/>
        <p className="ml-auto text-xs text-gray-400">Derived from orders data</p>
      </div>

      <div className="px-6 py-4">
        {loading ? <Spinner/> : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["User Name","User ID","Orders","Total Spent","Avg Order","Last Status"].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.length===0
                  ? <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No customers found</td></tr>
                  : filtered.map((c,i)=>(
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-500 text-[11px] font-mono">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500 text-[11px] font-mono">
                          {c._id?.slice(-8)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{c.orders}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">₹{c.totalSpent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">₹{Math.round(c.totalSpent/c.orders).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusStyle[c.lastOrder]||"bg-gray-100 text-gray-600"}`}>
                          {c.lastOrder}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
const ProfileTab = () => {
  const [user,     setUser]     = useState(getUser())
  const [form,     setForm]     = useState({ name:user.name||"", emailORphone:user.emailORphone||"" })
  const [showEdit, setShowEdit] = useState(false)
  const [msg,      setMsg]      = useState("")
  const [saving,   setSaving]   = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      // POST /api/v1/user/edit  body: { userId, name, emailORphone }
      const data = await api.editUser({ userId:user._id, ...form })
      if (data.success) {
        const updated = { ...user, ...form }
        localStorage.setItem("user", JSON.stringify(updated))
        setUser(updated)
        setShowEdit(false)
        setMsg("Profile updated successfully!")
        setTimeout(()=>setMsg(""),3000)
      }
    } catch(e) { console.log(e) }
    finally { setSaving(false) }
  }

  return (
    <div className="p-6 max-w-2xl space-y-5">
      {msg && <div className="px-4 py-3 bg-green-100 text-green-700 rounded-lg text-xs">{msg}</div>}

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-700">Profile info</p>
          <button onClick={()=>setShowEdit(!showEdit)}
            className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50">
            {showEdit?"Cancel":"Edit"}
          </button>
        </div>

        {!showEdit ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-medium text-blue-700">
              {user.name?.charAt(0).toUpperCase()||"A"}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user.emailORphone}</p>
              <span className="mt-1 inline-block text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{user.role}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            {[
              { label:"Full Name",     key:"name",         placeholder:"Your name"        },
              { label:"Email / Phone", key:"emailORphone", placeholder:"Email or phone"   },
            ].map(f=>(
              <div key={f.key}>
                <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                <input value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                  placeholder={f.placeholder}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"/>
              </div>
            ))}
            <button type="submit" disabled={saving}
              className="self-start text-xs bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-60">
              {saving?"Saving...":"Save changes"}
            </button>
          </form>
        )}
      </div>

      {/* Account info */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Account details</p>
        <div className="space-y-3 text-xs">
          {[
            { label:"User ID",    value:user._id||"—" },
            { label:"Role",       value:user.role||"Admin" },
            { label:"Name",       value:user.name||"—" },
            { label:"Contact",    value:user.emailORphone||"—" },
          ].map(r=>(
            <div key={r.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-400">{r.label}</span>
              <span className="text-gray-700 font-medium font-mono text-[11px]">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
const SettingsTab = () => {
  const [settings, setSettings] = useState({
    storeName:"My Ecom Store", storeEmail:"admin@store.com",
    currency:"INR", orderNotify:true, lowStockAlert:true,
    lowStockThreshold:5, maintenanceMode:false, allowRegistrations:true
  })
  const [saved, setSaved] = useState(false)

  const update = (k,v) => setSettings(p=>({...p,[k]:v}))

  const Field = ({label,desc,children}) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-6">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )

  return (
    <form onSubmit={e=>{e.preventDefault();setSaved(true);setTimeout(()=>setSaved(false),3000)}}
      className="p-6 max-w-2xl space-y-5">
      {saved && <div className="px-4 py-3 bg-green-100 text-green-700 rounded-lg text-xs">Settings saved!</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-1">Store info</p>
        <p className="text-xs text-gray-400 mb-4">Matches your .env and app.js settings</p>
        <Field label="Store name">
          <input value={settings.storeName} onChange={e=>update("storeName",e.target.value)}
            className="w-44 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"/>
        </Field>
        <Field label="API base URL" desc="Your Express server">
          <input value={BASE} readOnly className="w-44 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-400"/>
        </Field>
        <Field label="CORS origin" desc="Configured in app.js">
          <span className="text-xs text-gray-600 font-mono">http://localhost:5173</span>
        </Field>
        <Field label="Currency">
          <select value={settings.currency} onChange={e=>update("currency",e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
            <option value="INR">INR — ₹</option>
            <option value="USD">USD — $</option>
          </select>
        </Field>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-1">Notifications</p>
        <Field label="Order notifications" desc="Alert on new orders">
          <Toggle checked={settings.orderNotify} onChange={v=>update("orderNotify",v)}/>
        </Field>
        <Field label="Low stock alerts" desc="Alert when stock is low">
          <Toggle checked={settings.lowStockAlert} onChange={v=>update("lowStockAlert",v)}/>
        </Field>
        <Field label="Low stock threshold">
          <input type="number" value={settings.lowStockThreshold} onChange={e=>update("lowStockThreshold",Number(e.target.value))}
            className="w-20 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none text-center" min="1"/>
        </Field>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-1">System</p>
        <Field label="Maintenance mode" desc="Takes store offline for customers">
          <Toggle checked={settings.maintenanceMode} onChange={v=>update("maintenanceMode",v)}/>
        </Field>
        <Field label="Allow registrations" desc="Controls POST /api/v1/register">
          <Toggle checked={settings.allowRegistrations} onChange={v=>update("allowRegistrations",v)}/>
        </Field>
      </div>

      {/* Route map */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">API routes in use</p>
        <div className="space-y-2">
          {[
            { method:"POST", path:"/api/v1/orders/user",            desc:"Get all orders (Admin)" },
            { method:"POST", path:"/api/v1/order/status",           desc:"Update order status" },
            { method:"POST", path:"/api/v1/order/cancel",           desc:"Cancel order" },
            { method:"GET",  path:"/api/v1/products/getAllProducts", desc:"Get all products" },
            { method:"POST", path:"/api/v1/product/addProduct",     desc:"Add product" },
            { method:"PUT",  path:"/api/v1/product/:id",            desc:"Update product" },
            { method:"DELETE",path:"/api/v1/product/:id",           desc:"Delete product" },
            { method:"POST", path:"/api/v1/user/edit",              desc:"Edit user profile" },
          ].map((r,i)=>(
            <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded font-mono
                ${r.method==="GET"?"bg-green-100 text-green-700":
                  r.method==="POST"?"bg-blue-100 text-blue-700":
                  r.method==="PUT"?"bg-yellow-100 text-yellow-700":
                  "bg-red-100 text-red-700"}`}>
                {r.method}
              </span>
              <span className="text-[11px] text-gray-500 font-mono flex-1">{r.path}</span>
              <span className="text-[11px] text-gray-400">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="bg-blue-700 text-white text-xs px-6 py-2.5 rounded-lg hover:bg-blue-800">
        Save settings
      </button>
    </form>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const pageTitles = { dashboard:"Dashboard", orders:"Orders", products:"Products", customers:"Customers", profile:"Profile", settings:"Settings" }

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const user = getUser()

  useEffect(()=>{
    const t = localStorage.getItem("token")
    if (!t) window.location.href="/"
  },[])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href="/"
  }

  const tabs = { dashboard:<DashboardTab/>, orders:<OrdersTab/>, products:<ProductsTab/>, customers:<CustomersTab/>, profile:<ProfileTab/>, settings:<SettingsTab/> }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar active={activeTab} setActive={setActiveTab} user={user} onLogout={handleLogout}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <p className="text-sm font-medium text-gray-800">{pageTitles[activeTab]}</p>
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
            <Ic.Bell/>
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tabs[activeTab]}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard