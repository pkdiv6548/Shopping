import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PRODUCTS, CATEGORIES, CATEGORY_HI } from "./products.mjs";

const SUPABASE_URL = "https://dbenwifjhdqhiznowncs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-x_VjXiyIL7j_dz7b7AgQQ_jv_Wj4dq";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = { lang:"en", category:"All", query:"", sort:"recommended", user:null, cart:[], wishlist:[], dbIds:{}, products:PRODUCTS };
const words = {
 en:{top:"COMPLIMENTARY SHIPPING ON ORDERS OVER ₹2,999",new:"NEW SEASON / 2026",subtitle:"Thoughtful pieces. Better everyday dressing. Find your next forever favourite.",shop:"EXPLORE THE EDIT",discover:"THE NEW EDIT",featured:"MADE FOR YOUR EVERYDAY",discoverSub:"Fresh silhouettes, easy layers and pieces made to live in.",all:"VIEW ALL",newsletter:"Good things, occasionally.",newsletterSub:"A little inspiration, new arrivals and notes from our world.",email:"Your email address",join:"SIGN ME UP",footer:"Style that feels like you.",search:"Search pieces, categories...",allProducts:"All pieces",recommended:"Recommended",low:"Price: low to high",high:"Price: high to low",empty:"No pieces found. Try another search.",added:"Added to your bag",bag:"Your bag",close:"Close",checkout:"Continue to demo checkout",demo:"DEMO STORE · NO REAL PAYMENT",subtotal:"Subtotal",saved:"Saved pieces",women:"WOMEN",men:"MEN",studio:"STUDIO",menu:"MENU",count:"pieces",filters:"FILTER",clear:"Clear",color:"Colour",price:"Price",quick:"QUICK VIEW",view:"DISCOVER PIECE",inBag:"IN BAG",size:"Select a size",add:"ADD TO BAG",addedWish:"Saved to wishlist",removeWish:"Removed from wishlist",signIn:"SIGN IN",create:"CREATE ACCOUNT",name:"Full name",password:"Password",logout:"SIGN OUT",profile:"EDIT PROFILE",save:"SAVE CHANGES",signed:"Signed in successfully.",needLogin:"Sign in to save your bag and favourites.",emptyCart:"Your bag is empty.",emptyWish:"No saved pieces yet.",emailConfirm:"Check your email to confirm your account."},
 hi:{top:"₹2,999 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी",new:"नया सीज़न / 2026",subtitle:"सोच-समझकर चुने गए कपड़े। रोज़मर्रा के लिए बेहतर स्टाइल।",shop:"कलेक्शन देखें",discover:"नया कलेक्शन",featured:"आपके हर दिन के लिए",discoverSub:"नए सिल्हूट और हर दिन पहनने के लिए खास पीस।",all:"सभी देखें",newsletter:"अच्छी बातें, कभी-कभी।",newsletterSub:"थोड़ी प्रेरणा और नए कलेक्शन की जानकारी।",email:"अपना ईमेल पता",join:"जुड़ें",footer:"ऐसा स्टाइल जो आप जैसा लगे।",search:"पीस या कैटेगरी खोजें...",allProducts:"सभी पीस",recommended:"सुझाए गए",low:"कीमत: कम से ज़्यादा",high:"कीमत: ज़्यादा से कम",empty:"कोई पीस नहीं मिला। दूसरी खोज आज़माएँ।",added:"बैग में जोड़ा गया",bag:"आपका बैग",close:"बंद करें",checkout:"डेमो चेकआउट पर जाएँ",demo:"डेमो स्टोर · कोई असली भुगतान नहीं",subtotal:"कुल",saved:"सेव किए गए पीस",women:"महिलाएँ",men:"पुरुष",studio:"स्टूडियो",menu:"मेन्यू",count:"पीस",filters:"फ़िल्टर",clear:"हटाएँ",color:"रंग",price:"कीमत",quick:"जल्दी देखें",view:"पीस देखें",inBag:"बैग में",size:"साइज़ चुनें",add:"बैग में जोड़ें",addedWish:"फेवरेट में सेव किया",removeWish:"फेवरेट से हटाया",signIn:"लॉगिन",create:"अकाउंट बनाएँ",name:"पूरा नाम",password:"पासवर्ड",logout:"लॉगआउट",profile:"प्रोफाइल एडिट करें",save:"बदलाव सेव करें",signed:"लॉगिन सफल हुआ।",needLogin:"कार्ट और फेवरेट सेव करने के लिए लॉगिन करें।",emptyCart:"आपका बैग खाली है।",emptyWish:"अभी कोई फेवरेट सेव नहीं है।",emailConfirm:"अकाउंट की पुष्टि के लिए अपना ईमेल देखें।"}
};
const t=()=>words[state.lang];
const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const box=$("#toast");if(!box)return;$("#toast-message").textContent=msg;box.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>box.hidden=true,2600)}
function name(p){return state.lang==="hi"?p.hi:p.name}
function category(p){return state.lang==="hi"?(p.categoryHi||CATEGORY_HI[p.category]||p.category):p.category}
function renderCategories(){
 const el=$("#category-tabs"); if(!el)return;
 el.innerHTML=CATEGORIES.map(c=>'<button type="button" data-pick-category="'+esc(c)+'" class="'+(state.category===c?'active':'')+'">'+esc(state.lang==="hi"?(CATEGORY_HI[c]||c):c)+'</button>').join("");
}
function visibleProducts(){
 let list=state.products.filter(p=>{
  const q=state.query.toLowerCase();
  const match=!q||[p.name,p.hi,p.category,p.categoryHi].some(x=>String(x||"").toLowerCase().includes(q));
  const cat=state.category==="All"|| (state.category==="New in"?p.tag==="new":state.category==="Clothing"?true:p.category===state.category);
  return match&&cat;
 });
 if(state.sort==="low")list.sort((a,b)=>a.price-b.price);
 if(state.sort==="high")list.sort((a,b)=>b.price-a.price);
 return list;
}
function renderProducts(){
 const list=visibleProducts(), grid=$("#product-grid");if(!grid)return;
 grid.innerHTML=list.map(p=>'<article class="product-card reveal"><div class="product-image" style="background-color:'+esc(p.tone)+'"><img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(name(p))+'"><span class="product-badge">'+esc(p.badge||"")+'</span><button class="wish-button '+(state.wishlist.includes(p.id)?'is-wished':'')+'" data-wish="'+p.id+'" type="button" aria-label="Wishlist">♥</button><button class="quick-button" data-quick="'+p.id+'" type="button">'+esc(t().quick)+'</button></div><div class="product-meta"><div><h3>'+esc(name(p))+'</h3><p>'+esc(category(p))+' · '+esc(p.color)+'</p></div><strong>'+money(p.price)+'</strong></div><button class="product-add" data-add="'+p.id+'" type="button">'+esc(t().add)+'</button></article>').join("");
 $("#empty-state").hidden=list.length>0;
 $("#result-count").textContent=list.length+" "+t().count.toUpperCase();
 $("#result-category").textContent=state.lang==="hi"?(CATEGORY_HI[state.category]||state.category):state.category;
 $("#cart-count").textContent=state.cart.reduce((a,x)=>a+x.qty,0);
 $("#wishlist-count").textContent=state.wishlist.length;
}
function setLanguage(){
 document.documentElement.lang=state.lang;
 $$("[data-copy]").forEach(el=>{const k=el.dataset.copy;if(t()[k])el.textContent=t()[k]});
 const search=$("#product-search");if(search)search.placeholder=t().search;
 const email=$("#newsletter-email");if(email)email.placeholder=t().email;
 const lang=$("#language-switch");if(lang)lang.innerHTML=(state.lang==="en"?"हिंदी":"English")+' <span data-icon="chevron-down"></span>';
 const title=$("#hero-title");if(title&&state.lang==="hi")title.innerHTML="<span>कम में भी,</span><span>बहुत कुछ।</span>";else if(title)title.innerHTML="<span>A little less,</span><span>a lot more.</span>";
 renderCategories();renderProducts();
}
async function restoreUser(user){
 state.user=user;
 if(!user){state.cart=[];state.wishlist=[];state.dbIds={};renderProducts();return}
 try{
  const [{data:dbProducts,error:pErr},{data:wishes,error:wErr},{data:cart,error:cErr}]=await Promise.all([
   supabase.from("sm_products").select("id,slug").eq("status","active"),
   supabase.from("sm_wishlists").select("product_id").eq("user_id",user.id),
   supabase.from("sm_cart_items").select("product_id,quantity").eq("user_id",user.id)
  ]);
  if(pErr)throw pErr;if(wErr)throw wErr;if(cErr)throw cErr;
  const bySlug=Object.fromEntries(state.products.map(p=>[p.slug,p.id]));
  const slugByDb=Object.fromEntries((dbProducts||[]).map(p=>[p.id,p.slug]));
  state.dbIds=Object.fromEntries((dbProducts||[]).map(p=>[bySlug[p.slug],p.id]).filter(([k,v])=>k!=="undefined"&&v));
  state.wishlist=(wishes||[]).map(w=>bySlug[slugByDb[w.product_id]]).filter(Number.isFinite);
  state.cart=(cart||[]).flatMap(row=>Array(Math.min(99,Math.max(1,row.quantity||1))).fill(bySlug[slugByDb[row.product_id]])).filter(Number.isFinite).map(id=>({id,qty:1}));
  const grouped=new Map();state.cart.forEach(x=>grouped.set(x.id,(grouped.get(x.id)||0)+1));state.cart=[...grouped].map(([id,qty])=>({id,qty}));
  renderProducts();
 }catch(e){console.error("Unable to restore account shopping data",e);toast("Could not load your saved bag/favourites. Check Supabase table policies.");}
}
async function persistCart(){
 if(!state.user)return;
 const rows=state.cart.map(x=>({user_id:state.user.id,product_id:state.dbIds[x.id],quantity:x.qty,updated_at:new Date().toISOString()})).filter(x=>x.product_id);
 const {data:existing,error:rErr}=await supabase.from("sm_cart_items").select("product_id").eq("user_id",state.user.id);if(rErr)throw rErr;
 if(rows.length){const {error}=await supabase.from("sm_cart_items").upsert(rows,{onConflict:"user_id,product_id"});if(error)throw error}
 const active=new Set(rows.map(x=>x.product_id)), stale=(existing||[]).map(x=>x.product_id).filter(id=>!active.has(id));
 if(stale.length){const {error}=await supabase.from("sm_cart_items").delete().eq("user_id",state.user.id).in("product_id",stale);if(error)throw error}
}
async function persistWishlist(){
 if(!state.user)return;
 const rows=state.wishlist.map(id=>({user_id:state.user.id,product_id:state.dbIds[id]})).filter(x=>x.product_id);
 const {data:existing,error:rErr}=await supabase.from("sm_wishlists").select("product_id").eq("user_id",state.user.id);if(rErr)throw rErr;
 if(rows.length){const {error}=await supabase.from("sm_wishlists").upsert(rows,{onConflict:"user_id,product_id"});if(error)throw error}
 const active=new Set(rows.map(x=>x.product_id)),stale=(existing||[]).map(x=>x.product_id).filter(id=>!active.has(id));
 if(stale.length){const {error}=await supabase.from("sm_wishlists").delete().eq("user_id",state.user.id).in("product_id",stale);if(error)throw error}
}
function overlay(title,body){
 const root=$("#overlay-root");root.innerHTML='<div class="drawer-backdrop" data-close-overlay></div><aside class="cart-drawer"><button class="drawer-close" data-close-overlay aria-label="Close">×</button><p class="eyebrow">SHOPPING MART</p><h2>'+esc(title)+'</h2>'+body+'</aside>';
}
function openCart(){
 const items=state.cart.map(row=>({row,p:state.products.find(p=>p.id===row.id)})).filter(x=>x.p);
 const total=items.reduce((s,x)=>s+x.p.price*x.row.qty,0);
 overlay(t().bag,'<div class="drawer-items">'+(items.length?items.map(({row,p})=>'<div class="drawer-item"><img src="'+esc(p.image)+'" alt=""><div><strong>'+esc(name(p))+'</strong><p>'+money(p.price)+' · Qty '+row.qty+'</p><button data-remove-cart="'+p.id+'">REMOVE</button></div></div>').join(""):'<p>'+esc(t().emptyCart)+'</p>')+'</div><div class="drawer-total"><span>'+esc(t().subtotal)+'</span><strong>'+money(total)+'</strong></div><p class="demo-note">'+esc(t().demo)+'</p><button class="button button-dark drawer-checkout" data-checkout>'+esc(t().checkout)+'</button>');
}
function openWishlist(){
 const items=state.wishlist.map(id=>state.products.find(p=>p.id===id)).filter(Boolean);
 overlay(t().saved,'<div class="drawer-items">'+(items.length?items.map(p=>'<div class="drawer-item"><img src="'+esc(p.image)+'" alt=""><div><strong>'+esc(name(p))+'</strong><p>'+money(p.price)+'</p><button data-wish="'+p.id+'">'+esc(t().removeWish)+'</button><button data-add="'+p.id+'">'+esc(t().add)+'</button></div></div>').join(""):'<p>'+esc(t().emptyWish)+'</p>')+'</div>');
}
function openAuth(){
 const root=$("#auth-root");
 const displayName=state.user?.user_metadata?.full_name||state.user?.user_metadata?.name||"";
 root.innerHTML='<div class="auth-backdrop" data-close-auth></div><section class="auth-panel" role="dialog" aria-modal="true" aria-label="Account"><button class="auth-close" data-close-auth aria-label="Close">×</button><p class="eyebrow">SHOPPING MART / ACCOUNT</p><h2>'+(state.user?"YOUR ACCOUNT":"Welcome back.")+'</h2>'+(state.user?'<p>'+esc(state.user.email)+'</p><form id="profile-form" class="auth-profile-form"><label>'+esc(t().name)+'<input name="full_name" required maxlength="100" value="'+esc(displayName)+'"></label><label>Email<input name="email" type="email" required value="'+esc(state.user.email||"")+'"></label><button class="button button-dark" type="submit">'+esc(t().save)+'</button></form><button class="button auth-secondary" data-signout>'+esc(t().logout)+'</button>':'<div class="auth-tabs"><button type="button" data-auth-mode="signin" class="active">'+esc(t().signIn)+'</button><button type="button" data-auth-mode="signup">'+esc(t().create)+'</button></div><form id="auth-form"><label>'+esc(t().name)+'<input name="full_name" autocomplete="name" maxlength="100" placeholder="Prem Kumar"></label><label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label><label>'+esc(t().password)+'<input name="password" type="password" required minlength="8" autocomplete="current-password"></label><p class="auth-message" id="auth-message" role="status"></p><button class="button button-dark" type="submit" id="auth-submit">'+esc(t().signIn)+'</button></form>')+'</section>';
}
let authMode="signin";
document.addEventListener("click",async e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.id==="language-switch"){state.lang=state.lang==="en"?"hi":"en";setLanguage();return}
 if(b.dataset.pickCategory){state.category=b.dataset.pickCategory;renderCategories();renderProducts();return}
 if(b.dataset.category){state.category=b.dataset.category;renderCategories();renderProducts();$("#shop")?.scrollIntoView({behavior:"smooth"});return}
 if(b.dataset.categoryLink){state.category=b.dataset.categoryLink;renderCategories();renderProducts();$("#shop")?.scrollIntoView({behavior:"smooth"});return}
 if(b.id==="hero-shop"||b.id==="view-all"||b.id==="manifesto-shop"){state.category="All";renderCategories();renderProducts();$("#shop")?.scrollIntoView({behavior:"smooth"});return}
 if(b.id==="account-trigger"){openAuth();return}
 if(b.id==="cart-trigger"){openCart();return}
 if(b.id==="wishlist-trigger"){openWishlist();return}
 if(b.id==="mobile-menu"){state.category="All";$("#shop")?.scrollIntoView({behavior:"smooth"});return}
 if(b.id==="search-toggle"){ $("#product-search")?.focus();$("#shop")?.scrollIntoView({behavior:"smooth"});return}
 if(b.dataset.closeOverlay!==undefined){$("#overlay-root").innerHTML="";return}
 if(b.dataset.closeAuth!==undefined){$("#auth-root").innerHTML="";return}
 if(b.dataset.authMode){authMode=b.dataset.authMode;$$("[data-auth-mode]").forEach(x=>x.classList.toggle("active",x===b));$("#auth-submit").textContent=authMode==="signin"?t().signIn:t().create;const nameField=$('#auth-form [name="full_name"]');nameField.required=authMode==="signup";nameField.closest("label").hidden=authMode!=="signup";return}
 if(b.dataset.signout!==undefined){const {error}=await supabase.auth.signOut();if(error)toast(error.message);else{await restoreUser(null);$("#auth-root").innerHTML="";toast("Signed out")};return}
 if(b.dataset.wish){
  const id=Number(b.dataset.wish);if(!state.user){toast(t().needLogin);openAuth();return}
  const has=state.wishlist.includes(id);state.wishlist=has?state.wishlist.filter(x=>x!==id):[...state.wishlist,id];renderProducts();
  try{await persistWishlist();toast(has?t().removeWish:t().addedWish)}catch(err){console.error(err);toast("Could not save favourite. Please retry.")};if($("#overlay-root").innerHTML)openWishlist();return
 }
 if(b.dataset.add){
  const id=Number(b.dataset.add);if(!state.user){toast(t().needLogin);openAuth();return}
  const found=state.cart.find(x=>x.id===id);if(found)found.qty++;else state.cart.push({id,qty:1});renderProducts();
  try{await persistCart();toast(t().added)}catch(err){console.error(err);toast("Could not save bag. Please retry.")};if($("#overlay-root").innerHTML)openCart();return
 }
 if(b.dataset.removeCart){
  state.cart=state.cart.filter(x=>x.id!==Number(b.dataset.removeCart));renderProducts();
  try{await persistCart();openCart()}catch(err){console.error(err);toast("Could not update bag.")};return
 }
 if(b.dataset.quick){
  const p=state.products.find(x=>x.id===Number(b.dataset.quick));if(!p)return;
  overlay(name(p),'<div class="quick-view"><img src="'+esc(p.image)+'" alt="'+esc(name(p))+'"><p>'+esc(category(p))+' · '+esc(p.color)+'</p><strong>'+money(p.price)+'</strong><button class="button button-dark" data-add="'+p.id+'">'+esc(t().add)+'</button></div>');return
 }
 if(b.dataset.checkout!==undefined){toast(t().demo);return}
 if(b.id==="clear-filters"){state.query="";state.category="All";$("#product-search").value="";renderCategories();renderProducts();return}
});
document.addEventListener("submit",async e=>{
 if(e.target.id==="auth-form"){
  e.preventDefault();const form=new FormData(e.target),email=String(form.get("email")||"").trim(),password=String(form.get("password")||""),full_name=String(form.get("full_name")||"").trim(),msg=$("#auth-message"),submit=$("#auth-submit");submit.disabled=true;msg.textContent="";
  try{
   if(authMode==="signup"){
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name},emailRedirectTo:location.origin}});
    if(error)throw error;
    if(data.session){await restoreUser(data.user);$("#auth-root").innerHTML="";toast(t().signed)}else msg.textContent=t().emailConfirm;
   }else{
    const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
    await restoreUser(data.user);$("#auth-root").innerHTML="";toast(t().signed);
   }
  }catch(err){msg.textContent=err.message||"Authentication failed"}finally{submit.disabled=false}return;
 }
 if(e.target.id==="profile-form"){
  e.preventDefault();const form=new FormData(e.target),full_name=String(form.get("full_name")||"").trim(),email=String(form.get("email")||"").trim();
  try{const patch={data:{...state.user.user_metadata,full_name}};if(email.toLowerCase()!==(state.user.email||"").toLowerCase())patch.email=email;
   const {data,error}=await supabase.auth.updateUser(patch);if(error)throw error;state.user=data.user;toast(email.toLowerCase()!==(state.user.email||"").toLowerCase()?"Check your email to confirm the change.":"Profile saved.");openAuth();
  }catch(err){toast(err.message||"Could not update profile")}return;
 }
 if(e.target.id==="newsletter-form"){e.preventDefault();$("#newsletter-status").hidden=false;$("#newsletter-status").textContent=state.lang==="hi"?"धन्यवाद!":"Thank you for subscribing.";e.target.reset()}
});
$("#product-search")?.addEventListener("input",e=>{state.query=e.target.value;renderProducts()});
$("#sort-select")?.addEventListener("change",e=>{state.sort=e.target.value;renderProducts()});
$("#clear-search")?.addEventListener("click",()=>{$("#product-search").value="";state.query="";renderProducts()});
const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{void restoreUser(session?.user||null)});
const {data:{session}}=await supabase.auth.getSession();await restoreUser(session?.user||null);
setLanguage();
