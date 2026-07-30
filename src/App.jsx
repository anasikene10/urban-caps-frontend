import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Check, ArrowRight, Bell, Truck, ChevronLeft, MessageCircle, Instagram } from "lucide-react";
import logo from "./assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const C = {
  white: "#FFFFFF",
  off: "#F4F3F1",
  ink: "#0B0B0C",
  charcoal: "#262626",
  gray: "#8C8C8C",
  grayLine: "#D8D6D2",
};

const PRODUCT_DESCRIPTION = "Une casquette pensée comme une pièce de vestiaire : coupe précise, matière noble, finitions soignées. Un basique qui devient signature.";
const FALLBACK_PRODUCTS = [
  { id: 1, name: "Snapback Signature", tag: "COTON TWILL", price: 390, body: C.ink, brim: C.white, badge: "ÉDITION LIMITÉE" },
  { id: 2, name: "Trucker Noir Mat", tag: "MAILLE TECHNIQUE", price: 340, body: C.charcoal, brim: C.ink, badge: null },
  { id: 3, name: "Dad Hat Ivoire", tag: "COTON LAVÉ", price: 320, body: C.white, brim: C.ink, badge: "BEST-SELLER" },
  { id: 4, name: "Corduroy Graphite", tag: "VELOURS CÔTELÉ", price: 410, body: C.gray, brim: C.ink, badge: null },
  { id: 5, name: "Fitted Monogramme", tag: "LAINE MÉLANGÉE", price: 450, body: C.ink, brim: C.gray, badge: "ÉDITION LIMITÉE" },
  { id: 6, name: "Bucket Architecte", tag: "NYLON RIPSTOP", price: 300, body: C.charcoal, brim: C.white, badge: null },
];

const DISPLAY_STYLES = [
  { body: C.ink, brim: C.white, badge: "ÉDITION LIMITÉE" },
  { body: C.charcoal, brim: C.ink, badge: null },
  { body: C.white, brim: C.ink, badge: "BEST-SELLER" },
  { body: C.gray, brim: C.ink, badge: null },
  { body: C.ink, brim: C.gray, badge: "ÉDITION LIMITÉE" },
  { body: C.charcoal, brim: C.white, badge: null },
];

const FALLING_CAPS = [
  { left: "8%", size: 42, duration: 9, delay: 0, body: C.white, brim: C.gray },
  { left: "22%", size: 30, duration: 7, delay: 1.4, body: C.gray, brim: C.white },
  { left: "40%", size: 50, duration: 11, delay: 0.6, body: C.white, brim: C.charcoal },
  { left: "62%", size: 34, duration: 8, delay: 2.2, body: C.charcoal, brim: C.white },
  { left: "78%", size: 46, duration: 10, delay: 0.9, body: C.white, brim: C.gray },
  { left: "90%", size: 28, duration: 7.5, delay: 1.8, body: C.gray, brim: C.white },
];

function CapIcon({ body, brim }) {
  return (
    <svg viewBox="0 0 240 160" className="w-full h-full" aria-hidden="true">
      <ellipse cx="120" cy="112" rx="104" ry="14" fill="#00000014" />
      <path d="M18 96 Q120 8 222 96 L222 104 Q120 128 18 104 Z" fill={body} stroke={C.ink} strokeWidth="1" />
      <path d="M14 104 Q120 132 226 104 L238 116 Q120 148 2 116 Z" fill={brim} stroke={C.ink} strokeWidth="1" />
      <line x1="120" y1="16" x2="120" y2="96" stroke="#00000022" strokeWidth="2" />
      <line x1="70" y1="30" x2="88" y2="98" stroke="#00000018" strokeWidth="1.5" />
      <line x1="170" y1="30" x2="152" y2="98" stroke="#00000018" strokeWidth="1.5" />
      <circle cx="120" cy="16" r="7" fill={brim} stroke={C.ink} strokeWidth="1.5" />
    </svg>
  );
}
export default function App() {
  const [entered, setEntered] = useState(false);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [lastOrderId, setLastOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", city: "", address: "" });

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [detailQty, setDetailQty] = useState(1);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setProducts(data.map((p, i) => ({ ...p, ...DISPLAY_STYLES[i % DISPLAY_STYLES.length] })));
        }
      })
      .catch(() => {});
  }, []);

const loadOrders = async (secret) => {
    setOrdersLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/orders`, { headers: { "x-admin-secret": secret || adminPasswordInput } });
      if (r.status === 401) {
        setOrders([]);
        setOrdersLoading(false);
        return false;
      }
      const data = await r.json();
      setOrders(Array.isArray(data) ? data : []);
      setOrderCount(Array.isArray(data) ? data.length : 0);
      setOrdersLoading(false);
      return true;
    } catch (e) {
      setOrders([]);
      setOrdersLoading(false);
      return false;
    }
  };

  const openAdmin = () => {
    setAdminOpen(true);
    if (adminUnlocked) loadOrders();
  };

  const submitAdminPassword = async () => {
    const ok = await loadOrders(adminPasswordInput);
    if (ok) setAdminUnlocked(true);
    else setToast("Mot de passe incorrect");
  };

  const addToCart = (product) => {
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
    setToast(`${product.name} — ajoutée`);
    window.clearTimeout(window.__ucToastTimer);
    window.__ucToastTimer = window.setTimeout(() => setToast(null), 1800);
  };

  const changeQty = (id, delta) => {
    setCart((c) => {
      const next = { ...c };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const cartItems = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty })).filter((i) => i.product),
    [cart, products]
  );
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

  const formValid = customer.name.trim() && customer.phone.trim() && customer.city.trim() && customer.address.trim();

  const submitOrder = async () => {
    if (!formValid || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerCity: customer.city,
          customerAddr: customer.address,
          paymentMethod: "cod",
          items: cartItems.map((i) => ({ productId: i.product.id, quantity: i.qty })),
        }),
      });
      if (!res.ok) throw new Error("Échec de la commande");
      const order = await res.json();
      setLastOrderId(order.id);
      setCheckoutStep("confirmed");
      setToast("Commande confirmée !");
      setOrderCount((n) => n + 1);
      window.setTimeout(() => {
        setCheckoutStep("cart");
        setCart({});
        setCartOpen(false);
        setCustomer({ name: "", phone: "", city: "", address: "" });
      }, 2600);
    } catch (e) {
      setToast("Erreur — réessaie dans un instant");
    }
    setSubmitting(false);
  };
  return (
    <div style={{ fontFamily: "'Archivo', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Archivo:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        .uc-serif { font-family: 'Fraunces', serif; }
        .uc-mono { font-family: 'Space Mono', monospace; letter-spacing: 0.08em; }
        .grain { position: absolute; inset: 0; opacity: 0.05; pointer-events: none; background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 3px 3px; }
        .fade-in { animation: fadeIn 1.1s ease both; }
        .fade-scale { animation: fadeScale 1.4s ease both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeScale { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        .invert-card { transition: background 0.25s ease, color 0.25s ease; }
        .invert-card:hover { background: ${C.ink}; color: ${C.white}; }
        .invert-card:hover .uc-price, .invert-card:hover .uc-taglabel { color: ${C.white}; }
        .invert-card:hover .uc-btn { background: ${C.white}; color: ${C.ink}; }
        .badge-ring { animation: spin-slow 16s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .fall-cap { position: absolute; top: -12%; animation-name: fallDown; animation-iteration-count: infinite; animation-timing-function: ease-in; opacity: 0; }
        @keyframes fallDown { 0% { transform: translateY(0) translateX(0) rotate(6deg); opacity: 0; } 12% { opacity: 0.9; } 50% { transform: translateY(58vh) translateX(-2vw) rotate(-8deg); } 88% { opacity: 0.8; } 100% { transform: translateY(118vh) translateX(2vw) rotate(10deg); opacity: 0; } }
        .spin-stage { perspective: 900px; }
        .spin-cap { animation: spin3d 5s linear infinite; transform-style: preserve-3d; }
        @keyframes spin3d { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        .logo-white { filter: invert(1) brightness(2); }
        @media (prefers-reduced-motion: reduce) { .fade-in, .fade-scale, .badge-ring, .fall-cap, .spin-cap { animation: none; } .fall-cap { display: none; } }
      `}</style>

      {!entered && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden" style={{ background: C.ink, color: C.white }}>
          <div className="grain" />
          {FALLING_CAPS.map((cap, i) => (
            <div key={i} className="fall-cap" style={{ left: cap.left, width: cap.size, height: cap.size * 0.7, animationDuration: `${cap.duration}s`, animationDelay: `${cap.delay}s` }}>
              <CapIcon body={cap.body} brim={cap.brim} />
            </div>
          ))}
          <div className="fade-scale flex flex-col items-center text-center px-6 relative z-10">
            <span className="uc-mono text-[10px] mb-5" style={{ color: C.gray }}>MAISON DE CASQUETTES</span>
            <img src={logo} alt="Urban Caps" className="logo-white w-64 md:w-80 mb-2" />
            <div className="w-16 h-px my-6" style={{ background: C.gray }} />
            <p className="uc-mono text-xs mb-10 max-w-xs" style={{ color: C.gray }}>OÙ LE STREETWEAR RENCONTRE LE SUR-MESURE</p>
            <button onClick={() => setEntered(true)} className="uc-mono text-xs px-8 py-3 border flex items-center gap-3" style={{ borderColor: C.white }}>
              ENTRER <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {entered && (
        <div className="fade-in" style={{ background: C.white, color: C.ink, minHeight: "100vh" }}>
          <header className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 py-4" style={{ background: C.white, borderBottom: `1px solid ${C.grayLine}` }}>
            <img src={logo} alt="Urban Caps" className="h-9 md:h-10" />
            <nav className="hidden md:flex gap-8 uc-mono text-[11px] uppercase" style={{ color: C.charcoal }}>
              <a href="#collection" className="hover:opacity-60">Collection</a>
              <button onClick={() => setManifestoOpen(true)} className="hover:opacity-60">Maison</button>
              <a href="#contact" className="hover:opacity-60">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={openAdmin} className="relative flex items-center justify-center w-9 h-9 border" style={{ borderColor: C.ink }}>
                <Bell size={16} />
                {orderCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: C.charcoal, color: C.white }}>{orderCount}</span>}
              </button>
              <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-4 py-2 border" style={{ borderColor: C.ink }}>
                <ShoppingBag size={16} />
                <span className="uc-mono text-[11px] hidden sm:inline">PANIER</span>
                {itemCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: C.ink, color: C.white }}>{itemCount}</span>}
              </button>
            </div>
          </header>

          <section className="grid md:grid-cols-2 gap-10 items-center px-6 md:px-12 py-16 md:py-28 max-w-6xl mx-auto">
            <div>
              <span className="uc-mono text-[11px]" style={{ color: C.gray }}>COLLECTION 04 — MONOCHROME</span>
              <h2 className="uc-serif italic text-4xl md:text-6xl leading-[1.05] my-6">L'art du<br />couvre-chef</h2>
              <p className="max-w-md mb-8" style={{ color: C.charcoal }}>Des lignes épurées, des matières nobles, un esprit rue. Chaque casquette est pensée comme une pièce de vestiaire, pas un accessoire.</p>
              <a href="#collection" className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3" style={{ background: C.ink, color: C.white }}>VOIR LA COLLECTION <ArrowRight size={14} /></a>
            </div>
            <div className="relative flex items-center justify-center py-8">
              <div className="badge-ring absolute w-40 h-40 rounded-full flex items-center justify-center uc-mono text-[9px] text-center" style={{ border: `1px solid ${C.ink}`, color: C.charcoal }}>URBAN CAPS · ÉDITION LIMITÉE · URBAN CAPS ·</div>
              <div className="w-56 h-40 md:w-72 md:h-52"><CapIcon body={C.ink} brim={C.white} /></div>
            </div>
          </section>

          <section id="collection" className="px-6 md:px-12 py-16" style={{ background: C.off }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-baseline justify-between mb-10">
                <h3 className="uc-serif italic text-3xl md:text-4xl">La collection</h3>
                <span className="uc-mono text-[11px]" style={{ color: C.gray }}>{products.length} PIÈCES</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} onClick={() => { setSelectedProduct(p); setDetailQty(1); }} className="invert-card relative p-5 cursor-pointer" style={{ background: C.white, border: `1px solid ${C.ink}` }}>
                    {p.badge && <div className="absolute top-3 right-3 uc-mono text-[9px] px-2 py-1" style={{ border: `1px solid ${C.gray}`, color: C.charcoal }}>{p.badge}</div>}
                    <div className="w-full h-32 mb-4 spin-stage flex items-center justify-center">
                      <div className="spin-cap w-full h-full"><CapIcon body={p.body} brim={p.brim} /></div>
                    </div>
                    <div className="uc-mono uc-taglabel text-[9px] mb-1" style={{ color: `${C.gray}99` }}>VUE 360°</div>
                    <div className="uc-mono uc-taglabel text-[10px] mb-1" style={{ color: C.gray }}>{p.tag}</div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-base">{p.name}</h4>
                      <span className="uc-mono uc-price text-sm">{p.price} DH</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="uc-btn w-full flex items-center justify-center gap-2 py-2.5 uc-mono text-[11px]" style={{ background: C.ink, color: C.white }}>
                      <Plus size={14} /> AJOUTER AU PANIER
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

         <section id="contact" className="px-6 md:px-12 py-16 md:py-24" style={{ background: C.ink, color: C.white }}>
            <div className="max-w-4xl mx-auto text-center">
              <span className="uc-mono text-[11px]" style={{ color: C.gray }}>UNE QUESTION ?</span>
              <h3 className="uc-serif italic text-3xl md:text-4xl my-6">Parlons-en directement.</h3>
              <p className="max-w-md mx-auto mb-10" style={{ color: `${C.white}bb` }}>
                Notre équipe répond rapidement sur WhatsApp. Suis-nous aussi sur Instagram pour voir les nouvelles pièces en premier.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                
                  href="https://wa.me/212718437511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3 w-full sm:w-auto justify-center"
                  style={{ background: C.white, color: C.ink }}
                >
                  <MessageCircle size={16} /> ÉCRIRE SUR WHATSAPP
                </a>
                
                  href="https://instagram.com/urbancaps.officiel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3 w-full sm:w-auto justify-center border"
                  style={{ borderColor: C.white, color: C.white }}
                >
                  <Instagram size={16} /> @URBANCAPS.OFFICIEL
                </a>
              </div>
            </div>
          </section>

          <footer className="px-6 md:px-12 py-6 uc-mono text-[11px]" style={{ background: C.ink, color: C.gray, borderTop: `1px solid ${C.charcoal}` }}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
              <span>© 2026 URBAN CAPS — MAISON DE CASQUETTES</span>
              <span>Site officiel</span>
            </div>
          </footer>

          {cartOpen && (
            <div className="fixed inset-0 z-40 flex justify-end">
              <div className="absolute inset-0" style={{ background: "#00000066" }} onClick={() => setCartOpen(false)} />
              <div className="relative w-full max-w-sm h-full flex flex-col" style={{ background: C.white, color: C.ink }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.grayLine}` }}>
                  <h3 className="uc-serif italic text-xl">Panier</h3>
                  <button onClick={() => setCartOpen(false)}><X size={22} /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {checkoutStep === "confirmed" ? (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.ink }}><Check size={28} color={C.white} /></div>
                      <p className="font-medium">Merci {customer.name.split(" ")[0] || ""}, commande confirmée !</p>
                      <p className="uc-mono text-[11px]" style={{ color: C.gray }}>N° {lastOrderId}</p>
                      <p className="uc-mono text-[11px] max-w-[220px]" style={{ color: C.gray }}>Paiement à la livraison · on te contacte au {customer.phone}</p>
                    </div>
                  ) : checkoutStep === "form" ? (
                    <div className="flex flex-col gap-4">
                      <button onClick={() => setCheckoutStep("cart")} className="flex items-center gap-1 uc-mono text-[11px]" style={{ color: C.gray }}><ChevronLeft size={14} /> Retour au panier</button>
                      <div className="flex flex-col gap-3">
                        <input value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} placeholder="Nom complet" className="w-full px-3 py-2 text-sm" style={{ border: `1px solid ${C.grayLine}` }} />
                        <input value={customer.phone} onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} placeholder="Téléphone" className="w-full px-3 py-2 text-sm" style={{ border: `1px solid ${C.grayLine}` }} />
                        <input value={customer.city} onChange={(e) => setCustomer((c) => ({ ...c, city: e.target.value }))} placeholder="Ville" className="w-full px-3 py-2 text-sm" style={{ border: `1px solid ${C.grayLine}` }} />
                        <textarea value={customer.address} onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))} placeholder="Adresse complète" rows={2} className="w-full px-3 py-2 text-sm resize-none" style={{ border: `1px solid ${C.grayLine}` }} />
                      </div>
                      <div className="uc-mono text-[10px] mt-2 mb-1" style={{ color: C.gray }}>MODE DE PAIEMENT</div>
                      <div className="flex items-center gap-3 px-3 py-3" style={{ border: `1px solid ${C.ink}`, background: C.off }}>
                        <Truck size={16} /><span className="flex-1 text-sm">Paiement à la livraison</span><Check size={14} />
                      </div>
                      <button onClick={submitOrder} disabled={!formValid || submitting} className="w-full py-3 uc-mono text-xs mt-2 disabled:opacity-40" style={{ background: C.ink, color: C.white }}>
                        {submitting ? "ENVOI..." : "CONFIRMER LA COMMANDE"}
                      </button>
                    </div>
                  ) : cartItems.length === 0 ? (
                    <p className="text-sm" style={{ color: C.gray }}>Ton panier est vide pour l'instant.</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {cartItems.map(({ product, qty }) => (
                        <div key={product.id} className="flex gap-3 items-center">
                          <div className="w-16 h-12 shrink-0"><CapIcon body={product.body} brim={product.brim} /></div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="uc-mono text-[11px]" style={{ color: C.gray }}>{product.price} DH</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => changeQty(product.id, -1)} className="w-7 h-7 flex items-center justify-center" style={{ border: `1px solid ${C.grayLine}` }}><Minus size={14} /></button>
                            <span className="uc-mono text-sm w-4 text-center">{qty}</span>
                            <button onClick={() => changeQty(product.id, 1)} className="w-7 h-7 flex items-center justify-center" style={{ border: `1px solid ${C.grayLine}` }}><Plus size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {checkoutStep === "cart" && cartItems.length > 0 && (
                  <div className="px-5 py-4" style={{ borderTop: `1px solid ${C.grayLine}` }}>
                    <div className="flex justify-between mb-4 uc-mono text-sm"><span>SOUS-TOTAL</span><span>{subtotal} DH</span></div>
                    <button onClick={() => setCheckoutStep("form")} className="w-full py-3 uc-mono text-xs" style={{ background: C.ink, color: C.white }}>PASSER COMMANDE</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {adminOpen && (
            <div className="fixed inset-0 z-40 flex justify-start">
              <div className="absolute inset-0" style={{ background: "#00000066" }} onClick={() => setAdminOpen(false)} />
              <div className="relative w-full max-w-sm h-full flex flex-col" style={{ background: C.white, color: C.ink }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.grayLine}` }}>
                  <div>
                    <h3 className="uc-serif italic text-xl">Commandes</h3>
                    <span className="uc-mono text-[10px]" style={{ color: C.gray }}>ESPACE ADMIN</span>
                  </div>
                  <button onClick={() => setAdminOpen(false)}><X size={22} /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {!adminUnlocked ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm" style={{ color: C.gray }}>Entre le mot de passe admin.</p>
                      <input
                        type="password"
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitAdminPassword()}
                        placeholder="Mot de passe"
                        className="w-full px-3 py-2 text-sm"
                        style={{ border: `1px solid ${C.grayLine}` }}
                      />
                      <button onClick={submitAdminPassword} className="w-full py-2.5 uc-mono text-xs" style={{ background: C.ink, color: C.white }}>
                        DÉVERROUILLER
                      </button>
                    </div>
                  ) : ordersLoading ? (
                    <p className="text-sm" style={{ color: C.gray }}>Chargement…</p>
                  ) : orders.length === 0 ? (
                    <p className="text-sm" style={{ color: C.gray }}>Aucune commande pour l'instant.</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((o) => (
                        <div key={o.id} className="p-3" style={{ border: `1px solid ${C.grayLine}` }}>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="uc-mono text-xs font-bold">{o.id}</span>
                            <span className="uc-mono text-[10px] px-2 py-0.5" style={{ background: C.off, color: C.charcoal }}>{o.status}</span>
                          </div>
                          <div className="text-sm font-medium">{o.customerName}</div>
                          <div className="text-xs mb-2" style={{ color: C.gray }}>{o.customerPhone} · {o.customerCity}</div>
                          <div className="text-xs mb-2" style={{ color: C.charcoal }}>{o.items?.map((it) => `${it.quantity}× ${it.product?.name}`).join(", ")}</div>
                          <div className="flex justify-between uc-mono text-xs"><span>Livraison</span><span className="font-bold">{o.subtotal} DH</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedProduct && (
            <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: C.white }}>
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-4" style={{ background: C.white, borderBottom: `1px solid ${C.grayLine}` }}>
                <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-1 uc-mono text-[11px]" style={{ color: C.charcoal }}>
                  <ChevronLeft size={16} /> RETOUR
                </button>
                <img src={logo} alt="Urban Caps" className="h-7" />
                <button onClick={() => setCartOpen(true)} className="relative flex items-center justify-center w-9 h-9 border" style={{ borderColor: C.ink }}>
                  <ShoppingBag size={16} />
                  {itemCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: C.ink, color: C.white }}>{itemCount}</span>}
                </button>
              </div>

              <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16">
                <div className="flex items-center justify-center spin-stage" style={{ background: C.off, minHeight: 320 }}>
                  <div className="spin-cap w-40 h-40 md:w-56 md:h-56">
                    <CapIcon body={selectedProduct.body} brim={selectedProduct.brim} />
                  </div>
                </div>

                <div>
                  <span className="uc-mono text-[11px]" style={{ color: C.gray }}>{selectedProduct.tag}</span>
                  <h1 className="uc-serif italic text-3xl md:text-4xl my-3">{selectedProduct.name}</h1>
                  <span className="uc-mono text-xl block mb-6">{selectedProduct.price} DH</span>

                  <div className="flex items-center gap-2 mb-6 uc-mono text-[11px] px-3 py-2" style={{ border: `1px solid ${C.ink}`, color: C.charcoal, width: "fit-content" }}>
                    <Truck size={14} /> LIVRAISON GRATUITE
                  </div>

                  <p className="mb-8 max-w-md" style={{ color: C.charcoal }}>{PRODUCT_DESCRIPTION}</p>

                  <div className="uc-mono text-[10px] mb-2" style={{ color: C.gray }}>QUANTITÉ</div>
                  <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => setDetailQty((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${C.grayLine}` }}>
                      <Minus size={14} />
                    </button>
                    <span className="uc-mono text-base w-6 text-center">{detailQty}</span>
                    <button onClick={() => setDetailQty((q) => q + 1)} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${C.grayLine}` }}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      for (let i = 0; i < detailQty; i++) addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3.5 uc-mono text-xs flex items-center justify-center gap-2"
                    style={{ background: C.ink, color: C.white }}
                  >
                    <Plus size={14} /> AJOUTER AU PANIER
                  </button>

                  <div className="mt-8 pt-6 uc-mono text-[10px] flex flex-col gap-2" style={{ borderTop: `1px solid ${C.grayLine}`, color: C.gray }}>
                    <span>MATIÈRE — {selectedProduct.tag}</span>
                    <span>PAIEMENT — À LA LIVRAISON</span>
                    <span>ÉCHANGE POSSIBLE SOUS 7 JOURS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {manifestoOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: C.ink, color: C.white }}>
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-4" style={{ background: C.ink, borderBottom: `1px solid ${C.charcoal}` }}>
                <button onClick={() => setManifestoOpen(false)} className="flex items-center gap-1 uc-mono text-[11px]" style={{ color: C.gray }}>
                  <ChevronLeft size={16} /> RETOUR
                </button>
                <span className="uc-mono text-[11px]" style={{ color: C.gray }}>MAISON</span>
                <div style={{ width: 70 }} />
              </div>

              <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-28">
                <span className="uc-mono text-[11px]" style={{ color: C.gray }}>DEPUIS TOUJOURS</span>
                <h1 className="uc-serif italic text-4xl md:text-6xl leading-[1.1] my-8">
                  Une casquette n'est pas<br />un accessoire.<br />C'est une posture.
                </h1>

                <div className="w-16 h-px my-10" style={{ background: C.charcoal }} />

                <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: `${C.white}dd` }}>
                  Urban Caps est née d'une conviction simple : le streetwear mérite la même
                  exigence que la haute couture. Chaque courbe, chaque point de couture,
                  chaque nuance de gris est pensée pour durer — pas pour une saison, mais
                  pour devenir une signature.
                </p>

                <p className="text-lg md:text-xl leading-relaxed mb-16" style={{ color: `${C.white}dd` }}>
                  Ici, pas de logo criard, pas de couleur qui date. Juste du noir, du blanc,
                  du gris — et une obsession pour les détails que peu de gens remarquent,
                  mais que tout le monde ressent.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <div>
                    <span className="uc-mono text-[11px]" style={{ color: C.gray }}>01 — MATIÈRE</span>
                    <p className="mt-3" style={{ color: `${C.white}cc` }}>
                      Coton twill, laine mélangée, velours côtelé. Rien n'est choisi au hasard.
                    </p>
                  </div>
                  <div>
                    <span className="uc-mono text-[11px]" style={{ color: C.gray }}>02 — FORME</span>
                    <p className="mt-3" style={{ color: `${C.white}cc` }}>
                      Une coupe précise, pensée pour flatter chaque visage, chaque style.
                    </p>
                  </div>
                  <div>
                    <span className="uc-mono text-[11px]" style={{ color: C.gray }}>03 — TEMPS</span>
                    <p className="mt-3" style={{ color: `${C.white}cc` }}>
                      Des pièces conçues pour être portées pendant des années, pas des mois.
                    </p>
                  </div>
                </div>

                <div className="w-16 h-px my-10" style={{ background: C.charcoal }} />

                <p className="uc-serif italic text-2xl md:text-3xl leading-snug mb-10">
                  "Le vrai luxe, c'est la discrétion qui en impose."
                </p>

                <button
                  onClick={() => { setManifestoOpen(false); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3"
                  style={{ background: C.white, color: C.ink }}
                >
                  DÉCOUVRIR LA COLLECTION <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {toast && (
          {toast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 uc-mono text-[11px] flex items-center gap-2" style={{ background: C.ink, color: C.white }}>
              <Check size={14} /> {toast}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
