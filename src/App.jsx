import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Check, ArrowRight, Bell, Truck, ChevronLeft, MessageCircle, Instagram, Music2 } from "lucide-react";
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
  { id: 1, name: "LA CAP GRIS", tag: "COTON TWILL", price: 170, size: "57,7cm", body: C.ink, brim: C.white, badge: "ÉDITION LIMITÉE", category: "NEW ERA", description: "Minimaliste et moderne, cette casquette New Era LA gris clair est idéale pour compléter un look casual ou streetwear. Son modèle fermé à l’arrière (Fitted) garantit un excellent confort et une finition haut de gamme.", image: "/cap-1.png" },
  { id: 2, name: "NY CAP BLACK", tag: "COTON TWILL", price: 170, size: "57,7cm", body: C.charcoal, brim: C.ink, badge: null, category: "NEW ERA", description: "Affiche un style intemporel avec cette casquette New Era NY noire. Son logo brodé en blanc apporte une touche élégante, tandis que sa coupe fermée à l’arrière (Fitted) assure un maintien parfait et un confort optimal au quotidien.", image: "/cap-2.png" },
  { id: 3, name: "LA CAP FULL BLACK", tag: "COTON TWILL", price: 170, size: "57,7cm", body: C.white, brim: C.ink, badge: "BEST-SELLER", category: "NEW ERA", description: "Opte pour un style sobre et élégant avec cette casquette New Era LA Total Black. Son logo noir ton sur ton lui donne un look premium, tandis que sa conception fermée à l’arrière (Fitted) assure un ajustement parfait et un confort durable.", image: "/cap-3.png" },
  { id: 4, name: "LA CAP BLACK STARS", tag: "COTON TWILL", price: 170, size: "57,7cm", body: C.gray, brim: C.ink, badge: null, category: "NEW ERA", description: "Inspirée de l’univers du baseball, cette casquette New Era LA All-Star noire se distingue par sa broderie originale et ses finitions premium. Son design fermé à l’arrière (Fitted) offre un ajustement précis et un look authentique.", image: "/cap-4.png" },
  { id: 5, name: "LORO PIANA CREAM", tag: "COTON LAVÉ", price: 199, size: "M", body: C.ink, brim: C.gray, badge: null, category: "LORO PIANA", description: "Élégante et raffinée, cette casquette Loro Piana beige apporte une touche de luxe discret à toutes vos tenues. Son design épuré, sa visière courbée et sa fermeture ajustable garantissent confort et style au quotidien.", image: "/cap-5.png" },
  { id: 6, name: "LORO PIANA NAVY BLUE", tag: "COTON LAVÉ", price: 199, size: "M", body: C.white, brim: C.ink, badge: "BEST-SELLER", category: "LORO PIANA", description: "Élégante et intemporelle, la casquette Loro Piana Bleu Marine allie confort et raffinement. Confectionnée avec une finition soignée, elle présente un design épuré, un logo brodé discret et une fermeture ajustable à l’arrière pour un maintien parfait. Son coloris bleu marine s’accorde facilement avec toutes vos tenues, pour un style chic et décontracté au quotidien.", image: "/cap-6.png" },
  { id: 7, name: "LORO PIANA BURGUNDY", tag: "COTON LAVÉ", price: 199, size: "M", body: C.charcoal, brim: C.white, badge: null, category: "LORO PIANA", description: "Affirmez votre style avec cette casquette Loro Piana bordeaux au design élégant. Sa teinte profonde, sa visière courbée et sa fermeture ajustable offrent un parfait équilibre entre confort, qualité et sophistication.", image: "/cap-7.png" },
  { id: 8, name: "LORO PIANA CAMEL BROWN", tag: "COTON LAVÉ", price: 199, size: "M", body: C.ink, brim: C.white, badge: "ÉDITION LIMITÉE", category: "LORO PIANA", description: "Avec sa couleur camel intemporelle et ses finitions soignées, cette casquette Loro Piana est idéale pour un look chic et décontracté. Légère, confortable et ajustable, elle s’adapte parfaitement à toutes les occasions.", image: "/cap-8.png" },
  { id: 9, name: "GUCCI BLACK 1-1", tag: "LAINE MÉLANGÉE", price: 299, size: "M", body: C.ink, brim: C.gray, badge: "ÉDITION LIMITÉE", category: "GUCCI", description: "Apportez une touche de luxe à votre style avec la casquette Gucci Dubai Noire. Son design moderne, sa finition premium et son logo brodé en font un accessoire élégant et polyvalent. Dotée d'une fermeture ajustable à l'arrière, elle garantit un confort optimal pour un usage quotidien.", image: "/cap-9.png" },
  { id: 10, name: "GUCCI GREEN 1-1", tag: "LAINE MÉLANGÉE", price: 299, size: "M", body: C.charcoal, brim: C.ink, badge: null, category: "GUCCI", description: "Affirmez votre style avec la casquette Gucci Dubai Verte. Son coloris vert raffiné, associé à une finition haut de gamme et un logo brodé, offre un look à la fois tendance et sophistiqué. Grâce à sa fermeture ajustable à l'arrière, elle s'adapte parfaitement à toutes les morphologies.", image: "/cap-10.png" },
  { id: 11, name: "POLO CAP LAVENDER", tag: "MAILLE TECHNIQUE", price: 160, size: "Ajustable", body: C.white, brim: C.charcoal, badge: null, category: "POLO", description: "Ajoutez une touche de couleur à votre tenue avec la casquette Polo Mauve. Son design élégant, son logo brodé emblématique et sa finition soignée en font un accessoire idéal pour un style décontracté et raffiné. Sa fermeture ajustable à l'arrière assure un confort optimal au quotidien.", image: "/cap-11.png" },
  { id: 12, name: "POLO CAP LIGHT BLUE", tag: "MAILLE TECHNIQUE", price: 160, size: "Ajustable", body: C.gray, brim: C.white, badge: null, category: "POLO", soldOut: true, description: "Optez pour un look frais et moderne avec la casquette Polo Bleu Ciel. Conçue avec des matériaux de qualité, elle se distingue par son logo brodé, sa finition premium et sa fermeture ajustable à l'arrière pour un ajustement parfait. Un indispensable pour compléter toutes vos tenues avec élégance.", image: "/cap-12.png" },
];
const CATEGORIES = ["TOUS", "NEW ERA", "LORO PIANA", "GUCCI", "POLO"];



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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("TOUS");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const match = window.location.pathname.match(/^\/produit\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      const found = FALLBACK_PRODUCTS.find((p) => p.id === id);
      if (found) { setSelectedProduct(found); setEntered(true); }
    }
  }, []);
  useEffect(() => {
    // Le backend n'a que 6 produits pour l'instant — on garde les 12 en local en attendant.
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
    if (window.fbq) window.fbq("track", "AddToCart", { content_name: product.name, value: product.price, currency: "MAD" });
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
  const filteredProducts = activeCategory === "TOUS" ? products : products.filter((p) => p.category === activeCategory);
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

  const formValid = customer.name.trim() && customer.phone.trim() && customer.city.trim();

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
      if (window.fbq) window.fbq("track", "Purchase", { value: subtotal, currency: "MAD" });
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
        .logo-spin { animation: spin-logo 8s linear infinite; }
        @keyframes spin-logo { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
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
              <div className="w-56 md:w-72"><img src="/logo-000.PNG" alt="Urban Caps" className="w-full h-auto logo-spin" /></div>
            </div>
          </section>

          <section id="collection" className="px-6 md:px-12 py-16" style={{ background: C.off }}>
            <div className="max-w-6xl mx-auto">
             <div className="mb-10">
                <h3 className="uc-serif italic text-3xl md:text-4xl mb-6">La collection</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="uc-mono text-[10px] px-4 py-2"
                      style={{
                        background: activeCategory === cat ? C.ink : "transparent",
                        color: activeCategory === cat ? C.white : C.charcoal,
                        border: `1px solid ${activeCategory === cat ? C.ink : C.grayLine}`,
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} onClick={() => { setSelectedProduct(p); setDetailQty(1); setActiveImage(0); window.history.pushState({}, "", `/produit/${p.id}`); }} className="invert-card relative p-6 cursor-pointer rounded-2xl" style={{ background: C.white, border: `1px solid ${C.grayLine}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", opacity: p.soldOut ? 0.55 : 1 }}>
                    {p.soldOut ? (
                      <div className="absolute top-3 right-3 uc-mono text-[9px] px-2 py-1" style={{ background: C.ink, color: C.white }}>ÉPUISÉ</div>
                    ) : p.badge && (
                      <div className="absolute top-3 right-3 uc-mono text-[9px] px-2 py-1" style={{ border: `1px solid ${C.gray}`, color: C.charcoal }}>{p.badge}</div>
                    )}
                    <div className="w-full h-64 mb-4 flex items-center justify-center overflow-hidden rounded-xl">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-contain" /> : <CapIcon body={p.body} brim={p.brim} />}
                    </div>
                    <div className="uc-mono uc-taglabel text-[10px] mb-1" style={{ color: C.gray }}>{p.tag}</div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-base">{p.name}</h4>
                      <span className="uc-mono uc-price text-sm">{p.price} DH</span>
                    </div>
                    {p.soldOut ? (
                      <button disabled className="w-full flex items-center justify-center gap-2 py-3 uc-mono text-[11px] rounded-full cursor-not-allowed" style={{ background: C.grayLine, color: C.gray }}>
                        RUPTURE DE STOCK
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="uc-btn w-full flex items-center justify-center gap-2 py-3 uc-mono text-[11px] rounded-full" style={{ background: C.ink, color: C.white }}>
                        <Plus size={14} /> AJOUTER AU PANIER
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

         <section id="contact" className="px-6 md:px-12 py-16 md:py-24" style={{ background: C.ink, color: C.white }}>
            <div className="max-w-4xl mx-auto text-center">
              <span className="uc-mono text-[11px]" style={{ color: C.gray }}>UNE QUESTION ?</span>
              <h3 className="uc-serif italic text-3xl md:text-4xl my-6">Parlons-en directement.</h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="https://wa.me/212774626438" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3" style={{ background: C.white, color: C.ink }}><MessageCircle size={16} /> WHATSAPP</a>
                <a href="https://instagram.com/urbancaps.officiel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3 border" style={{ borderColor: C.white, color: C.white }}><Instagram size={16} /> INSTAGRAM</a>
                <a href="https://tiktok.com/@urban.caps9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 uc-mono text-xs px-6 py-3 border" style={{ borderColor: C.white, color: C.white }}><Music2 size={16} /> TIKTOK</a>
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
                <button onClick={() => { setSelectedProduct(null); window.history.pushState({}, "", "/"); }} className="flex items-center gap-1 uc-mono text-[11px]" style={{ color: C.charcoal }}>
                  <ChevronLeft size={16} /> RETOUR
                </button>
                <img src={logo} alt="Urban Caps" className="h-7" />
                <button onClick={() => setCartOpen(true)} className="relative flex items-center justify-center w-9 h-9 border" style={{ borderColor: C.ink }}>
                  <ShoppingBag size={16} />
                  {itemCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ background: C.ink, color: C.white }}>{itemCount}</span>}
                </button>
              </div>

              <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16">
                <div className="flex items-center justify-center overflow-hidden rounded-xl" style={{ background: C.off, minHeight: 320 }}>
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-40 h-40 md:w-56 md:h-56"><CapIcon body={selectedProduct.body} brim={selectedProduct.brim} /></div>
                  )}
                </div>

                <div>
                  <span className="uc-mono text-[11px]" style={{ color: C.gray }}>{selectedProduct.tag}</span>
                  <h1 className="uc-serif italic text-3xl md:text-4xl my-3">{selectedProduct.name}</h1>
                  <span className="uc-mono text-xl block mb-6">{selectedProduct.price} DH</span>

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 uc-mono text-[11px] px-3 py-2" style={{ border: `1px solid ${C.ink}`, color: C.charcoal }}>
                      <Truck size={14} /> LIVRAISON GRATUITE
                    </div>
                    <div className="uc-mono text-[11px] px-3 py-2" style={{ border: `1px solid ${C.grayLine}`, color: C.gray }}>
                      TAILLE — {selectedProduct.size}
                    </div>
                  </div>

                  <p className="mb-8 max-w-md" style={{ color: C.charcoal }}>{selectedProduct.description || PRODUCT_DESCRIPTION}</p>
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
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 uc-mono text-[11px] flex items-center gap-2" style={{ background: C.ink, color: C.white }}>
              <Check size={14} /> {toast}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
