import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { PRODUCTS, CATEGORIES, CATEGORY_HI } from "./products.mjs";

const SUPABASE_URL = "https://dbenwifjhdqhiznowncs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-x_VjXiyIL7j_dz7b7AgQQ_jv_Wj4dq";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const fallbackProducts = PRODUCTS.map((product) => ({ ...product }));
function writeStorageLanguage(lang){try{localStorage.setItem("sm_lang",lang);}catch(error){console.warn("Language preference not stored",error);}}
function readGuest(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value ?? fallback; }
  catch { return fallback; }
}
function saveGuest(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn("Local cart storage is unavailable", error); }
}
function loadGuestCart() {
  const value = readGuest("sm_guest_cart", []);
  return Array.isArray(value)
    ? value.filter(item => Number.isInteger(item?.id) && Number.isInteger(item?.qty) && item.qty > 0)
      .map(item => ({ id:item.id, qty:Math.min(99,item.qty), variantId:String(item.variantId || ""), size:String(item.size || "") }))
    : [];
}
function loadGuestWishlist() {
  const value = readGuest("sm_guest_wishlist", []);
  return Array.isArray(value) ? [...new Set(value.map(Number).filter(Number.isInteger))] : [];
}
function loadUserWishlist(userId) {
  const value = readGuest("sm_user_wishlist_" + userId, []);
  return Array.isArray(value) ? [...new Set(value.map(Number).filter(Number.isInteger))] : [];
}

const state = { lang: readGuest("sm_lang","en")==="hi"?"hi":"en", category: "All", query: "", sort: "recommended", user: null, cart: loadGuestCart(), cartRevision: 0, wishlist: loadGuestWishlist(), dbIds: {}, products: fallbackProducts };

const words = {
  en: {
    top:"COMPLIMENTARY SHIPPING ON ORDERS OVER ₹2,999", new:"NEW SEASON / 2026", shopAll:"SHOP ALL", announcementRight:"INDIA · EVERYDAY ESSENTIALS", captionLeft:"FORM / FUNCTION / FEELING", captionRight:"VOL. 01 — THE EVERYDAY EDIT", newsletterEyebrow:"A NOTE FROM US", wishlistNav:"Wishlist", bagNav:"Your bag", accountNav:"Account", viewFullBag:"VIEW FULL BAG", viewFullWishlist:"VIEW FULL WISHLIST", stockAvailable:"IN STOCK",
    title1:"A little less,", title2:"a lot more.", subtitle:"Thoughtful pieces. Better everyday dressing. Find your next forever favourite.",
    shop:"EXPLORE THE EDIT", shopNow:"SHOP THE COLLECTION", discover:"THE NEW EDIT", featured:"MADE FOR YOUR EVERYDAY",
    discoverSub:"Fresh silhouettes, easy layers and pieces made to live in.", all:"VIEW ALL",
    newsletter:"Good things, occasionally.", newsletterSub:"A little inspiration, new arrivals and notes from our world.",
    email:"Your email address", join:"SIGN ME UP", footer:"Style that feels like you.",
    search:"Search pieces, categories...", allProducts:"All pieces", recommended:"Recommended",
    low:"Price: low to high", high:"Price: high to low", empty:"No pieces found. Try another search.",
    added:"Added to your bag", bag:"Your bag", close:"Close", checkout:"Continue to demo checkout",
    demo:"DEMO STORE · NO REAL PAYMENT", subtotal:"Subtotal", saved:"Saved pieces",
    women:"WOMEN", men:"MEN", studio:"STUDIO", newArrivalsNav:"NEW IN", menu:"MENU", count:"pieces",
    filters:"FILTER", clear:"Clear", color:"Colour", price:"Price", quick:"QUICK VIEW",
    view:"DISCOVER PIECE", inBag:"IN BAG", size:"Select a size", add:"ADD TO BAG",
    addedWish:"Saved to wishlist", removeWish:"Remove from wishlist",
    signIn:"SIGN IN", create:"CREATE ACCOUNT", name:"Full name", quantityShort:"Qty", wishlistNav:"Wishlist", bagNav:"Your bag", accountNav:"Account", password:"Password",
    logout:"SIGN OUT", save:"SAVE CHANGES", signed:"Signed in successfully.",
    needLogin:"Sign in to save your bag and favourites.", emptyCart:"Your bag is empty.",
    emptyWish:"No saved pieces yet.", emailConfirm:"Check your email to confirm your account.",
    footerIntro:"Considered essentials and modern silhouettes for everyday life.", footerShop:"SHOP",
    newArrivals:"New arrivals", searchNav:"Search", aboutNav:"About us", shirts:"Shirts", trousers:"Trousers", dresses:"Dresses",
    accessories:"Accessories", footerDiscover:"DISCOVER", ourView:"Our point of view",
    everydayEdit:"The everyday edit", newsletterLink:"Newsletter", newSeason:"New season",
    footerHelp:"HELP & INFORMATION", contact:"Contact & updates", demoInfo:"Demo store information",
    demoNote:"Demo checkout · no real payments", demoDisclaimer:"DEMO STORE · PAYMENTS NOT ENABLED",
    strip:"DESIGNED FOR REAL LIFE", arrivals:"New arrivals", essentials:"Everyday essentials",
    finishing:"Finishing touches", viewPoint:"THE SHOPPING MART POINT OF VIEW",
    manifestoTitle:"Less noise.", manifestoEm:"More meaning.",
    manifestoBody:"We believe getting dressed should feel simple. Pieces with considered details, easy combinations and a place in your wardrobe beyond one season.",
    newsletterEyebrow:"A NOTE FROM US", signedOut:"Signed out successfully.",
    demoCheckout:"This demo does not process payments.", newsletterDemo:"Newsletter signup is not connected in this demo.",
    remove:"REMOVE", categoryAll:"All pieces", menuTitle:"Browse categories"
  },
  hi: {
    top:"₹2,999 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी", new:"नया सीज़न / 2026", shopAll:"सभी प्रोडक्ट", announcementRight:"भारत · रोज़मर्रा का स्टाइल", captionLeft:"फॉर्म / फंक्शन / एहसास", captionRight:"वॉल्यूम 01 — हर दिन का कलेक्शन", newsletterEyebrow:"हमारी ओर से एक नोट", wishlistNav:"विशलिस्ट", bagNav:"आपका बैग", accountNav:"अकाउंट", viewFullBag:"पूरा बैग देखें", viewFullWishlist:"पूरी विशलिस्ट देखें", stockAvailable:"स्टॉक में",
    title1:"कम में भी,", title2:"बहुत कुछ।", subtitle:"सोच-समझकर चुने गए कपड़े। रोज़मर्रा के लिए बेहतर स्टाइल। अपना अगला पसंदीदा पीस खोजें।",
    shop:"कलेक्शन देखें", shopNow:"कलेक्शन खरीदें", discover:"नया कलेक्शन", featured:"आपके हर दिन के लिए",
    discoverSub:"नए सिल्हूट, आसान लेयर्स और हर दिन पहनने के लिए खास पीस।", all:"सभी देखें",
    newsletter:"अच्छी बातें, कभी-कभी।", newsletterSub:"थोड़ी प्रेरणा, नए कलेक्शन और हमारी दुनिया की बातें।",
    email:"अपना ईमेल पता", join:"जुड़ें", footer:"ऐसा स्टाइल जो आप जैसा लगे।",
    search:"पीस या कैटेगरी खोजें...", allProducts:"सभी पीस", recommended:"सुझाए गए",
    low:"कीमत: कम से ज़्यादा", high:"कीमत: ज़्यादा से कम", empty:"कोई पीस नहीं मिला। दूसरी खोज आज़माएँ।",
    added:"बैग में जोड़ा गया", bag:"आपका बैग", close:"बंद करें", checkout:"डेमो चेकआउट पर जाएँ",
    demo:"डेमो स्टोर · कोई असली भुगतान नहीं", subtotal:"कुल", saved:"सेव किए गए पीस",
    women:"महिलाएँ", men:"पुरुष", studio:"स्टूडियो", newArrivalsNav:"नए प्रोडक्ट", menu:"मेन्यू", count:"पीस",
    filters:"फ़िल्टर", clear:"हटाएँ", color:"रंग", price:"कीमत", quick:"जल्दी देखें",
    view:"पीस देखें", inBag:"बैग में", size:"साइज़ चुनें", add:"बैग में जोड़ें",
    addedWish:"फेवरेट में सेव किया", removeWish:"फेवरेट से हटाएँ",
    signIn:"लॉगिन", create:"अकाउंट बनाएँ", name:"पूरा नाम", quantityShort:"मात्रा", wishlistNav:"विशलिस्ट", bagNav:"आपका बैग", accountNav:"अकाउंट", password:"पासवर्ड",
    logout:"लॉगआउट", save:"बदलाव सेव करें", signed:"लॉगिन सफल हुआ।",
    needLogin:"बैग और फेवरेट सेव करने के लिए लॉगिन करें।", emptyCart:"आपका बैग खाली है।",
    emptyWish:"अभी कोई फेवरेट सेव नहीं है।", emailConfirm:"अकाउंट की पुष्टि के लिए अपना ईमेल देखें।",
    footerIntro:"रोज़मर्रा की ज़िंदगी के लिए चुने हुए एसेंशियल और आधुनिक स्टाइल।", footerShop:"खरीदें",
    newArrivals:"नए प्रोडक्ट", searchNav:"खोजें", aboutNav:"हमारे बारे में", shirts:"शर्ट", trousers:"ट्राउज़र", dresses:"ड्रेस",
    accessories:"एक्सेसरीज़", footerDiscover:"जानें", ourView:"हमारा नज़रिया",
    everydayEdit:"हर दिन का कलेक्शन", newsletterLink:"न्यूज़लेटर", newSeason:"नया सीज़न",
    footerHelp:"सहायता और जानकारी", contact:"संपर्क और अपडेट", demoInfo:"डेमो स्टोर की जानकारी",
    demoNote:"डेमो चेकआउट · वास्तविक भुगतान नहीं", demoDisclaimer:"डेमो स्टोर · भुगतान उपलब्ध नहीं",
    strip:"वास्तविक ज़िंदगी के लिए डिज़ाइन", arrivals:"नए प्रोडक्ट", essentials:"रोज़मर्रा के एसेंशियल",
    finishing:"आख़िरी टच", viewPoint:"SHOPPING MART का नज़रिया",
    manifestoTitle:"कम शोर।", manifestoEm:"ज़्यादा मायने।",
    manifestoBody:"हम मानते हैं कि कपड़े पहनना आसान होना चाहिए। सोच-समझकर चुने गए विवरण और ऐसे पीस जो एक सीज़न से आगे भी आपके वॉर्डरोब का हिस्सा रहें।",
    newsletterEyebrow:"हमारी ओर से एक नोट", signedOut:"सफलतापूर्वक लॉगआउट हुआ।",
    demoCheckout:"इस डेमो में भुगतान नहीं होता।", newsletterDemo:"इस डेमो में न्यूज़लेटर साइनअप अभी कनेक्ट नहीं है।",
    remove:"हटाएँ", categoryAll:"सभी पीस", menuTitle:"कैटेगरी चुनें"
  }
};
const t = () => words[state.lang];
function defaultVariant(productId) {
  const product=state.products.find(item=>item.id===Number(productId));
  return product?.variants?.find(variant=>variant.stock_quantity>0)||product?.variants?.[0]||null;
}
function localVariants(product) {
  const sizes = product.category === "Shoes"
    ? ["6","7","8","9","10"]
    : product.category === "Accessories"
      ? ["One size"]
      : ["XS","S","M","L","XL"];
  return sizes.map(size => ({
    id: "local-" + product.id + "-" + size.toLowerCase().replace(/[^a-z0-9]+/g,"-"),
    size_label: size,
    stock_quantity: 10,
    sku: "DEMO-" + product.slug + "-" + size
  }));
}
function useLocalCatalogue() {
  state.products = fallbackProducts.map(product => ({...product, variants:localVariants(product)}));
  state.dbIds = {};
  state.cart = state.cart.map(item => {
    const product = state.products.find(candidate => candidate.id === item.id);
    const variant = product?.variants.find(candidate => candidate.id === item.variantId || candidate.size_label === item.size) || defaultVariant(item.id);
    if (!product || !variant) return null;
    return {...item, variantId:variant.id, size:item.size || variant.size_label, qty:Math.min(99,variant.stock_quantity,Math.max(1,Number(item.qty)||1))};
  }).filter(Boolean);
  if (!state.user) saveGuest("sm_guest_cart",state.cart);
}
const money = value => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(Number(value || 0));
const esc = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[character]);

function toast(message) {
  const box = $("#toast");
  if (!box) return;
  $("#toast-message").textContent = message;
  box.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { box.hidden = true; }, 2800);
}
function productName(product) { return state.lang === "hi" ? (product.hi || product.name) : product.name; }
function productCategory(product) { return state.lang === "hi" ? (product.categoryHi || CATEGORY_HI[product.category] || product.category) : product.category; }
function productBadge(product){if(state.lang!=="hi")return product.badge||"";return ({BESTSELLER:"सबसे लोकप्रिय","JUST IN":"नया आया",NEW:"नया"})[product.badge]||product.badge||"";}

function renderCategories() {
  const element = $("#category-tabs");
  if (!element) return;
  element.innerHTML = CATEGORIES.map(category => '<button type="button" data-pick-category="' + esc(category) + '" class="' + (state.category === category ? "active" : "") + '">' + esc(state.lang === "hi" ? (CATEGORY_HI[category] || category) : category) + "</button>").join("");
}
function visibleProducts() {
  let filtered = state.products.filter(product => {
    const query = state.query.toLocaleLowerCase();
    const textMatch = !query || [product.name, product.hi, product.category, product.categoryHi, product.color, product.colorHi].some(value => String(value || "").toLocaleLowerCase().includes(query));
    const categoryMatch = state.category === "All" ||
      (state.category === "New in" ? product.tag === "new" :
       state.category === "Clothing" ? !["Accessories", "Shoes"].includes(product.category) : product.category === state.category);
    return textMatch && categoryMatch;
  });
  if (state.sort === "low") filtered.sort((a,b) => a.price - b.price);
  if (state.sort === "high") filtered.sort((a,b) => b.price - a.price);
  return filtered;
}
function renderProducts() {
  const products=visibleProducts(),grid=$("#product-grid");if(!grid)return;
  grid.innerHTML=products.map(product=>
    '<article class="product-card reveal"><div class="product-image" style="background-color:'+esc(product.tone||"#e9e5dd")+'">'+
    '<a class="product-image-link" href="/product.html?slug='+encodeURIComponent(product.slug)+'" aria-label="'+esc(t().view+" "+productName(product))+'"><img loading="lazy" src="'+esc(product.image)+'" alt="'+esc(productName(product))+'"></a>'+
    (product.badge?'<span class="badge">'+esc(productBadge(product))+"</span>":"")+
    '<button class="wish-button '+(state.wishlist.includes(product.id)?"is-wished":"")+'" data-wish="'+product.id+'" type="button" aria-label="'+esc(t().wishlistNav)+'" title="'+esc(t().wishlistNav)+'">♥</button>'+
    '<button class="quick-add" data-quick="'+product.id+'" type="button"><span>'+esc(t().quick)+'</span><span>↗</span></button></div>'+
    '<div class="product-meta"><div><span class="product-category">'+esc(productCategory(product))+'</span><a class="product-name-link" href="/product.html?slug='+encodeURIComponent(product.slug)+'"><h3>'+esc(productName(product))+'</h3></a><span class="product-color">'+esc(state.lang==="hi"?(product.colorHi||product.color||""):(product.color||""))+'</span></div>'+
    '<div class="product-prices"><b>'+money(product.price)+'</b>'+(product.oldPrice?'<del>'+money(product.oldPrice)+'</del>':"")+'</div></div>'+
    '<button class="product-add" data-add="'+product.id+'" data-choose-size="true" type="button"><span>'+esc(t().add)+'</span><span>＋</span></button></article>'
  ).join("");
  $("#empty-state").hidden=products.length>0;
  $("#result-count").textContent=products.length+" "+t().count.toUpperCase();
  $("#result-category").textContent=state.lang==="hi"?(CATEGORY_HI[state.category]||state.category):(state.category==="All"?t().categoryAll:state.category);
  $("#cart-count").textContent=state.cart.reduce((sum,row)=>sum+row.qty,0);
  $("#wishlist-count").textContent=state.wishlist.length;
  $("#clear-search").hidden=!state.query;
}
function setLanguage() {
  writeStorageLanguage(state.lang);
  document.documentElement.lang = state.lang;
  const main = $("main[lang]");
  if (main) main.lang = state.lang;
  const announcementRight = $(".announcement-right");
  if (announcementRight) announcementRight.textContent = t().announcementRight;
  const heroCaptions = $$(".hero-caption span");
  if (heroCaptions[0]) heroCaptions[0].textContent = t().captionLeft;
  if (heroCaptions[1]) heroCaptions[1].textContent = t().captionRight;
  const newsletterEyebrow = $("#newsletter .eyebrow");
  if (newsletterEyebrow) newsletterEyebrow.textContent = t().newsletterEyebrow;
  $$("[data-copy]").forEach(element => {
    const key = element.dataset.copy;
    if (t()[key]) element.textContent = t()[key];
  });
  const search = $("#product-search");
  if (search) { search.placeholder = t().search; search.setAttribute("aria-label", t().search); }
  const email = $("#newsletter-email");
  if (email) { email.placeholder = t().email; email.setAttribute("aria-label", t().email); }
  const signup = $("#newsletter-form button[type=submit]");
  if (signup) signup.setAttribute("aria-label", t().join);
  const language = $("#language-switch");
  if (language) language.innerHTML = (state.lang === "en" ? "हिंदी" : "English") + ' <span data-icon="chevron-down"></span>';
  const heroTitle = $("#hero-title");
  if (heroTitle) heroTitle.innerHTML = "<span>" + esc(t().title1) + "</span><span>" + esc(t().title2) + "</span>";
  const sort = $("#sort-select");
  if (sort) {
    [...sort.options].forEach(option => {
      if (t()[option.value]) option.textContent = t()[option.value];
    });
  }
  const strip = $(".category-strip > span");
  if (strip) strip.textContent = t().strip;
  const stripLabels = [t().arrivals, t().essentials, t().finishing];
  $$(".category-strip > div button").forEach((button, index) => {
    const icon = button.querySelector("[data-icon]");
    button.textContent = stripLabels[index] || button.textContent;
    if (icon) { button.append(" "); button.append(icon); }
  });
  const manifesto = $("#about .manifesto-copy");
  if (manifesto) {
    const eyebrow = manifesto.querySelector(".eyebrow");
    const title = manifesto.querySelector("h2");
    const body = manifesto.querySelector("p:not(.eyebrow)");
    if (eyebrow) eyebrow.textContent = t().viewPoint;
    if (title) title.innerHTML = esc(t().manifestoTitle) + "<br><em>" + esc(t().manifestoEm) + "</em>";
    if (body) body.textContent = t().manifestoBody;
  }
  renderCategories();
  renderProducts();
  refreshIcons();
}

const iconPaths = {
  search:'<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path>',
  bag:'<path d="M5 8h14l1 13H4L5 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
  user:'<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
  "chevron-down":'<path d="m6 9 6 6 6-6"></path>',
  "arrow-right":'<path d="M4 12h16"></path><path d="m13 5 7 7-7 7"></path>',
  "arrow-up-right":'<path d="M7 17 17 7"></path><path d="M7 7h10v10"></path>',
  sliders:'<path d="M4 6h16M4 12h16M4 18h16"></path><circle cx="8" cy="6" r="2"></circle><circle cx="15" cy="12" r="2"></circle><circle cx="10" cy="18" r="2"></circle>',
  x:'<path d="m6 6 12 12M18 6 6 18"></path>',
  check:'<path d="m5 12 4 4L19 6"></path>',
  sparkles:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"></path><path d="m19 14 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"></path>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"></path>'
};
function refreshIcons() {
  document.querySelectorAll("[data-icon]").forEach(element => {
    const path = iconPaths[element.dataset.icon];
    if (path) element.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  });
}

async function loadCatalogue() {
  try {
    const {data,error}=await supabase.from("sm_products")
      .select("id,slug,name_en,name_hi,price_inr,compare_at_price_inr,colour_en,colour_hi,status,featured")
      .eq("status","active");
    if(error)throw error;
    if(!Array.isArray(data)||!data.length){useLocalCatalogue();return;}
    const localBySlug=Object.fromEntries(fallbackProducts.map(product=>[product.slug,product]));
    state.products=data.map((row,index)=>{
      const fallback=localBySlug[row.slug]||{};
      return {...fallback,id:Number.isInteger(fallback.id)?fallback.id:index+100,dbId:row.id,slug:row.slug,
        name:row.name_en||fallback.name||row.slug,hi:row.name_hi||fallback.hi||row.name_en||row.slug,
        price:Number(row.price_inr??fallback.price??0),oldPrice:row.compare_at_price_inr??fallback.oldPrice,
        color:row.colour_en||fallback.color||"",colorHi:row.colour_hi||fallback.color||"",
        tag:fallback.tag||(row.featured?"new":"popular"),tone:fallback.tone||"#e9e5dd",
        image:fallback.image||"/images/editorial-detail.svg",category:fallback.category||"Clothing",
        categoryHi:fallback.categoryHi||"कपड़े",badge:fallback.badge,variants:[]};
    });
    const databaseSlugs = new Set(state.products.map(product=>product.slug));
    state.products.push(...fallbackProducts.filter(product=>!databaseSlugs.has(product.slug)).map(product=>({...product,variants:localVariants(product)})));
    const {data:variants,error:variantError}=await supabase.from("sm_variants").select("id,product_id,size_label,stock_quantity,sku");
    if(variantError)throw variantError;
    const byProduct=new Map();
    (variants||[]).forEach(variant=>{
      if(!byProduct.has(variant.product_id))byProduct.set(variant.product_id,[]);
      byProduct.get(variant.product_id).push({id:variant.id,size_label:variant.size_label,stock_quantity:Number(variant.stock_quantity)||0,sku:variant.sku});
    });
    const order=["XS","S","M","L","XL","XXL","One size"];
    state.products.forEach(product=>{
      if(product.dbId) product.variants=(byProduct.get(product.dbId)||[]).sort((a,b)=>order.indexOf(a.size_label)-order.indexOf(b.size_label));
      else if(!product.variants?.length) product.variants=localVariants(product);
    });
    state.cart=state.cart.map(item=>{
      const variant=(item.variantId&&state.products.find(p=>p.id===item.id)?.variants?.find(v=>v.id===item.variantId))||defaultVariant(item.id);
      if(variant&&variant.stock_quantity<=0)return null;
      const quantity=variant?Math.min(Math.max(1,Number(item.qty)||1),variant.stock_quantity):Math.max(1,Number(item.qty)||1);
      return {...item,qty:quantity,variantId:variant?.id||item.variantId||"local-default",size:item.size||variant?.size_label||"One size"};
    }).filter(Boolean);
    if(!state.user)saveGuest("sm_guest_cart",state.cart);
  } catch(error) {
    console.error("Catalogue fallback active; Supabase product/variant read failed",error);
    useLocalCatalogue();
  }
}

let restoreUserSequence = 0;
async function restoreUser(user) {
  const restoreSequence = ++restoreUserSequence;
  const cartRevisionAtStart = state.cartRevision;
  state.user=user||null;
  if(!user){
    state.cart=loadGuestCart().map(item=>{
      const variant=(item.variantId&&state.products.find(p=>p.id===item.id)?.variants?.find(v=>v.id===item.variantId))||defaultVariant(item.id);
      return {...item,variantId:variant?.id||item.variantId||"local-default",size:item.size||variant?.size_label||"One size"};
    });
    state.wishlist=loadGuestWishlist();state.dbIds={};renderProducts();return;
  }
  try{
    const [productsResult,wishesResult,cartResult]=await Promise.all([
      supabase.from("sm_products").select("id,slug").eq("status","active"),
      supabase.from("sm_wishlists").select("product_id").eq("user_id",user.id),
      supabase.from("sm_cart_items").select("product_id,variant_id,quantity").eq("user_id",user.id)
    ]);
    if(productsResult.error)throw productsResult.error;
    if(wishesResult.error)throw wishesResult.error;
    if(cartResult.error)throw cartResult.error;
    // Auth events and the explicit sign-in handler can both call restoreUser.
    // Ignore stale responses so an older empty-cart response cannot overwrite the latest session state.
    if (restoreSequence !== restoreUserSequence || state.user?.id !== user.id) return;
    const idBySlug=Object.fromEntries(state.products.map(p=>[p.slug,p.id]));
    const slugByDatabaseId=Object.fromEntries((productsResult.data||[]).map(row=>[row.id,row.slug]));
    state.dbIds=Object.fromEntries((productsResult.data||[]).map(row=>[idBySlug[row.slug],row.id]).filter(([localId])=>Number.isInteger(localId)));
    const guestWishlist=loadGuestWishlist(),guestCart=loadGuestCart(),accountWishlist=loadUserWishlist(user.id);
    const accountCart=readGuest("sm_user_cart_"+user.id,[]);
    const recoveryCart=Array.isArray(accountCart)?accountCart.filter(item=>Number.isInteger(item?.id)&&Number.isInteger(item?.qty)&&item.qty>0):[];
    state.wishlist=[...new Set([...(wishesResult.data||[]).map(row=>idBySlug[slugByDatabaseId[row.product_id]]).filter(Number.isInteger),...guestWishlist,...accountWishlist])];
    const variantById=Object.fromEntries(state.products.flatMap(product=>(product.variants||[]).map(variant=>[variant.id,{...variant,productId:product.id}])));
    const quantities=new Map();
    const addQuantity=(localId,variantId,qty,size)=>{
      if(!Number.isInteger(localId))return;
      const variant=variantById[variantId]||defaultVariant(localId);if(!variant)return;
      const key=localId+":"+variant.id,previous=quantities.get(key);
      quantities.set(key,{id:localId,variantId:variant.id,size:size||variant.size_label,qty:Math.min(99,(previous?.qty||0)+qty)});
    };
    (cartResult.data||[]).forEach(row=>{
      const localId=idBySlug[slugByDatabaseId[row.product_id]],variant=variantById[row.variant_id];
      if(!variant||variant.stock_quantity<=0)return;
      addQuantity(localId,row.variant_id,Math.min(variant.stock_quantity,Math.max(1,Number(row.quantity)||1)),variant.size_label);
    });
    guestCart.forEach(item=>{
      const variant=(item.variantId&&variantById[item.variantId])||defaultVariant(item.id);
      if(variant&&variant.stock_quantity>0)addQuantity(item.id,variant.id,Math.min(item.qty,variant.stock_quantity),item.size||variant.size_label);
    });
    recoveryCart.forEach(item=>{
      const variant=(item.variantId&&variantById[item.variantId])||defaultVariant(item.id);
      if(!variant||variant.stock_quantity<=0)return;
      const key=item.id+":"+variant.id,existing=quantities.get(key),qty=Math.min(item.qty,variant.stock_quantity);
      if(!existing||qty>existing.qty)quantities.set(key,{id:item.id,variantId:variant.id,size:item.size||variant.size_label,qty});
    });
    const cartChangedDuringRestore = state.cartRevision !== cartRevisionAtStart;
    if (!cartChangedDuringRestore) state.cart=[...quantities.values()];
    if(!cartChangedDuringRestore && (guestCart.length||guestWishlist.length||accountWishlist.length||recoveryCart.length)){
      // Route guest-cart migration through the same queues as click-driven saves to avoid competing writes.
      await Promise.all([saveCart(),saveWishlist()]);
      saveGuest("sm_guest_cart",[]);saveGuest("sm_guest_wishlist",[]);
    }
    if (restoreSequence !== restoreUserSequence || state.user?.id !== user.id) return;
    if (cartChangedDuringRestore) await saveCart();
    renderProducts();
  }catch(error){
    if (restoreSequence !== restoreUserSequence || state.user?.id !== user.id) return;
    console.error("Unable to restore account shopping data",error);
    toast(state.lang==="hi"?"सेव किया हुआ बैग या फेवरेट लोड नहीं हुआ। Supabase permissions जाँचें।":"Could not load your saved bag/favourites. Check Supabase permissions.");
  }
}

async function persistCart() {
  const userId=state.user?.id;
  if(!userId){saveGuest("sm_guest_cart",state.cart.map(item=>({...item})));return;}
  const cartSnapshot=state.cart.map(item=>({...item}));
  const databaseIds={...state.dbIds};
  saveGuest("sm_user_cart_"+userId,cartSnapshot);
  const rows=cartSnapshot.map(item=>({user_id:userId,product_id:databaseIds[item.id],variant_id:item.variantId,quantity:item.qty,updated_at:new Date().toISOString()}))
    .filter(row=>row.product_id&&row.variant_id&&!String(row.variant_id).startsWith("local-"));
  const {data:existing,error:readError}=await supabase.from("sm_cart_items").select("product_id,variant_id").eq("user_id",userId);
  if(readError)throw readError;
  if(state.user?.id!==userId)return;
  if(rows.length){const {error}=await supabase.from("sm_cart_items").upsert(rows,{onConflict:"user_id,product_id,variant_id"});if(error)throw error;}
  if(state.user?.id!==userId)return;
  const activeKeys=new Set(rows.map(row=>row.product_id+":"+row.variant_id));
  const stale=(existing||[]).filter(row=>!activeKeys.has(row.product_id+":"+row.variant_id));
  for(const row of stale){
    if(state.user?.id!==userId)return;
    const {error}=await supabase.from("sm_cart_items").delete().eq("user_id",userId).eq("product_id",row.product_id).eq("variant_id",row.variant_id);
    if(error)throw error;
  }
}
async function persistWishlist() {
  const userId=state.user?.id;
  if(!userId){saveGuest("sm_guest_wishlist",[...state.wishlist]);return;}
  const wishlistSnapshot=[...state.wishlist];
  const databaseIds={...state.dbIds};
  saveGuest("sm_user_wishlist_"+userId,wishlistSnapshot);
  const rows=wishlistSnapshot.map(id=>({user_id:userId,product_id:databaseIds[id]})).filter(row=>row.product_id);
  const {data:existing,error:readError}=await supabase.from("sm_wishlists").select("product_id").eq("user_id",userId);
  if(readError)throw readError;
  if(state.user?.id!==userId)return;
  if(rows.length){const {error}=await supabase.from("sm_wishlists").upsert(rows,{onConflict:"user_id,product_id"});if(error)throw error;}
  if(state.user?.id!==userId)return;
  const activeIds=new Set(rows.map(row=>row.product_id));
  const staleIds=(existing||[]).map(row=>row.product_id).filter(id=>!activeIds.has(id));
  if(staleIds.length){
    if(state.user?.id!==userId)return;
    const {error}=await supabase.from("sm_wishlists").delete().eq("user_id",userId).in("product_id",staleIds);
    if(error)throw error;
  }
}
let cartSaveQueue = Promise.resolve();
let wishlistSaveQueue = Promise.resolve();
function saveCart() {
  cartSaveQueue = cartSaveQueue.catch(() => {}).then(() => persistCart());
  return cartSaveQueue;
}
function saveWishlist() {
  wishlistSaveQueue = wishlistSaveQueue.catch(() => {}).then(() => persistWishlist());
  return wishlistSaveQueue;
}

function closeOverlay() { $("#overlay-root").innerHTML = ""; }
function openOverlay(title, body, panelClass = "drawer") {
  $("#overlay-root").innerHTML = '<div class="overlay" role="presentation"><aside class="' + panelClass + '" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' + body + "</aside></div>";
}
function openCart() {
  const items=state.cart.map(item=>({item,product:state.products.find(product=>product.id===item.id)})).filter(entry=>entry.product);
  const total=items.reduce((sum,entry)=>sum+entry.product.price*entry.item.qty,0);
  const header='<div class="drawer-head"><h2>'+esc(t().bag)+'</h2><button class="icon-button" data-close-overlay type="button" aria-label="'+esc(t().close)+'">×</button></div>';
  const list=items.length?'<div class="drawer-items">'+items.map(({item,product})=>
    '<div class="drawer-item"><img src="'+esc(product.image)+'" alt="'+esc(productName(product))+'"><div><b>'+esc(productName(product))+'</b><span>'+esc(item.size||"One size")+' · '+money(product.price)+' · Qty '+item.qty+'</span><strong>'+money(product.price*item.qty)+'</strong><button type="button" data-remove-cart="'+product.id+'" data-remove-variant="'+esc(item.variantId||"")+'">'+esc(t().remove)+'</button></div></div>'
  ).join("")+'</div>':'<div class="drawer-empty"><p>'+esc(t().emptyCart)+'</p><button class="button button-dark" data-close-overlay type="button">'+esc(t().shop)+'</button></div>';
  const bottom='<div class="drawer-bottom"><div><span>'+esc(t().subtotal)+'</span><strong>'+money(total)+'</strong></div><p>'+esc(t().demo)+'</p><a class="text-link" href="/cart.html">'+esc(t().viewFullBag)+' ↗</a><button class="button button-dark full" data-checkout type="button">'+esc(t().checkout)+'</button></div>';
  openOverlay(t().bag,header+list+bottom);
}
function openWishlist() {
  const products=state.wishlist.map(id=>state.products.find(product=>product.id===id)).filter(Boolean);
  const header='<div class="drawer-head"><h2>'+esc(t().saved)+'</h2><button class="icon-button" data-close-overlay type="button" aria-label="'+esc(t().close)+'">×</button></div>';
  const list=products.length?'<div class="drawer-items">'+products.map(product=>
    '<div class="drawer-item"><img src="'+esc(product.image)+'" alt="'+esc(productName(product))+'"><div><b>'+esc(productName(product))+'</b><span>'+money(product.price)+'</span><button type="button" data-wish="'+product.id+'">'+esc(t().removeWish)+'</button><button type="button" data-add="'+product.id+'">'+esc(t().add)+'</button></div></div>'
  ).join("")+'</div>':'<div class="drawer-empty"><p>'+esc(t().emptyWish)+'</p><button class="button button-dark" data-close-overlay type="button">'+esc(t().shop)+'</button></div>';
  const bottom='<div class="drawer-bottom"><a class="text-link" href="/wishlist.html">'+esc(t().viewFullWishlist)+' ↗</a></div>';
  openOverlay(t().saved,header+list+bottom);
}
function openQuickView(product) {
  if(!product)return;
  const choices=(product.variants||[]).filter(variant=>variant.stock_quantity>0);
  const sizes=choices.length?'<label class="size-select">'+esc(t().size)+'<select id="quick-size" aria-label="'+esc(t().size)+'">'+choices.map((variant,index)=>'<option value="'+esc(variant.id)+'"'+(index===0?" selected":"")+'>'+esc(variant.size_label)+' · '+variant.stock_quantity+' '+esc(t().stockAvailable)+'</option>').join("")+'</select></label>':'';
  const body='<button class="icon-button modal-close" data-close-overlay type="button" aria-label="'+esc(t().close)+'">×</button>'+
    '<div class="quick-image"><img src="'+esc(product.image)+'" alt="'+esc(productName(product))+'"></div>'+
    '<div class="quick-info"><p class="eyebrow">'+esc(productCategory(product))+" / "+esc(product.color||"")+'</p><h2>'+esc(productName(product))+'</h2><strong>'+money(product.price)+'</strong>'+
    '<p>'+esc(state.lang==="hi"?"रोज़ पहनने के लिए सोच-समझकर चुना गया स्टाइल।":"A considered everyday piece designed to work with the rest of your wardrobe.")+'</p>'+
    sizes+'<a class="text-link" href="/product.html?slug='+encodeURIComponent(product.slug)+'">'+esc(t().view)+' ↗</a>'+
    '<button class="button button-dark" data-add="'+product.id+'" type="button">'+esc(t().add)+'</button></div>';
  openOverlay(productName(product),body,"quick-view");
}

let authMode = "signin";
function openAuth() {
  const root = $("#auth-root");
  const user = state.user;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const field = (label, name, type, value, required, autocomplete, placeholder) =>
    '<label class="auth-field">' + esc(label) + '<div><input name="' + name + '" type="' + type + '" ' + (required ? "required " : "") +
    (autocomplete ? 'autocomplete="' + autocomplete + '" ' : "") + (placeholder ? 'placeholder="' + esc(placeholder) + '" ' : "") +
    'maxlength="160" value="' + esc(value || "") + '"></div></label>';
  const heading = user ? (state.lang === "hi" ? "आपका अकाउंट" : "Your account") : (state.lang === "hi" ? "वापस स्वागत है।" : "Welcome back.");
  const content = user ?
    '<div class="auth-account"><div class="auth-avatar">♙</div><p class="auth-muted">' + esc(user.email || "") + '</p><form id="profile-form" class="auth-profile-form">' +
    field(t().name, "full_name", "text", displayName, true, "name", "") + field(state.lang==="hi"?"ईमेल पता":"Email address", "email", "email", user.email || "", true, "email", "") +
    '<div class="auth-profile-actions"><button class="auth-submit" type="submit">' + esc(t().save) + ' <span>↗</span></button></div></form><button class="auth-secondary auth-signout" type="button" data-signout>' + esc(t().logout) + "</button></div>" :
    '<p class="auth-intro">' + esc(state.lang === "hi" ? "लॉगिन करें या अपना अकाउंट बनाएँ। सेव किए गए प्रोडक्ट और बैग आपके अकाउंट से जुड़े रहेंगे।" : "Sign in or create an account. Your saved pieces and bag stay linked to your account.") + '</p>' +
    '<div class="auth-tabs"><button type="button" data-auth-mode="signin" class="' + (authMode === "signin" ? "is-active" : "") + '">' + esc(t().signIn) + '</button><button type="button" data-auth-mode="signup" class="' + (authMode === "signup" ? "is-active" : "") + '">' + esc(t().create) + "</button></div>" +
    '<form id="auth-form" class="auth-form"><label class="auth-field" data-field="name" ' + (authMode !== "signup" ? "hidden" : "") + '>' + esc(t().name) + '<div><input name="full_name" autocomplete="name" maxlength="100" placeholder="Prem Kumar" ' + (authMode === "signup" ? "required" : "") + '></div></label>' +
    field("Email", "email", "email", "", true, "email", "you@example.com") + field(t().password, "password", "password", "", true, authMode === "signin" ? "current-password" : "new-password", "") +
    '<p class="auth-notice" id="auth-message" role="status" hidden></p><button class="auth-submit" type="submit" id="auth-submit">' + esc(authMode === "signin" ? t().signIn : t().create) + ' <span>↗</span></button></form>' +
    '<p class="auth-secure">♧ ' + esc(state.lang === "hi" ? "सुरक्षित अकाउंट एक्सेस" : "Secure account access") + "</p>";
  root.innerHTML = '<div class="auth-overlay" data-close-auth><section class="auth-modal" role="dialog" aria-modal="true" aria-label="Account"><button class="auth-close" data-close-auth type="button" aria-label="' + esc(t().close) + '">×</button><a class="auth-wordmark" href="#top">SHOPPING<span> MART</span></a><p class="auth-eyebrow">SHOPPING MART / ACCOUNT</p><h2>' + esc(heading) + "</h2>" + content + "</section></div>";
}

document.addEventListener("click", async event => {
  if (event.target.matches(".overlay")) { closeOverlay(); return; }
  if (event.target.matches(".auth-overlay")) { $("#auth-root").innerHTML = ""; return; }
  const button = event.target.closest("button, a");
  if (!button) return;

  if (button.id === "language-switch") { state.lang = state.lang === "en" ? "hi" : "en"; setLanguage(); return; }
  if (button.dataset.pickCategory) { state.category = button.dataset.pickCategory; renderCategories(); renderProducts(); return; }
  if (button.dataset.category) { if (button.tagName === "A") event.preventDefault(); state.category = button.dataset.category; closeOverlay(); renderCategories(); renderProducts(); $("#shop")?.scrollIntoView({ behavior:"smooth" }); return; }
  if (button.dataset.categoryLink) { event.preventDefault(); state.category = button.dataset.categoryLink; renderCategories(); renderProducts(); $("#shop")?.scrollIntoView({ behavior:"smooth" }); return; }
  if (["hero-shop", "view-all", "manifesto-shop"].includes(button.id)) { state.category = "All"; renderCategories(); renderProducts(); $("#shop")?.scrollIntoView({ behavior:"smooth" }); return; }
  if (button.id === "account-trigger") { event.preventDefault(); openAuth(); return; }
  if (button.id === "cart-trigger") { event.preventDefault(); openCart(); return; }
  if (button.id === "wishlist-trigger") { event.preventDefault(); openWishlist(); return; }
  if (button.id === "mobile-menu") { openMenu(); return; }
  if (button.id === "search-toggle") { event.preventDefault(); $("#product-search")?.focus(); $("#shop")?.scrollIntoView({ behavior:"smooth" }); return; }
  if (button.dataset.closeOverlay !== undefined) { closeOverlay(); return; }
  if (button.dataset.closeAuth !== undefined) { $("#auth-root").innerHTML = ""; return; }
  if (button.id === "demo-info") { toast(t().demoCheckout); return; }
  if (button.dataset.authMode) {
    authMode = button.dataset.authMode;
    $$("[data-auth-mode]").forEach(item => item.classList.toggle("is-active", item === button));
    const submit = $("#auth-submit");
    if (submit) submit.innerHTML = esc(authMode === "signin" ? t().signIn : t().create) + " <span>↗</span>";
    const nameField = $('#auth-form [name="full_name"]');
    if (nameField) { nameField.required = authMode === "signup"; nameField.closest("label").hidden = authMode !== "signup"; }
    const password = $('#auth-form [name="password"]');
    if (password) password.autocomplete = authMode === "signin" ? "current-password" : "new-password";
    const message = $("#auth-message");
    if (message) { message.hidden = true; message.textContent = ""; }
    return;
  }
  if (button.dataset.signout !== undefined) {
    const { error } = await supabase.auth.signOut();
    if (error) toast(error.message);
    else { await restoreUser(null); $("#auth-root").innerHTML = ""; toast(t().signedOut); }
    return;
  }
  if (button.dataset.wish !== undefined) {
    const id = Number(button.dataset.wish);
    const wasSaved = state.wishlist.includes(id);
    state.wishlist = wasSaved ? state.wishlist.filter(item => item !== id) : [...state.wishlist, id];
    renderProducts();
    try { await saveWishlist(); toast(wasSaved ? t().removeWish : t().addedWish); }
    catch (error) { console.error(error); toast(state.lang === "hi" ? "फेवरेट सेव नहीं हुआ। दोबारा कोशिश करें।" : "Could not save favourite. Please retry."); }
    if ($("#overlay-root").innerHTML) openWishlist();
    return;
  }
  if (button.dataset.add !== undefined) {
    const id=Number(button.dataset.add);
    const product=state.products.find(item=>item.id===id);
    if(!product)return;
    const available=(product.variants||[]).filter(item=>item.stock_quantity>0);
    if(button.dataset.chooseSize!==undefined&&available.length>1){openQuickView(product);return;}
    const selectedId=$("#quick-size")?.value||defaultVariant(id)?.id;
    const variant=product.variants?.find(item=>item.id===selectedId)||defaultVariant(id);
    if(!variant){toast(state.lang==="hi"?"इस प्रोडक्ट का साइज़ उपलब्ध नहीं है।":"No size is currently available.");return;}
    const variantId=variant.id,size=variant.size_label||"One size";
    const existing=state.cart.find(item=>item.id===id&&item.variantId===variantId);
    if((existing?.qty||0)+1>variant.stock_quantity){toast(state.lang==="hi"?"इस साइज़ का उपलब्ध स्टॉक खत्म हो गया है।":"The available stock for this size has been reached.");return;}
    if(existing)existing.qty+=1;
    else state.cart.push({id,qty:1,variantId,size});
    state.cartRevision++;
    renderProducts();
    try{await saveCart();toast(t().added);}catch(error){console.error(error);toast(state.lang==="hi"?"बैग सेव नहीं हुआ। दोबारा कोशिश करें।":"Could not save bag. Please retry.");}
    if($("#overlay-root").innerHTML)openCart();
    return;
  }
  if (button.dataset.removeCart !== undefined) {
    state.cart = state.cart.filter(item => !(item.id === Number(button.dataset.removeCart) && item.variantId === button.dataset.removeVariant));
    state.cartRevision++;
    renderProducts();
    try { await saveCart(); openCart(); }
    catch (error) { console.error(error); toast(state.lang === "hi" ? "बैग अपडेट नहीं हुआ।" : "Could not update bag."); }
    return;
  }
  if (button.dataset.quick !== undefined) { openQuickView(state.products.find(product => product.id === Number(button.dataset.quick))); return; }
  if (button.dataset.checkout !== undefined) {
    if (!state.cart.length) { toast(t().emptyCart); return; }
    location.href = "/checkout.html";
    return;
  }
  if (button.id === "clear-filters") {
    state.query = ""; state.category = "All";
    if ($("#product-search")) $("#product-search").value = "";
    renderCategories(); renderProducts(); return;
  }
});

function openMenu() {
  const header = '<div class="drawer-head"><h2>' + esc(t().menuTitle) + '</h2><button class="icon-button" data-close-overlay type="button" aria-label="' + esc(t().close) + '">×</button></div>';
  const menu = '<nav class="drawer-menu">' + CATEGORIES.map(category => '<button type="button" data-category="' + esc(category) + '">' + esc(state.lang === "hi" ? (CATEGORY_HI[category] || category) : category) + '<span>↗</span></button>').join("") + "</nav>";
  openOverlay(t().menuTitle, header + menu);
}

document.addEventListener("submit", async event => {
  if (event.target.id === "auth-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const fullName = String(form.get("full_name") || "").trim();
    const message = $("#auth-message");
    const submit = $("#auth-submit");
    submit.disabled = true;
    message.hidden = true;
    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name:fullName }, emailRedirectTo:location.origin } });
        if (error) throw error;
        if (data.session) {
          await restoreUser(data.user); $("#auth-root").innerHTML = ""; toast(t().signed);
        } else {
          message.hidden = false; message.className = "auth-notice auth-notice-success"; message.textContent = t().emailConfirm;
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await restoreUser(data.user); $("#auth-root").innerHTML = ""; toast(t().signed);
      }
    } catch (error) {
      message.hidden = false; message.className = "auth-notice auth-notice-error"; message.textContent = error.message || "Authentication failed";
    } finally { submit.disabled = false; }
    return;
  }
  if (event.target.id === "profile-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    const fullName = String(form.get("full_name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const previousEmail = (state.user?.email || "").toLowerCase();
    try {
      const updates = { data:{ ...(state.user.user_metadata || {}), full_name:fullName } };
      if (email.toLowerCase() !== previousEmail) updates.email = email;
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      state.user = data.user;
      toast(email.toLowerCase() !== previousEmail
        ? (state.lang === "hi" ? "नया ईमेल पता पुष्टि करने के लिए मेल देखें।" : "Check your new email to confirm the address change.")
        : (state.lang === "hi" ? "प्रोफाइल सेव हो गई।" : "Profile saved."));
      openAuth();
    } catch (error) { toast(error.message || "Could not update profile"); }
    return;
  }
  if (event.target.id === "newsletter-form") {
    event.preventDefault();
    toast(t().newsletterDemo);
    $("#newsletter-status").hidden = false;
    $("#newsletter-status").textContent = t().newsletterDemo;
  }
});

$("#product-search")?.addEventListener("input", event => { state.query = event.target.value; renderProducts(); });
$("#sort-select")?.addEventListener("change", event => { state.sort = event.target.value; renderProducts(); });
$("#clear-search")?.addEventListener("click", () => { $("#product-search").value = ""; state.query = ""; renderProducts(); });

const { data:{ session } } = await supabase.auth.getSession();
await loadCatalogue();
await restoreUser(session?.user || null);
supabase.auth.onAuthStateChange((_event, session) => {
  setTimeout(() => { void restoreUser(session?.user || null); }, 0);
});
setLanguage();