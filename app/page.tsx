"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";
import { Search, Heart, ShoppingBag, Menu, X, ArrowUpRight, SlidersHorizontal, ChevronDown, ArrowRight, Check, Sparkles, UserRound } from "lucide-react";
import { products, categories, type Product } from "@/data/products";

type Lang = "en" | "hi";
const copy = {
 en: {top:"COMPLIMENTARY SHIPPING ON ORDERS OVER ₹2,999",new:"NEW SEASON / 2026",title:"A little less,\na lot more.",subtitle:"Thoughtful pieces. Better everyday dressing. Find your next forever favourite.",shop:"EXPLORE THE EDIT",discover:"THE NEW EDIT",discoverSub:"Fresh silhouettes, easy layers and pieces made to live in.",all:"VIEW ALL",featured:"MADE FOR YOUR EVERYDAY",featuredSub:"A considered wardrobe starts with the right essentials.",shopNow:"SHOP THE COLLECTION",newsletter:"Good things, occasionally.",newsletterSub:"A little inspiration, new arrivals and notes from our world.",email:"Your email address",join:"SIGN ME UP",footer:"Style that feels like you.",search:"Search pieces, categories...",allProducts:"All pieces",sort:"Sort by",recommended:"Recommended",low:"Price: low to high",high:"Price: high to low",empty:"No pieces found. Try another search.",added:"Added to your bag",bag:"Your bag",close:"Close",checkout:"Continue to demo checkout",demo:"DEMO STORE · NO REAL PAYMENT",subtotal:"Subtotal",saved:"Saved pieces",women:"WOMEN",men:"MEN",studio:"STUDIO",menu:"MENU",count:"pieces",filters:"FILTER",clear:"Clear",color:"Colour",price:"Price",quick:"QUICK VIEW",view:"DISCOVER PIECE",inBag:"IN BAG",size:"Select a size",add:"ADD TO BAG",addedWish:"Saved to wishlist",removeWish:"Removed from wishlist",newsletterThanks:"You're on the list — thank you!" },
 hi: {top:"₹2,999 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी",new:"नया सीज़न / 2026",title:"कम में भी,\nबहुत कुछ।",subtitle:"सोच-समझकर चुने गए कपड़े। रोज़मर्रा के लिए बेहतर स्टाइल। अपना अगला पसंदीदा पीस खोजें।",shop:"कलेक्शन देखें",discover:"नया कलेक्शन",discoverSub:"नए सिल्हूट, आसान लेयर्स और हर दिन पहनने के लिए खास पीस।",all:"सभी देखें",featured:"आपके हर दिन के लिए",featuredSub:"एक बेहतरीन वॉर्डरोब सही एसेंशियल से शुरू होता है।",shopNow:"कलेक्शन खरीदें",newsletter:"अच्छी बातें, कभी-कभी।",newsletterSub:"थोड़ी प्रेरणा, नए कलेक्शन और हमारी दुनिया की बातें।",email:"अपना ईमेल पता",join:"जुड़ें",footer:"ऐसा स्टाइल जो आप जैसा लगे।",search:"पीस या कैटेगरी खोजें...",allProducts:"सभी पीस",sort:"क्रम",recommended:"सुझाए गए",low:"कीमत: कम से ज़्यादा",high:"कीमत: ज़्यादा से कम",empty:"कोई पीस नहीं मिला। दूसरी खोज आज़माएँ।",added:"बैग में जोड़ा गया",bag:"आपका बैग",close:"बंद करें",checkout:"डेमो चेकआउट पर जाएँ",demo:"डेमो स्टोर · कोई असली भुगतान नहीं",subtotal:"कुल",saved:"सेव किए गए पीस",women:"महिलाएँ",men:"पुरुष",studio:"स्टूडियो",menu:"मेन्यू",count:"पीस",filters:"फ़िल्टर",clear:"हटाएँ",color:"रंग",price:"कीमत",quick:"जल्दी देखें",view:"पीस देखें",inBag:"बैग में",size:"साइज़ चुनें",add:"बैग में जोड़ें",addedWish:"विशलिस्ट में सेव किया",removeWish:"विशलिस्ट से हटाया",newsletterThanks:"धन्यवाद! आप हमारी लिस्ट में हैं।" }
};

function money(value:number){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value)}
function productSlug(p:Product){return p.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function ProductCard({p,lang,wished,onWish,onAdd,onOpen}:{p:Product;lang:Lang;wished:boolean;onWish:()=>void;onAdd:()=>void;onOpen:()=>void}){
 const t=copy[lang];
 return <article className="product-card">
  <div className="product-image" style={{backgroundColor:p.tone}} onClick={onOpen} role="button" tabIndex={0} aria-label={p.name}>
   <img src={p.image} alt={lang==="hi"?p.hi:p.name} loading="lazy"/>
   {p.badge&&<span className="badge">{p.badge}</span>}
   <button className={"wish-button "+(wished?"is-wished":"")} onClick={e=>{e.stopPropagation();onWish()}} aria-label={wished?"Remove from wishlist":"Add to wishlist"}><Heart size={17} fill={wished?"currentColor":"none"}/></button>
   <button className="quick-add" onClick={e=>{e.stopPropagation();onAdd()}}>{t.quick} <ArrowUpRight size={14}/></button>
  </div>
  <div className="product-meta"><div><span className="product-category">{lang==="hi"?p.categoryHi:p.category}</span><h3 onClick={onOpen}>{lang==="hi"?p.hi:p.name}</h3><span className="product-color">{p.color}</span></div><div className="product-prices"><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div></div>
 </article>
}
export default function Home(){
 const [lang,setLang]=useState<Lang>("en"); const [query,setQuery]=useState(""); const [category,setCategory]=useState("All"); const [sort,setSort]=useState("recommended");
 const [wishlist,setWishlist]=useState<number[]>([]); const [cart,setCart]=useState<number[]>([]); const [drawer,setDrawer]=useState<"cart"|"wishlist"|"menu"|null>(null);
 const [authUserId,setAuthUserId]=useState<string|null>(null); const [databaseProductIds,setDatabaseProductIds]=useState<Record<number,string>>({}); const [accountItemsReady,setAccountItemsReady]=useState(false);
 const [selected,setSelected]=useState<Product|null>(null); const [notice,setNotice]=useState(""); const [newsletterEmail,setNewsletterEmail]=useState(""); const [subscribed,setSubscribed]=useState(false); const [authOpen,setAuthOpen]=useState(false);
 const t=copy[lang];
 const supabase=getSupabaseBrowserClient();
 const visible=useMemo(()=>{let list=products.filter(p=>(category==="All"||category==="New in"&&p.tag==="new"||category==="Clothing"&&["Shirts","T-shirts","Trousers","Dresses","Knitwear","Outerwear","Skirts","Denim"].includes(p.category)||p.category===category)&&((p.name+" "+p.hi+" "+p.category+" "+p.categoryHi).toLowerCase().includes(query.toLowerCase()))); if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);return list},[category,query,sort]);
 const total=cart.reduce((sum,id)=>sum+(products.find(p=>p.id===id)?.price||0),0);
 const flash=(text:string)=>{setNotice(text);window.setTimeout(()=>setNotice(""),2600)};
 useEffect(()=>{
  if(!supabase)return;
  let active=true;
  let revision=0;
  const restoreAccountItems=async(userId:string|null)=>{
   const requestRevision=++revision;
   setAuthUserId(userId);
   if(!userId){
    setCart([]);setWishlist([]);setDatabaseProductIds({});setAccountItemsReady(true);
    return;
   }
   setAccountItemsReady(false);
   setCart([]);setWishlist([]);setDatabaseProductIds({});
   try{
    const {data:catalog,error:catalogError}=await supabase.from("sm_products").select("id,slug").eq("status","active");
    if(catalogError)throw catalogError;
    const localIdBySlug:Record<string,number>={};
    products.forEach(p=>{localIdBySlug[productSlug(p)]=p.id});
    const localToDatabase:Record<number,string>={};
    const slugByDatabaseId:Record<string,string>={};
    (catalog||[]).forEach((row:{id:string;slug:string})=>{
     slugByDatabaseId[row.id]=row.slug;
     const localId=localIdBySlug[row.slug];
     if(localId!==undefined)localToDatabase[localId]=row.id;
    });
    const [wishResult,cartResult]=await Promise.all([
     supabase.from("sm_wishlists").select("product_id").eq("user_id",userId),
     supabase.from("sm_cart_items").select("product_id,quantity").eq("user_id",userId)
    ]);
    if(wishResult.error)throw wishResult.error;
    if(cartResult.error)throw cartResult.error;
    if(!active||requestRevision!==revision)return;
    const restoredWishlist=(wishResult.data||[]).map((row:{product_id:string})=>localIdBySlug[slugByDatabaseId[row.product_id]||""]).filter((id:number|undefined):id is number=>typeof id==="number");
    const restoredCart:number[]=[];
    (cartResult.data||[]).forEach((row:{product_id:string;quantity:number})=>{
     const localId=localIdBySlug[slugByDatabaseId[row.product_id]||""];
     if(localId!==undefined)for(let i=0;i<Math.min(row.quantity,99);i++)restoredCart.push(localId);
    });
    setDatabaseProductIds(localToDatabase);
    setWishlist(Array.from(new Set(restoredWishlist)));
    setCart(restoredCart);
    setAccountItemsReady(true);
   }catch(error){
    if(!active||requestRevision!==revision)return;
    setAccountItemsReady(true);
    setNotice(lang==="hi"?"आपकी सेव की गई कार्ट/फेवरेट सूची लोड नहीं हो सकी। कृपया फिर प्रयास करें।":"Could not load your saved bag and favourites. Please try again.");
    console.error("Could not restore Shopping Mart account items",error);
   }
  };
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
   const userId=session?.user?.id??null;
   void Promise.resolve().then(()=>restoreAccountItems(userId));
  });
  void supabase.auth.getSession().then(({data,error})=>{
   if(!error&&active)void restoreAccountItems(data.session?.user?.id??null);
  });
  return()=>{active=false;subscription.unsubscribe()};
 },[supabase,lang]);
 const persistCart=async(nextCart:number[])=>{
  if(!supabase||!authUserId)return;
  if(!accountItemsReady)throw new Error("Account items are still loading");
  const counts=new Map<string,number>();
  nextCart.forEach(localId=>{
   const databaseId=databaseProductIds[localId];
   if(databaseId)counts.set(databaseId,(counts.get(databaseId)||0)+1);
  });
  const rows=Array.from(counts.entries()).map(([product_id,quantity])=>({user_id:authUserId,product_id,quantity,updated_at:new Date().toISOString()}));
  if(rows.length){
   const {error}=await supabase.from("sm_cart_items").upsert(rows,{onConflict:"user_id,product_id"});
   if(error)throw error;
  }
  const {data:existing,error:readError}=await supabase.from("sm_cart_items").select("product_id").eq("user_id",authUserId);
  if(readError)throw readError;
  const activeIds=new Set(rows.map(row=>row.product_id));
  const stale=(existing||[]).map((row:{product_id:string})=>row.product_id).filter(id=>!activeIds.has(id));
  if(stale.length){
   const {error}=await supabase.from("sm_cart_items").delete().eq("user_id",authUserId).in("product_id",stale);
   if(error)throw error;
  }
 };
 const add=(p:Product)=>{
  if(authUserId&&!accountItemsReady){flash(lang==="hi"?"आपकी सेव सूची लोड हो रही है। एक पल बाद फिर प्रयास करें।":"Your saved items are still loading. Please try again in a moment.");return}
  const next=[...cart,p.id];setCart(next);
  if(authUserId)void persistCart(next).catch(error=>{console.error("Could not save Shopping Mart cart",error);setCart(cart);flash(lang==="hi"?"कार्ट सेव नहीं हो सकी। फिर प्रयास करें।":"Could not save your bag. Please try again.")});
  flash(t.added);
 };
 const toggleWish=(p:Product)=>{
  if(authUserId&&!accountItemsReady){flash(lang==="hi"?"आपकी सेव सूची लोड हो रही है। एक पल बाद फिर प्रयास करें।":"Your saved items are still loading. Please try again in a moment.");return}
  const has=wishlist.includes(p.id);
  const next=has?wishlist.filter(id=>id!==p.id):[...wishlist,p.id];
  setWishlist(next);
  if(authUserId&&supabase){
   const product_id=databaseProductIds[p.id];
   if(!product_id){setWishlist(wishlist);flash(lang==="hi"?"यह प्रोडक्ट सेव नहीं हो सका।":"This product could not be saved.");return}
   const request=has
    ?supabase.from("sm_wishlists").delete().eq("user_id",authUserId).eq("product_id",product_id)
    :supabase.from("sm_wishlists").upsert({user_id:authUserId,product_id},{onConflict:"user_id,product_id"});
   void request.then(({error})=>{
    if(error){console.error("Could not save Shopping Mart wishlist",error);setWishlist(wishlist);flash(lang==="hi"?"फेवरेट सेव नहीं हुआ। फिर प्रयास करें।":"Could not save your favourites. Please try again.")}
   });
  }
  flash(has?t.removeWish:t.addedWish);
 };
 const removeCartItem=(index:number)=>{
  const next=cart.filter((_,itemIndex)=>itemIndex!==index);
  setCart(next);
  if(authUserId)void persistCart(next).catch(error=>{console.error("Could not update Shopping Mart cart",error);setCart(cart);flash(lang==="hi"?"कार्ट अपडेट नहीं हुई। फिर प्रयास करें।":"Could not update your bag. Please try again.")});
 };
 return <main lang={lang} id="top">
  <div className="announcement"><span>{t.top}</span><span className="announcement-right">NEW YORK · LONDON · EVERYWHERE</span></div>
  <header className="site-header">
   <button className="icon-button mobile-menu" onClick={()=>setDrawer("menu")} aria-label="Open menu"><Menu/></button>
   <nav className="main-nav"><button onClick={()=>{setCategory("Clothing");document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>{t.women}</button><button onClick={()=>{setCategory("Clothing");document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>{t.men}</button><button onClick={()=>{setCategory("New in");document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>{t.studio}</button></nav>
   <a className="wordmark" href="#" aria-label="Shopping Mart home">SHOPPING<span> MART</span><i>®</i></a>
   <div className="header-actions"><button className="language-switch" onClick={()=>setLang(lang==="en"?"hi":"en")}>{lang==="en"?"हिंदी":"EN"} <ChevronDown size={13}/></button><button className="icon-button account-trigger" onClick={()=>setAuthOpen(true)} aria-label={lang==="hi"?"लॉगिन या अकाउंट":"Log in or open account"} title={lang==="hi"?"लॉगिन / अकाउंट":"Log in / Account"}><UserRound/></button><button className="icon-button search-toggle" onClick={()=>document.getElementById("product-search")?.focus()} aria-label="Search"><Search/></button><button className="icon-button desktop-wish" onClick={()=>setDrawer("wishlist")} aria-label="Wishlist"><Heart/><sup>{wishlist.length}</sup></button><button className="icon-button bag-trigger" onClick={()=>setDrawer("cart")} aria-label="Shopping bag"><ShoppingBag/><sup>{cart.length}</sup></button></div>
  </header>
  <section className="hero">
   <div className="hero-image"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2200&q=90" alt="Editorial fashion model in a contemporary outfit"/></div>
   <div className="hero-shade"></div><div className="hero-copy"><p className="eyebrow">{t.new}</p><h1>{t.title.split("\n").map((line,i)=><span key={i}>{line}</span>)}</h1><p className="hero-subtitle">{t.subtitle}</p><button className="button button-light" onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}>{t.shop}<ArrowRight size={16}/></button><span className="hero-index">01 — 03</span></div>
   <div className="hero-caption"><span>FORM / FUNCTION / FEELING</span><span>VOL. 01 — THE EVERYDAY EDIT</span></div>
  </section>
  <section className="category-strip"><span>DESIGNED FOR REAL LIFE</span><div><button onClick={()=>setCategory("New in")}>New arrivals <ArrowUpRight size={13}/></button><button onClick={()=>setCategory("Clothing")}>Everyday essentials <ArrowUpRight size={13}/></button><button onClick={()=>setCategory("Accessories")}>Finishing touches <ArrowUpRight size={13}/></button></div></section>
  <section className="shop-section" id="shop">
   <div className="section-heading"><div><p className="eyebrow">{t.discover}</p><h2>{t.featured}</h2><p>{t.discoverSub}</p></div><a href="#products">{t.all} <ArrowRight size={15}/></a></div>
   <div className="shop-toolbar"><div className="category-tabs">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c==="All"?t.allProducts:c}</button>)}</div><div className="shop-controls"><label className="search-field"><Search size={15}/><input id="product-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search"><X size={13}/></button>}</label><label className="sort-control"><SlidersHorizontal size={15}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label={t.sort}><option value="recommended">{t.recommended}</option><option value="low">{t.low}</option><option value="high">{t.high}</option></select></label></div></div>
   <div className="results-line"><span>{category==="All"?t.allProducts:category}</span><span>{visible.length.toString().padStart(2,"0")} {t.count}</span></div>
   <div className="product-grid" id="products">{visible.map((p,i)=><div className="reveal" style={{animationDelay:(i%4)*65+"ms"}} key={p.id}><ProductCard p={p} lang={lang} wished={wishlist.includes(p.id)} onWish={()=>toggleWish(p)} onAdd={()=>add(p)} onOpen={()=>setSelected(p)}/></div>)}</div>
   {!visible.length&&<div className="empty-state"><Sparkles size={24}/><p>{t.empty}</p><button className="text-link" onClick={()=>{setQuery("");setCategory("All")}}>{t.clear}</button></div>}
   <div className="center-cta"><button className="button button-dark" onClick={()=>{setCategory("All");setQuery("")}}>{t.all} <ArrowRight size={16}/></button></div>
  </section>
  <section className="manifesto" id="about"><div className="manifesto-photo"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85" alt="Fashion editorial showcasing contemporary everyday outfits"/></div><div className="manifesto-copy"><p className="eyebrow">THE SHOPPING MART POINT OF VIEW</p><h2>Less noise.<br/><em>More meaning.</em></h2><p>We believe getting dressed should feel simple. Pieces with considered details, easy combinations and a place in your wardrobe beyond one season.</p><button className="text-link" onClick={()=>document.getElementById("newsletter")?.scrollIntoView({behavior:"smooth"})}>{t.shopNow} <ArrowRight size={15}/></button><span className="manifesto-mark">SM / 001</span></div></section>
  <section className="newsletter" id="newsletter"><div><p className="eyebrow">A NOTE FROM US</p><h2>{t.newsletter}</h2><p>{t.newsletterSub}</p></div><form onSubmit={e=>{e.preventDefault();if(newsletterEmail.includes("@")){setSubscribed(true);setNewsletterEmail("")}}}><input type="email" required value={newsletterEmail} onChange={e=>setNewsletterEmail(e.target.value)} placeholder={t.email}/><button type="submit" aria-label={t.join}><ArrowRight/></button>{subscribed&&<small>{t.newsletterThanks}</small>}</form></section>
  <footer className="site-footer" id="footer">
   <div className="footer-main">
    <div className="footer-brand">
     <a className="wordmark footer-logo" href="#top" aria-label="Shopping Mart home">SHOPPING<span> MART</span><i>®</i></a>
     <p className="footer-tagline">{t.footer}</p>
     <p className="footer-intro">{lang==="hi"?"रोज़मर्रा के लिए सोच-समझकर चुने गए एसेंशियल्स और आधुनिक डिज़ाइन।":"Considered essentials and modern silhouettes for everyday life."}</p>
    </div>
    <div className="footer-column">
     <h3>{lang==="hi"?"शॉप":"SHOP"}</h3>
     <a href="#shop" onClick={()=>setCategory("All")}>{lang==="hi"?"सभी प्रोडक्ट":"All pieces"}</a>
     <a href="#shop" onClick={()=>setCategory("New in")}>{lang==="hi"?"नए प्रोडक्ट":"New arrivals"}</a>
     <a href="#shop" onClick={()=>setCategory("Shirts")}>{lang==="hi"?"शर्ट":"Shirts"}</a>
     <a href="#shop" onClick={()=>setCategory("Trousers")}>{lang==="hi"?"ट्राउज़र":"Trousers"}</a>
     <a href="#shop" onClick={()=>setCategory("Dresses")}>{lang==="hi"?"ड्रेस":"Dresses"}</a>
     <a href="#shop" onClick={()=>setCategory("Accessories")}>{lang==="hi"?"एक्सेसरीज़":"Accessories"}</a>
    </div>
    <div className="footer-column">
     <h3>{lang==="hi"?"जानें":"DISCOVER"}</h3>
     <a href="#about">{lang==="hi"?"हमारी सोच":"Our point of view"}</a>
     <a href="#about">{lang==="hi"?"रोज़मर्रा का एडिट":"The everyday edit"}</a>
     <a href="#newsletter">{lang==="hi"?"न्यूज़लेटर":"Newsletter"}</a>
     <a href="#shop" onClick={()=>setCategory("New in")}>{lang==="hi"?"नया सीज़न":"New season"}</a>
    </div>
    <div className="footer-column footer-help">
     <h3>{lang==="hi"?"सहायता व जानकारी":"HELP & INFORMATION"}</h3>
     <a href="#newsletter">{lang==="hi"?"संपर्क व अपडेट":"Contact & updates"}</a>
     <button type="button" onClick={()=>flash(lang==="hi"?"यह डेमो स्टोर है। वास्तविक ऑर्डर और भुगतान सक्रिय नहीं हैं।":"This is a demo store. Real orders and payments are not enabled.")}>{lang==="hi"?"डेमो स्टोर की जानकारी":"Demo store information"}</button>
     <span className="footer-demo-note">{lang==="hi"?"डेमो चेकआउट · वास्तविक भुगतान नहीं":"Demo checkout · no real payments"}</span>
    </div>
   </div>
   <div className="footer-bottom"><small>© 2026 SHOPPING MART</small><span>{lang==="hi"?"सोच-समझकर चुनी गई रोज़मर्रा की स्टाइल":"STYLE THAT FEELS LIKE YOU."}</span><small>{lang==="hi"?"डेमो स्टोर · भुगतान सक्रिय नहीं":"DEMO STORE · PAYMENTS NOT ENABLED"}</small></div>
  </footer>
  <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} lang={lang}/>
  {notice&&<div className="toast"><Check size={16}/>{notice}</div>}
  {drawer&&<div className="overlay" onClick={()=>setDrawer(null)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h2>{drawer==="cart"?t.bag:drawer==="wishlist"?t.saved:t.menu}</h2><button className="icon-button" onClick={()=>setDrawer(null)} aria-label={t.close}><X/></button></div>{drawer==="menu"?<div className="drawer-menu">{["New in","Clothing","Shirts","T-shirts","Trousers","Dresses","Knitwear","Shoes","Accessories"].map(c=><button key={c} onClick={()=>{setCategory(c);setDrawer(null);document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>{c}<ArrowRight size={16}/></button>)}<button onClick={()=>setLang(lang==="en"?"hi":"en")}>{lang==="en"?"हिंदी में देखें":"Switch to English"}</button></div>:<>{(drawer==="cart"?cart:wishlist).length===0?<div className="drawer-empty"><ShoppingBag size={27}/><p>{drawer==="cart"?"Your bag is taking a little breather.":"Your saved edit will appear here."}</p><button className="button button-dark" onClick={()=>{setDrawer(null);document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>DISCOVER PIECES</button></div>:<div className="drawer-items">{(drawer==="cart"?cart:wishlist).map((id,i)=>{const p=products.find(x=>x.id===id);if(!p)return null;return <div className="drawer-item" key={id+"-"+i}><img src={p.image} alt={p.name}/><div><b>{lang==="hi"?p.hi:p.name}</b><span>{p.color}</span><strong>{money(p.price)}</strong><button onClick={()=>drawer==="cart"?removeCartItem(i):toggleWish(p)}>REMOVE</button></div></div>})}</div>}{drawer==="cart"&&cart.length>0&&<div className="drawer-bottom"><div><span>{t.subtotal}</span><strong>{money(total)}</strong></div><p>{t.demo}</p><button className="button button-dark full" onClick={()=>{setDrawer(null);setNotice("Demo checkout only — payment is not enabled.")}}>{t.checkout}<ArrowRight size={15}/></button></div>}</>}</aside></div>}
  {selected&&<div className="overlay" onClick={()=>setSelected(null)}><section className="quick-view" onClick={e=>e.stopPropagation()}><button className="icon-button modal-close" onClick={()=>setSelected(null)} aria-label={t.close}><X/></button><div className="quick-image" style={{backgroundColor:selected.tone}}><img src={selected.image} alt={selected.name}/></div><div className="quick-info"><p className="eyebrow">{lang==="hi"?selected.categoryHi:selected.category}</p><h2>{lang==="hi"?selected.hi:selected.name}</h2><strong>{money(selected.price)}</strong><p>Thoughtful details, versatile styling and a considered finish. Designed to be worn on repeat.</p><label className="size-select">{t.size}<select defaultValue=""><option value="" disabled>Choose size</option>{["XS","S","M","L","XL"].map(s=><option key={s}>{s}</option>)}</select></label><button className="button button-dark full" onClick={()=>{add(selected);setSelected(null)}}>{t.add}<ShoppingBag size={16}/></button><button className="text-link" onClick={()=>toggleWish(selected)}><Heart size={15}/> {t.saved}</button></div></section></div>}
 </main>
}
