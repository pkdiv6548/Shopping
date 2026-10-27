import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { PRODUCTS, CATEGORIES, CATEGORY_HI } from "./products.mjs";
import { isValidCartQuantity, reconcileCartWithStock, resolveCartVariant } from "./cart-rules.mjs";

const supabase = createClient(
  "https://dbenwifjhdqhiznowncs.supabase.co",
  "sb_publishable_-x_VjXiyIL7j_dz7b7AgQQ_jv_Wj4dq"
);
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const page = document.body.dataset.page || "collection";
const text = {
  en: {
    promo:"COMPLIMENTARY SHIPPING ON ORDERS OVER ₹2,999",localMarket:"SHOPPING MART / INDIA",searchLabel:"Search",priceFilter:"Price",colorFilter:"Colour",allPrices:"All prices",under1500:"Under ₹1,500",range1500:"₹1,500–₹2,500",above2500:"Above ₹2,500",allColours:"All colours",home:"HOME",shopAll:"SHOP ALL",saved:"WISHLIST",bag:"BAG",account:"ACCOUNT",footer:"Style that feels like you.",demo:"DEMO STORE · PAYMENTS NOT ENABLED",
    newEdit:"THE EVERYDAY EDIT",shopTitle:"Pieces for everyday.",shopIntro:"Considered essentials, easy layers and modern silhouettes.",womenNav:"WOMEN",menNav:"MEN",newArrivalsNav:"NEW IN",searchNav:"SEARCH",aboutNav:"ABOUT",womenEyebrow:"THE WOMEN’S EDIT",womenTitle:"A considered women’s edit.",womenIntro:"Versatile layers and considered silhouettes for the everyday.",menEyebrow:"THE MEN’S EDIT",menTitle:"Everyday style, refined.",menIntro:"Easy essentials, modern layers and uncomplicated fits.",newEyebrow:"JUST ARRIVED",newTitle:"New pieces, just in.",newIntro:"Fresh additions to the Shopping Mart everyday edit.",searchEyebrow:"FIND YOUR NEXT FAVOURITE",searchTitle:"Search the collection.",searchIntro:"Search product names, categories and colours.",checkoutEyebrow:"YOUR ORDER",checkoutTitle:"Checkout.",checkoutIntro:"Review your selected pieces before the final step.",backToBag:"BACK TO BAG ↗",aboutEyebrow:"THE SHOPPING MART POINT OF VIEW",aboutTitle:"Less noise. More meaning.",aboutIntro:"Everyday essentials, considered details and modern silhouettes.",aboutPrinciple:"OUR PRINCIPLE",aboutHeading:"Style should feel simple.",aboutBody:"We believe getting dressed should feel simple. Pieces with considered details, easy combinations and a place in your wardrobe beyond one season.",search:"Search products, categories…",category:"Category",sort:"Sort by",recommended:"Recommended",low:"Price: low to high",high:"Price: high to low",allPieces:"All pieces",noResults:"No pieces found.",clear:"Clear filters",
    youMayLike:"YOU MAY ALSO LIKE",new:"NEW",bestSeller:"BESTSELLER",size:"Select a size",color:"Colour",add:"ADD TO BAG",chooseSize:"CHOOSE SIZE",savedButton:"SAVE TO WISHLIST",removeWish:"REMOVE FROM WISHLIST",inStock:"In stock",outOfStock:"Currently unavailable",qty:"Quantity",ship:"Complimentary shipping on orders over ₹2,999.",details:"Product details",back:"BACK TO SHOP",productNotFound:"We couldn't find that piece.",continueShopping:"CONTINUE SHOPPING ↗",
    bagEyebrow:"YOUR EDIT",bagTitle:"Your bag.",bagIntro:"Review pieces and sizes before checkout.",emptyCart:"Your bag is empty.",subtotal:"Subtotal",demoCheckout:"Checkout is a demo only. Real payments and orders are not enabled.",remove:"REMOVE",update:"UPDATE",checkout:"CONTINUE TO CHECKOUT",sizeLabel:"Size",
    savedEyebrow:"YOUR FAVOURITES",savedTitle:"Saved pieces.",savedIntro:"The pieces you want to come back to.",emptyWish:"You haven't saved any pieces yet.",moveToBag:"ADD TO BAG",
    accountEyebrow:"SHOPPING MART / ACCOUNT",accountTitle:"Your account.",accountIntro:"Sign in to keep your bag and favourites in sync.",welcome:"Welcome back.",createAccount:"Create account",signIn:"Sign in",fullName:"Full name",email:"Email address",password:"Password",confirm:"CREATE ACCOUNT",submit:"SIGN IN",signOut:"SIGN OUT",saveProfile:"SAVE PROFILE",profileSaved:"Profile updated.",signedIn:"Signed in successfully.",signedOut:"You are signed out.",checkEmail:"Check your email to confirm your account.",demoNewsletter:"Newsletter signup is not connected yet.",loading:"Loading…",continue:"CONTINUE",status:"Status",profile:"PROFILE DETAILS",accountHelp:"Your bag and wishlist stay linked to your account when you sign in.",invalidSize:"Choose an available size first.",added:"Added to your bag.",savedToast:"Saved to wishlist.",removedToast:"Removed from wishlist.",error:"Something went wrong. Please try again.",checkoutItems:"ORDER SUMMARY",checkoutSubtotal:"Subtotal",checkoutNotice:"This is a demo checkout. No payment will be collected and no real order will be placed.",checkoutAction:"CONFIRM DEMO ONLY",checkoutEmpty:"Your bag is empty. Add a few pieces before checkout.",searchMatches:"Matching pieces",searchHint:"Type a product, category or colour to begin.",instockQty:"Available",demoOrderSuccess:"Demo order confirmed",demoOrderId:"Demo order reference",demoOrderHistory:"Demo order history",demoOrderEmpty:"No demo orders yet.",demoOrderStatus:"Demo only · no payment collected",demoOrderContinue:"CONTINUE SHOPPING"
  },
  hi: {
    promo:"₹2,999 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी",localMarket:"SHOPPING MART / भारत",searchLabel:"खोजें",priceFilter:"कीमत",colorFilter:"रंग",allPrices:"सभी कीमतें",under1500:"₹1,500 से कम",range1500:"₹1,500–₹2,500",above2500:"₹2,500 से अधिक",allColours:"सभी रंग",home:"होम",shopAll:"सभी प्रोडक्ट",saved:"विशलिस्ट",bag:"बैग",account:"अकाउंट",footer:"ऐसा स्टाइल जो आप जैसा लगे।",demo:"डेमो स्टोर · भुगतान उपलब्ध नहीं",
    newEdit:"हर दिन का कलेक्शन",shopTitle:"हर दिन के लिए खास पीस।",shopIntro:"चुने हुए एसेंशियल, आसान लेयर्स और आधुनिक स्टाइल।",womenNav:"महिलाएँ",menNav:"पुरुष",newArrivalsNav:"नए प्रोडक्ट",searchNav:"खोजें",aboutNav:"हमारे बारे में",womenEyebrow:"महिलाओं का कलेक्शन",womenTitle:"महिलाओं के लिए चुना हुआ कलेक्शन।",womenIntro:"हर दिन के लिए बहुउपयोगी लेयर्स और सोच-समझकर चुने गए स्टाइल।",menEyebrow:"पुरुषों का कलेक्शन",menTitle:"हर दिन का बेहतर स्टाइल।",menIntro:"आसान एसेंशियल, आधुनिक लेयर्स और आरामदायक फिट।",newEyebrow:"अभी-अभी आया",newTitle:"नए प्रोडक्ट।",newIntro:"Shopping Mart के रोज़मर्रा के कलेक्शन में नए प्रोडक्ट।",searchEyebrow:"अपना अगला पसंदीदा प्रोडक्ट खोजें",searchTitle:"कलेक्शन में खोजें।",searchIntro:"प्रोडक्ट के नाम, कैटेगरी और रंग से खोजें।",checkoutEyebrow:"आपका ऑर्डर",checkoutTitle:"चेकआउट।",checkoutIntro:"अगले चरण से पहले चुने गए प्रोडक्ट जाँचें।",backToBag:"बैग पर वापस जाएँ ↗",aboutEyebrow:"SHOPPING MART का नज़रिया",aboutTitle:"कम शोर। ज़्यादा मायने।",aboutIntro:"हर दिन के लिए ज़रूरी प्रोडक्ट, सोच-समझकर चुने गए विवरण और आधुनिक स्टाइल।",aboutPrinciple:"हमारा सिद्धांत",aboutHeading:"स्टाइल सरल होना चाहिए।",aboutBody:"हम मानते हैं कि कपड़े चुनना आसान लगना चाहिए। ऐसे प्रोडक्ट जिनमें सोच-समझकर चुने गए विवरण हों, जिन्हें आसानी से साथ पहना जा सके और जो एक सीज़न से आगे भी आपके वॉर्डरोब में रहें।",search:"प्रोडक्ट या कैटेगरी खोजें…",category:"कैटेगरी",sort:"क्रम",recommended:"सुझाए गए",low:"कीमत: कम से ज़्यादा",high:"कीमत: ज़्यादा से कम",allPieces:"सभी प्रोडक्ट",noResults:"कोई प्रोडक्ट नहीं मिला।",clear:"फ़िल्टर हटाएँ",
    youMayLike:"आपको ये भी पसंद आ सकते हैं",new:"नया",bestSeller:"लोकप्रिय",size:"साइज़ चुनें",color:"रंग",add:"बैग में जोड़ें",chooseSize:"साइज़ चुनें",savedButton:"विशलिस्ट में सेव करें",removeWish:"विशलिस्ट से हटाएँ",inStock:"स्टॉक में उपलब्ध",outOfStock:"अभी उपलब्ध नहीं",qty:"मात्रा",ship:"₹2,999 से अधिक के ऑर्डर पर मुफ़्त डिलीवरी।",details:"प्रोडक्ट विवरण",back:"शॉप पर वापस जाएँ",productNotFound:"यह प्रोडक्ट नहीं मिला।",continueShopping:"खरीदारी जारी रखें ↗",
    bagEyebrow:"आपका कलेक्शन",bagTitle:"आपका बैग।",bagIntro:"चेकआउट से पहले प्रोडक्ट और साइज़ जाँचें।",emptyCart:"आपका बैग खाली है।",subtotal:"कुल",demoCheckout:"चेकआउट अभी डेमो है। वास्तविक भुगतान या ऑर्डर चालू नहीं हैं।",remove:"हटाएँ",update:"अपडेट",checkout:"चेकआउट जारी रखें",sizeLabel:"साइज़",
    savedEyebrow:"आपके पसंदीदा",savedTitle:"सेव किए गए प्रोडक्ट।",savedIntro:"वे प्रोडक्ट जिन्हें आप बाद में देखना चाहते हैं।",emptyWish:"अभी कोई प्रोडक्ट सेव नहीं किया है।",moveToBag:"बैग में जोड़ें",
    accountEyebrow:"SHOPPING MART / अकाउंट",accountTitle:"आपका अकाउंट।",accountIntro:"लॉगिन करने पर आपका बैग और विशलिस्ट अकाउंट के साथ सेव रहेंगे।",welcome:"वापस स्वागत है।",createAccount:"अकाउंट बनाएँ",signIn:"लॉगिन",fullName:"पूरा नाम",email:"ईमेल पता",password:"पासवर्ड",confirm:"अकाउंट बनाएँ",submit:"लॉगिन करें",signOut:"लॉगआउट",saveProfile:"प्रोफाइल सेव करें",profileSaved:"प्रोफाइल अपडेट हो गई।",signedIn:"लॉगिन सफल हुआ।",signedOut:"आप लॉगआउट हो गए हैं।",checkEmail:"अकाउंट की पुष्टि के लिए अपना ईमेल देखें।",demoNewsletter:"न्यूज़लेटर साइनअप अभी कनेक्ट नहीं है।",loading:"लोड हो रहा है…",continue:"जारी रखें",status:"स्थिति",profile:"प्रोफाइल विवरण",accountHelp:"लॉगिन करने पर आपका बैग और विशलिस्ट आपके अकाउंट से जुड़े रहेंगे।",invalidSize:"पहले उपलब्ध साइज़ चुनें।",added:"बैग में जोड़ दिया गया।",savedToast:"विशलिस्ट में सेव किया गया।",removedToast:"विशलिस्ट से हटा दिया गया।",error:"कुछ गड़बड़ हुई। दोबारा कोशिश करें।",checkoutItems:"ऑर्डर का सारांश",checkoutSubtotal:"कुल",checkoutNotice:"यह डेमो चेकआउट है। कोई भुगतान नहीं लिया जाएगा और वास्तविक ऑर्डर नहीं बनेगा।",checkoutAction:"केवल डेमो की पुष्टि",checkoutEmpty:"आपका बैग खाली है। चेकआउट से पहले कुछ प्रोडक्ट जोड़ें।",searchMatches:"मिलते-जुलते प्रोडक्ट",searchHint:"शुरू करने के लिए प्रोडक्ट, कैटेगरी या रंग लिखें।",instockQty:"उपलब्ध",demoOrderSuccess:"डेमो ऑर्डर की पुष्टि हो गई",demoOrderId:"डेमो ऑर्डर संदर्भ",demoOrderHistory:"डेमो ऑर्डर हिस्ट्री",demoOrderEmpty:"अभी कोई डेमो ऑर्डर नहीं है।",demoOrderStatus:"केवल डेमो · कोई भुगतान नहीं लिया गया",demoOrderContinue:"खरीदारी जारी रखें"
  }
};
const translate = key => (text[state.lang] && text[state.lang][key]) || text.en[key] || key;
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
const price = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(value)||0);
function readStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"null")??fallback;}catch{return fallback;}}
function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(error){console.warn("Storage unavailable",error);}}
function demoOrdersKey(){return state.user?"sm_demo_orders_"+state.user.id:"sm_demo_orders_guest";}
function loadDemoOrders(){const value=readStorage(demoOrdersKey(),[]);return Array.isArray(value)?value.filter(order=>order&&typeof order.id==="string"&&Array.isArray(order.items)):[];}
function guestCart(){const value=readStorage("sm_guest_cart",[]);return Array.isArray(value)?value.filter(x=>Number.isInteger(x?.id)&&Number.isInteger(x?.qty)&&x.qty>0).map(x=>({id:x.id,qty:Math.min(99,x.qty),variantId:String(x.variantId||""),size:String(x.size||"")})):[];}
function guestWishlist(){const value=readStorage("sm_guest_wishlist",[]);return Array.isArray(value)?[...new Set(value.map(Number).filter(Number.isInteger))]:[];}
function userWishlist(userId){const value=readStorage("sm_user_wishlist_"+userId,[]);return Array.isArray(value)?[...new Set(value.map(Number).filter(Number.isInteger))]:[];}
const state={lang:readStorage("sm_lang","en")==="hi"?"hi":"en",user:null,products:PRODUCTS.map(p=>({...p,variants:[]})),dbIds:{},cart:guestCart(),cartRevision:0,wishlist:guestWishlist(),authMode:"signin"};
let productBySlug={}, productByDbId={}, variantById={};

function toast(message){const node=$("#page-toast");if(!node)return;node.textContent=message;node.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{node.hidden=true;},3000);}
function defaultVariant(productId){const product=state.products.find(p=>p.id===Number(productId));return product?.variants?.find(v=>v.stock_quantity>0)||product?.variants?.[0]||null;}
function localVariantsFor(product){
 const sizes=product.category==="Shoes"?["6","7","8","9","10"]:product.category==="Accessories"?["One size"]:["XS","S","M","L","XL"];
 return sizes.map(size=>({id:"local-"+product.id+"-"+size.toLowerCase().replace(/[^a-z0-9]+/g,"-"),size_label:size,stock_quantity:10,sku:"DEMO-"+product.slug+"-"+size}));
}
function normalizeGuestCart(){state.cart=state.cart.map(item=>{const variant=resolveCartVariant(item,variantById,defaultVariant);if(!variant&&item.variantId&&item.variantId!=="local-default")return item;return {...item,variantId:variant?.id||item.variantId||"local-default",size:item.size||variant?.size_label||"One size"};}).filter(item=>Number.isInteger(item.id));}
function nameOf(product){return state.lang==="hi"?(product.hi||product.name):product.name;}
function categoryOf(product){return state.lang==="hi"?(product.categoryHi||CATEGORY_HI[product.category]||product.category):product.category;}
function badgeOf(product){if(state.lang!=="hi")return product.badge||"";return ({BESTSELLER:"सबसे लोकप्रिय","JUST IN":"नया आया",NEW:"नया"})[product.badge]||product.badge||"";}
function renderPageTranslations(){
 document.documentElement.lang=state.lang;
 const search=$("#collection-search");if(search)search.placeholder=translate("search");
 $$("[data-page-copy]").forEach(node=>{
  const key=node.dataset.pageCopy;if(translate(key)===key)return;
  const count=node.querySelector(".page-count");
  if(count&&node.firstChild?.nodeType===3)node.firstChild.textContent=translate(key)+" ";
  else node.textContent=translate(key);
 });
 const language=$("#page-language");if(language){language.textContent=state.lang==="en"?"हिंदी में देखें":"View in English";language.setAttribute("aria-label",state.lang==="en"?"पेज हिंदी में बदलें":"Switch page to English");language.setAttribute("aria-pressed",String(state.lang==="hi"));}
 const count=$("#page-cart-count");if(count)count.textContent=String(state.cart.reduce((sum,item)=>sum+item.qty,0));
}
async function loadCatalogue(){
 try{
  const [productsResult,variantsResult,imagesResult]=await Promise.all([
   supabase.from("sm_products").select("id,slug,name_en,name_hi,description_en,description_hi,price_inr,compare_at_price_inr,colour_en,colour_hi,featured,status").eq("status","active"),
   supabase.from("sm_variants").select("id,product_id,size_label,stock_quantity,sku"),
   supabase.from("sm_product_images").select("id,product_id,image_path,alt_en,alt_hi,sort_order").order("sort_order")
  ]);
  if(productsResult.error)throw productsResult.error;
  if(variantsResult.error)throw variantsResult.error;
  const fallbackBySlug=Object.fromEntries(PRODUCTS.map(p=>[p.slug,p]));
  const imagesByProduct={};
  if(!imagesResult.error)(imagesResult.data||[]).forEach(image=>{if(!imagesByProduct[image.product_id])imagesByProduct[image.product_id]=[];if(String(image.image_path||"").startsWith("/images/"))imagesByProduct[image.product_id].push(image);});
  const variantsByProduct={};
  if(!variantsResult.error)(variantsResult.data||[]).forEach(v=>{if(!variantsByProduct[v.product_id])variantsByProduct[v.product_id]=[];variantsByProduct[v.product_id].push({id:v.id,size_label:v.size_label,stock_quantity:Number(v.stock_quantity)||0,sku:v.sku});});
  if(Array.isArray(productsResult.data)&&productsResult.data.length){
   state.products=productsResult.data.map((row,index)=>{
    const fallback=fallbackBySlug[row.slug]||{},images=(imagesByProduct[row.id]||[]).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    return {...fallback,id:Number.isInteger(fallback.id)?fallback.id:index+101,dbId:row.id,slug:row.slug,
     name:row.name_en||fallback.name||row.slug,hi:row.name_hi||fallback.hi||row.name_en||row.slug,
     description:row.description_en||fallback.description||"",descriptionHi:row.description_hi||fallback.descriptionHi||"",
     price:Number(row.price_inr??fallback.price??0),oldPrice:row.compare_at_price_inr??fallback.oldPrice,
     color:row.colour_en||fallback.color||"",colorHi:row.colour_hi||fallback.colorHi||fallback.color||"",
     tag:fallback.tag||(row.featured?"new":"popular"),tone:fallback.tone||"#e9e5dd",
     image:images[0]?.image_path||fallback.image||"/images/editorial-detail.svg",
     imageAlt:state.lang==="hi"?(images[0]?.alt_hi||fallback.hi||row.name_hi):(images[0]?.alt_en||fallback.name||row.name_en),
     images:images.map(image=>({src:image.image_path,alt:state.lang==="hi"?(image.alt_hi||row.name_hi):(image.alt_en||row.name_en)})),
     category:fallback.category||"Clothing",categoryHi:fallback.categoryHi||"कपड़े",
     badge:fallback.badge,variants:variantsByProduct[row.id]?.length?variantsByProduct[row.id]:localVariantsFor({...fallback,id:Number.isInteger(fallback.id)?fallback.id:index+101,slug:row.slug,category:fallback.category||"Clothing"})};
   });
   const databaseSlugs=new Set(state.products.map(product=>product.slug));
   state.products.push(...PRODUCTS.filter(product=>!databaseSlugs.has(product.slug)).map(product=>({...product,variants:localVariantsFor(product)})));
  }else{
   state.products=PRODUCTS.map(p=>({...p,variants:localVariantsFor(p)}));
  }
 }catch(error){
  console.error("Supabase catalogue unavailable; using local catalogue",error);
  state.products=PRODUCTS.map(p=>({...p,variants:localVariantsFor(p)}));
 }
 productBySlug=Object.fromEntries(state.products.map(p=>[p.slug,p]));
 productByDbId=Object.fromEntries(state.products.filter(p=>p.dbId).map(p=>[p.dbId,p]));
 variantById=Object.fromEntries(state.products.flatMap(p=>(p.variants||[]).map(v=>[v.id,{...v,productId:p.id}])));
 state.dbIds=Object.fromEntries(state.products.filter(p=>p.dbId).map(p=>[p.id,p.dbId]));
 normalizeGuestCart();
}
async function persistCart(userId,cartSnapshot,databaseIds){
 if(!userId||state.user?.id!==userId)return;
 const rows=cartSnapshot.map(item=>({user_id:userId,product_id:databaseIds[item.id],variant_id:item.variantId,quantity:item.qty,updated_at:new Date().toISOString()}))
  .filter(row=>row.product_id&&row.variant_id&&!String(row.variant_id).startsWith("local-"));
 const {data:existing,error:readError}=await supabase.from("sm_cart_items").select("product_id,variant_id").eq("user_id",userId);
 if(readError)throw readError;
 if(state.user?.id!==userId)return;
 if(rows.length){const {error}=await supabase.from("sm_cart_items").upsert(rows,{onConflict:"user_id,product_id,variant_id"});if(error)throw error;}
 if(state.user?.id!==userId)return;
 const active=new Set(rows.map(row=>row.product_id+":"+row.variant_id));
 for(const row of (existing||[]).filter(item=>!active.has(item.product_id+":"+item.variant_id))){
  if(state.user?.id!==userId)return;
  const {error}=await supabase.from("sm_cart_items").delete().eq("user_id",userId).eq("product_id",row.product_id).eq("variant_id",row.variant_id);if(error)throw error;
 }
}
async function persistWishlist(userId,wishlistSnapshot,databaseIds){
 if(!userId||state.user?.id!==userId)return;
 const rows=wishlistSnapshot.map(id=>({user_id:userId,product_id:databaseIds[id]})).filter(row=>row.product_id);
 const {data:existing,error:readError}=await supabase.from("sm_wishlists").select("product_id").eq("user_id",userId);if(readError)throw readError;
 if(state.user?.id!==userId)return;
 if(rows.length){const {error}=await supabase.from("sm_wishlists").upsert(rows,{onConflict:"user_id,product_id"});if(error)throw error;}
 if(state.user?.id!==userId)return;
 const active=new Set(rows.map(row=>row.product_id)),stale=(existing||[]).map(row=>row.product_id).filter(id=>!active.has(id));
 if(stale.length){
  if(state.user?.id!==userId)return;
  const {error}=await supabase.from("sm_wishlists").delete().eq("user_id",userId).in("product_id",stale);if(error)throw error;
 }
}
let checkoutInProgress=false;
let cartSaveQueue=Promise.resolve();
let wishlistSaveQueue=Promise.resolve();
function saveCart(){
 const userId=state.user?.id||null;
 const cartSnapshot=state.cart.map(item=>({...item}));
 const databaseIds={...state.dbIds};
 if(!userId){writeStorage("sm_guest_cart",cartSnapshot);return Promise.resolve();}
 writeStorage("sm_user_cart_"+userId,cartSnapshot);
 cartSaveQueue=cartSaveQueue.catch(()=>{}).then(()=>persistCart(userId,cartSnapshot,databaseIds));
 return cartSaveQueue;
}
function saveWishlist(){
 const userId=state.user?.id||null;
 const wishlistSnapshot=[...state.wishlist];
 const databaseIds={...state.dbIds};
 if(!userId){writeStorage("sm_guest_wishlist",wishlistSnapshot);return Promise.resolve();}
 writeStorage("sm_user_wishlist_"+userId,wishlistSnapshot);
 wishlistSaveQueue=wishlistSaveQueue.catch(()=>{}).then(()=>persistWishlist(userId,wishlistSnapshot,databaseIds));
 return wishlistSaveQueue;
}
let restoreSequence=0;
async function restoreUser(user){
 const sequence=++restoreSequence,cartRevisionAtStart=state.cartRevision;
 state.user=user||null;
 if(!user){state.cart=guestCart();normalizeGuestCart();state.wishlist=guestWishlist();return;}
 const [wishResult,cartResult]=await Promise.all([
  supabase.from("sm_wishlists").select("product_id").eq("user_id",user.id),
  supabase.from("sm_cart_items").select("product_id,variant_id,quantity").eq("user_id",user.id)
 ]);
 if(wishResult.error)throw wishResult.error;if(cartResult.error)throw cartResult.error;
 if(sequence!==restoreSequence||state.user?.id!==user.id)return;
 const oldGuestCart=guestCart(),oldGuestWishlist=guestWishlist(),accountWishlist=userWishlist(user.id),accountCache=readStorage("sm_user_cart_"+user.id,[]),cartByKey=new Map();
 const recoveryCart=Array.isArray(accountCache)?accountCache.filter(item=>Number.isInteger(item?.id)&&Number.isInteger(item?.qty)&&item.qty>0):[];
 (cartResult.data||[]).forEach(row=>{
  const product=productByDbId[row.product_id],variant=variantById[row.variant_id];
  if(!product||!variant||variant.stock_quantity<=0)return;
  const key=product.id+":"+variant.id;
  cartByKey.set(key,{id:product.id,variantId:variant.id,size:variant.size_label,qty:Math.min(variant.stock_quantity,99,Math.max(1,Number(row.quantity)||1))});
 });
 oldGuestCart.forEach(item=>{
  const variant=resolveCartVariant(item,variantById,defaultVariant);if(!variant||variant.stock_quantity<=0)return;
  const key=item.id+":"+variant.id,existing=cartByKey.get(key);
  cartByKey.set(key,{id:item.id,variantId:variant.id,size:item.size||variant.size_label,qty:Math.min(variant.stock_quantity,99,(existing?.qty||0)+item.qty)});
 });
 recoveryCart.forEach(item=>{
  const variant=resolveCartVariant(item,variantById,defaultVariant);if(!variant||variant.stock_quantity<=0)return;
  const key=item.id+":"+variant.id,existing=cartByKey.get(key),qty=Math.min(variant.stock_quantity,99,item.qty);
  if(!existing||qty>existing.qty)cartByKey.set(key,{id:item.id,variantId:variant.id,size:item.size||variant.size_label,qty});
 });
 const cartChangedDuringRestore=state.cartRevision!==cartRevisionAtStart;
 if(!cartChangedDuringRestore)state.cart=[...cartByKey.values()];
 const dbWishlist=(wishResult.data||[]).map(row=>productByDbId[row.product_id]?.id).filter(Number.isInteger);
 state.wishlist=[...new Set([...dbWishlist,...oldGuestWishlist,...accountWishlist])];
 if(!cartChangedDuringRestore&&(oldGuestCart.length||oldGuestWishlist.length||accountWishlist.length||recoveryCart.length)){await Promise.all([saveCart(),saveWishlist()]);writeStorage("sm_guest_cart",[]);writeStorage("sm_guest_wishlist",[]);}
 else if(cartChangedDuringRestore){await saveCart();}
}
function card(product){
 const saved=state.wishlist.includes(product.id);
 const sizes=(product.variants||[]).filter(variant=>variant.stock_quantity>0);
 const actionLabel=sizes.length>1?translate("chooseSize"):translate("add");
 return '<article class="product-card"><div class="product-image" style="background:'+escapeHtml(product.tone||"#e9e5dd")+'"><a class="product-image-link" href="/product.html?slug='+encodeURIComponent(product.slug)+'"><img loading="lazy" src="'+escapeHtml(product.image)+'" alt="'+escapeHtml(product.imageAlt||nameOf(product))+'"></a>'+(product.badge?'<span class="badge">'+escapeHtml(badgeOf(product))+'</span>':'')+'<button class="wish-button '+(saved?"is-wished":"")+'" data-action="toggle-wishlist" data-product="'+product.id+'" type="button" aria-label="'+escapeHtml(translate("saved"))+'">♥</button></div><div class="product-meta"><div><span class="product-category">'+escapeHtml(categoryOf(product))+'</span><a class="product-name-link" href="/product.html?slug='+encodeURIComponent(product.slug)+'"><h3>'+escapeHtml(nameOf(product))+'</h3></a><span class="product-color">'+escapeHtml(state.lang==="hi"?(product.colorHi||product.color):(product.color||""))+'</span></div><div class="product-prices"><b>'+price(product.price)+'</b>'+(product.oldPrice?'<del>'+price(product.oldPrice)+'</del>':"")+'</div></div><button class="product-add" data-action="add-default" data-product="'+product.id+'" type="button"><span>'+escapeHtml(actionLabel)+'</span><span>＋</span></button></article>';
}
function renderCollection(){
 const grid=$("#collection-grid");if(!grid)return;
 const select=$("#collection-category"),prior=select?.value||"All";
 if(select){
  select.innerHTML=CATEGORIES.map(value=>'<option value="'+escapeHtml(value)+'">'+escapeHtml(state.lang==="hi"?(CATEGORY_HI[value]||value):value)+'</option>').join("");
  select.value=CATEGORIES.includes(prior)?prior:"All";
 }
 const sortSelect=$("#collection-sort");
 if(sortSelect)[...sortSelect.options].forEach(option=>{const key=option.value;if(translate(key)!==key)option.textContent=translate(key);});
 const priceSelect=$("#collection-price"),priceValue=priceSelect?.value||"all";
 if(priceSelect)[...priceSelect.options].forEach(option=>{const key=({all:"allPrices",under1500:"under1500","1500-2500":"range1500",above2500:"above2500"})[option.value];if(key)option.textContent=translate(key);});
 const colorSelect=$("#collection-color"),priorColor=colorSelect?.value||"All";
 if(colorSelect){
  const colors=[...new Set(state.products.map(product=>product.color).filter(Boolean))];
  colorSelect.innerHTML='<option value="All">'+escapeHtml(translate("allColours"))+'</option>'+colors.map(color=>{
   const sample=state.products.find(product=>product.color===color);
   const label=state.lang==="hi"?(sample?.colorHi||color):color;
   return '<option value="'+escapeHtml(color)+'">'+escapeHtml(label)+'</option>';
  }).join("");
  colorSelect.value=priorColor==="All"||colors.includes(priorColor)?priorColor:"All";
 }
 const query=($("#collection-search")?.value||"").trim().toLocaleLowerCase();
 const category=select?.value||"All",sort=sortSelect?.value||"recommended",color=colorSelect?.value||"All";
 let list=state.products.filter(product=>{
  const matchesCategory=category==="All"||(category==="New in"?product.tag==="new":category==="Clothing"?!["Accessories","Shoes"].includes(product.category):product.category===category);
  const matchesQuery=!query||[product.name,product.hi,product.category,product.categoryHi,product.color,product.colorHi].some(value=>String(value||"").toLocaleLowerCase().includes(query));
  const matchesPrice=priceValue==="all"||(priceValue==="under1500"?product.price<1500:priceValue==="1500-2500"?product.price>=1500&&product.price<=2500:priceValue==="above2500"?product.price>2500:true);
  const matchesColor=color==="All"||product.color===color;
  const audience=product.audience||"unisex";
  const pageFilter=document.body.dataset.categoryFilter||"";
  const matchesAudience=!pageFilter||(pageFilter==="new"?product.tag==="new":pageFilter==="women"?["women","unisex"].includes(audience):pageFilter==="men"?["men","unisex"].includes(audience):true);
  return matchesCategory&&matchesQuery&&matchesPrice&&matchesColor&&matchesAudience;
 });
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(card).join("");
 $("#collection-result-label").textContent=state.lang==="hi"?(CATEGORY_HI[category]||category):(category==="All"?translate("allPieces"):category);
 $("#collection-result-count").textContent=list.length+" "+(state.lang==="hi"?"प्रोडक्ट":"PIECES");
 $("#collection-empty").hidden=list.length>0;
}
function renderProduct(){
 const root=$("#product-page");if(!root)return;
 const slug=new URLSearchParams(location.search).get("slug"),product=productBySlug[slug];
 if(!product){root.innerHTML='<div class="page-empty"><h2>'+escapeHtml(translate("productNotFound"))+'</h2><a class="button button-dark" href="/collection.html">'+escapeHtml(translate("back"))+'</a></div>';return;}
 $("#product-breadcrumb").textContent=nameOf(product);
 const available=(product.variants||[]).filter(v=>v.stock_quantity>0);
 const images=(product.images&&product.images.length?product.images:[{src:product.image,alt:product.imageAlt||nameOf(product)},{src:"/images/editorial-detail.svg",alt:nameOf(product)}]);
 const gallery='<div class="product-gallery">'+images.slice(0,3).map((image,index)=>'<img class="'+(index===0?"product-gallery-main":"product-gallery-secondary")+'" src="'+escapeHtml(image.src)+'" alt="'+escapeHtml(image.alt||nameOf(product))+'" loading="'+(index===0?"eager":"lazy")+'">').join("")+'</div>';
 const sizes=available.length?available.map((variant,index)=>'<option value="'+escapeHtml(variant.id)+'"'+(index===0?" selected":"")+'>'+escapeHtml(variant.size_label)+' · '+variant.stock_quantity+' '+escapeHtml(translate("instockQty"))+'</option>').join(""):'<option value="">'+escapeHtml(translate("outOfStock"))+'</option>';
 const oldPrice=product.oldPrice?'<del>'+price(product.oldPrice)+'</del>':"";
 const saved=state.wishlist.includes(product.id);
 root.innerHTML=gallery+'<section class="product-detail-copy"><div class="page-breadcrumb"><a href="/collection.html">'+escapeHtml(translate("back"))+'</a><span>/</span><span>'+escapeHtml(categoryOf(product))+'</span></div><p class="eyebrow">'+escapeHtml(categoryOf(product))+' / '+escapeHtml(product.color||"")+'</p><h1>'+escapeHtml(nameOf(product))+'</h1><div class="product-detail-price"><strong>'+price(product.price)+'</strong>'+oldPrice+'</div><p class="stock-note">'+escapeHtml(available.length?translate("inStock"):translate("outOfStock"))+'</p><p class="product-detail-description">'+escapeHtml(state.lang==="hi"?(product.descriptionHi||"रोज़ पहनने के लिए सोच-समझकर चुना गया प्रोडक्ट। बेहतर फिट और आसान स्टाइल के लिए बनाया गया।"):(product.description||"A considered everyday piece designed to fit easily into your wardrobe. Made for simple styling and repeat wear."))+'</p><p class="eyebrow size-title">'+escapeHtml(translate("size"))+'</p><label class="detail-size-field"><span>'+escapeHtml(translate("sizeLabel"))+'</span><select id="detail-size" '+(!available.length?"disabled":"")+'>'+sizes+'</select></label><label class="detail-quantity"><span>'+escapeHtml(translate("qty"))+'</span><input id="detail-quantity" type="number" min="1" max="99" step="1" inputmode="numeric" value="1"></label><button class="button button-dark product-detail-add" data-action="add-detail" data-product="'+product.id+'" '+(!available.length?"disabled":"")+'>'+escapeHtml(translate("add"))+' ↗</button><button class="button product-detail-wish '+(saved?"is-wished":"")+'" data-action="toggle-wishlist" data-product="'+product.id+'" type="button">'+escapeHtml(saved?translate("removeWish"):translate("savedButton"))+'</button><p class="shipping-note">'+escapeHtml(translate("ship"))+'</p><div class="detail-extra"><h2>'+escapeHtml(translate("details"))+'</h2><p>'+escapeHtml(state.lang==="hi"?(product.descriptionHi||"सामग्री, फिट और साइज़ की जानकारी के लिए चयनित वैरिएंट देखें।"):(product.description||"Choose an available size before adding this piece to your bag."))+'</p></div></section>';
 const related=$("#related-grid");if(related)related.innerHTML=state.products.filter(p=>p.id!==product.id&&p.category===product.category).slice(0,4).map(card).join("");
}
function renderCart(){
 const root=$("#cart-page");if(!root)return;
 const rows=state.cart.map(item=>({item,product:state.products.find(p=>p.id===item.id)})).filter(row=>row.product);
 const subtotal=rows.reduce((sum,row)=>sum+row.product.price*row.item.qty,0);
 if(!rows.length){root.innerHTML='<div class="page-empty"><p>'+escapeHtml(translate("emptyCart"))+'</p><a class="button button-dark" href="/collection.html">'+escapeHtml(translate("continueShopping"))+'</a></div>';return;}
 root.innerHTML='<div class="cart-layout"><div class="cart-items">'+rows.map(({item,product})=>'<article class="cart-page-item"><a href="/product.html?slug='+encodeURIComponent(product.slug)+'"><img src="'+escapeHtml(product.image)+'" alt="'+escapeHtml(nameOf(product))+'"></a><div class="cart-page-item-info"><span class="product-category">'+escapeHtml(categoryOf(product))+'</span><h2><a href="/product.html?slug='+encodeURIComponent(product.slug)+'">'+escapeHtml(nameOf(product))+'</a></h2><p>'+escapeHtml(translate("sizeLabel"))+': <strong>'+escapeHtml(item.size||"One size")+'</strong></p><strong>'+price(product.price)+'</strong><div class="quantity-control"><button data-action="quantity-down" data-product="'+item.id+'" data-variant="'+escapeHtml(item.variantId)+'" aria-label="Decrease quantity">−</button><span>'+item.qty+'</span><button data-action="quantity-up" data-product="'+item.id+'" data-variant="'+escapeHtml(item.variantId)+'" aria-label="Increase quantity">＋</button></div><button class="text-link" data-action="remove-cart" data-product="'+item.id+'" data-variant="'+escapeHtml(item.variantId)+'">'+escapeHtml(translate("remove"))+'</button></div><strong class="cart-line-total">'+price(product.price*item.qty)+'</strong></article>').join("")+'</div><aside class="cart-summary"><p class="eyebrow">'+escapeHtml(translate("subtotal"))+'</p><div><span>'+escapeHtml(translate("subtotal"))+'</span><strong>'+price(subtotal)+'</strong></div><p>'+escapeHtml(translate("demoCheckout"))+'</p><a class="button button-dark full" href="/checkout.html">'+escapeHtml(translate("checkout"))+'</a><a href="/collection.html" class="text-link">'+escapeHtml(translate("continueShopping"))+'</a></aside></div>';
}
function renderWishlist(){
 const root=$("#wishlist-page");if(!root)return;
 const list=state.wishlist.map(id=>state.products.find(p=>p.id===id)).filter(Boolean);
 root.innerHTML=list.length?'<div class="page-product-grid wishlist-grid">'+list.map(product=>card(product).replace('data-action="add-default"','data-action="add-default"')).join("")+'</div>':'<div class="page-empty"><p>'+escapeHtml(translate("emptyWish"))+'</p><a href="/collection.html" class="button button-dark">'+escapeHtml(translate("continueShopping"))+'</a></div>';
}
function renderAccount(){
 const root=$("#account-page");if(!root)return;
 if(state.user){
  const fullName=state.user.user_metadata?.full_name||state.user.user_metadata?.name||"";
  const orders=loadDemoOrders();
  const orderHistory='<section class="account-orders"><h2>'+escapeHtml(translate("demoOrderHistory"))+'</h2>'+(orders.length?orders.map(order=>'<article class="account-order"><div><strong>'+escapeHtml(order.id)+'</strong><span>'+escapeHtml(new Date(order.createdAt).toLocaleDateString(state.lang==="hi"?"hi-IN":"en-IN"))+'</span></div><p>'+escapeHtml(translate("demoOrderStatus"))+'</p><strong>'+price(order.total)+'</strong><small>'+escapeHtml(order.items.length+' '+(state.lang==="hi"?"आइटम":"items"))+'</small></article>').join(""):'<p class="account-help">'+escapeHtml(translate("demoOrderEmpty"))+'</p>')+'</section>';
  root.innerHTML='<p class="eyebrow">'+escapeHtml(translate("profile"))+'</p><p class="account-help">'+escapeHtml(translate("accountHelp"))+'</p><form id="profile-form" class="page-form">'+
   '<label>'+escapeHtml(translate("fullName"))+'<input name="full_name" maxlength="100" required value="'+escapeHtml(fullName)+'"></label>'+
   '<label>'+escapeHtml(translate("email"))+'<input name="email" type="email" required value="'+escapeHtml(state.user.email||"")+'"></label>'+
   '<button class="button button-dark" type="submit">'+escapeHtml(translate("saveProfile"))+' ↗</button></form>'+orderHistory+'<button class="button account-signout" type="button" data-action="signout">'+escapeHtml(translate("signOut"))+'</button><p class="auth-notice" id="account-message" role="status" hidden></p>';
 }else{
  root.innerHTML='<p class="account-help">'+escapeHtml(translate("accountHelp"))+'</p><div class="auth-tabs"><button type="button" data-action="auth-mode" data-mode="signin" class="'+(state.authMode==="signin"?"is-active":"")+'">'+escapeHtml(translate("signIn"))+'</button><button type="button" data-action="auth-mode" data-mode="signup" class="'+(state.authMode==="signup"?"is-active":"")+'">'+escapeHtml(translate("createAccount"))+'</button></div><form id="account-auth-form" class="page-form">'+
   '<label data-name-field '+(state.authMode!=="signup"?"hidden":"")+'>'+escapeHtml(translate("fullName"))+'<input name="full_name" autocomplete="name" maxlength="100" '+(state.authMode==="signup"?"required":"")+'></label>'+
   '<label>'+escapeHtml(translate("email"))+'<input name="email" type="email" autocomplete="email" required></label>'+
   '<label>'+escapeHtml(translate("password"))+'<input name="password" type="password" minlength="8" autocomplete="'+(state.authMode==="signin"?"current-password":"new-password")+'" required></label>'+
   '<p class="auth-notice" id="account-message" role="status" hidden></p><button class="button button-dark" type="submit">'+escapeHtml(translate(state.authMode==="signin"?"submit":"confirm"))+' ↗</button></form>';
 }
}
function renderSearch(){
 const input=$("#site-search"),grid=$("#site-search-results");
 if(!input||!grid)return;
 const params=new URLSearchParams(location.search);
 if(!input.dataset.initialized){input.value=params.get("q")||"";input.dataset.initialized="true";}
 const select=$("#site-search-category"),prior=select?.value||"All";
 if(select){select.innerHTML=CATEGORIES.map(value=>'<option value="'+escapeHtml(value)+'">'+escapeHtml(state.lang==="hi"?(CATEGORY_HI[value]||value):value)+'</option>').join("");select.value=CATEGORIES.includes(prior)?prior:"All";}
 const query=input.value.trim().toLocaleLowerCase(),category=select?.value||"All",sort=$("#site-search-sort")?.value||"recommended";
 let list=state.products.filter(product=>{
  const fields=[product.name,product.hi,product.category,product.categoryHi,product.color,product.colorHi,product.slug];
  const matchesQuery=!query||fields.some(value=>String(value||"").toLocaleLowerCase().includes(query));
  const matchesCategory=category==="All"||(category==="New in"?product.tag==="new":category==="Clothing"?!["Accessories","Shoes"].includes(product.category):product.category===category);
  return matchesQuery&&matchesCategory;
 });
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(card).join("");
 const count=$("#site-search-count"),label=$("#site-search-label"),empty=$("#site-search-empty");
 if(count)count.textContent=String(list.length)+" "+(state.lang==="hi"?"प्रोडक्ट":"PIECES");
 if(label)label.textContent=query?(state.lang==="hi"?"खोज परिणाम":"Search results"):translate("allPieces");
 if(empty)empty.hidden=list.length>0;
}
function renderCheckout(){
 const root=$("#checkout-page");if(!root)return;
 const orderId=new URLSearchParams(location.search).get("demo-order");
 if(orderId){
  const order=loadDemoOrders().find(item=>item.id===orderId);
  if(order){
   root.innerHTML='<div class="page-empty demo-order-success"><p class="eyebrow">'+escapeHtml(translate("demoOrderStatus"))+'</p><h2>'+escapeHtml(translate("demoOrderSuccess"))+'</h2><p>'+escapeHtml(translate("demoOrderId"))+': <strong>'+escapeHtml(order.id)+'</strong></p><p>'+escapeHtml(translate("checkoutSubtotal"))+': <strong>'+price(order.total)+'</strong></p><a class="button button-dark" href="/collection.html">'+escapeHtml(translate("demoOrderContinue"))+'</a> <a class="text-link" href="/account.html">'+escapeHtml(translate("account"))+' ↗</a></div>';
   return;
  }
 }
 const rows=state.cart.map(item=>({item,product:state.products.find(p=>p.id===item.id)})).filter(row=>row.product);
 const subtotal=rows.reduce((sum,row)=>sum+row.product.price*row.item.qty,0);
 if(!rows.length){root.innerHTML='<div class="page-empty"><p>'+escapeHtml(translate("checkoutEmpty"))+'</p><a class="button button-dark" href="/collection.html">'+escapeHtml(translate("continueShopping"))+'</a></div>';return;}
 root.innerHTML='<div class="cart-layout"><div class="cart-items"><h2>'+escapeHtml(translate("checkoutItems"))+'</h2>'+rows.map(({item,product})=>'<article class="cart-page-item"><a href="/product.html?slug='+encodeURIComponent(product.slug)+'"><img src="'+escapeHtml(product.image)+'" alt="'+escapeHtml(nameOf(product))+'"></a><div class="cart-page-item-info"><h2><a href="/product.html?slug='+encodeURIComponent(product.slug)+'">'+escapeHtml(nameOf(product))+'</a></h2><p>'+escapeHtml(translate("sizeLabel"))+': <strong>'+escapeHtml(item.size||"One size")+'</strong></p><p>'+escapeHtml(translate("qty"))+': '+item.qty+'</p></div><strong class="cart-line-total">'+price(product.price*item.qty)+'</strong></article>').join("")+'</div><aside class="cart-summary"><p class="eyebrow">'+escapeHtml(translate("checkoutItems"))+'</p><div><span>'+escapeHtml(translate("checkoutSubtotal"))+'</span><strong>'+price(subtotal)+'</strong></div><p>'+escapeHtml(translate("checkoutNotice"))+'</p><button class="button button-dark full" data-action="checkout-demo" type="button">'+escapeHtml(translate("checkoutAction"))+'</button><a href="/cart.html" class="text-link">'+escapeHtml(translate("backToBag"))+'</a></aside></div>';
}
function renderCurrentPage(){
 renderPageTranslations();
 if(page==="collection"||page==="category")renderCollection();
 if(page==="search")renderSearch();
 if(page==="checkout")renderCheckout();
 if(page==="product")renderProduct();
 if(page==="cart")renderCart();
 if(page==="wishlist")renderWishlist();
 if(page==="account")renderAccount();
}
async function addToCart(productId,variantId,quantity=1){
 const product=state.products.find(p=>p.id===Number(productId));if(!product)throw new Error("Product not found");
 const variant=(variantId&&variantById[variantId])||defaultVariant(product.id);
 if(!variant||variant.stock_quantity<=0)throw new Error(translate("invalidSize"));
 const existing=state.cart.find(item=>item.id===product.id&&item.variantId===variant.id);
 const requestedQuantity=quantity;
 if(!isValidCartQuantity(requestedQuantity))throw new Error(state.lang==="hi"?"मात्रा 1 से 99 तक पूर्ण संख्या होनी चाहिए।":"Quantity must be a whole number from 1 to 99.");
 const amount=Number(requestedQuantity);
 if((existing?.qty||0)+amount>variant.stock_quantity)throw new Error(state.lang==="hi"?"चुने गए साइज़ का पर्याप्त स्टॉक उपलब्ध नहीं है।":"There is not enough stock for the selected size.");
 if(existing)existing.qty+=amount;
 else state.cart.push({id:product.id,variantId:variant.id,size:variant.size_label,qty:amount});
 state.cartRevision++;
 await saveCart();renderPageAfterState();toast(translate("added"));
}
async function toggleWishlist(productId){
 const id=Number(productId),has=state.wishlist.includes(id);
 state.wishlist=has?state.wishlist.filter(item=>item!==id):[...state.wishlist,id];
 await saveWishlist();renderPageAfterState();toast(translate(has?"removedToast":"savedToast"));
}
function renderPageAfterState(){
 renderPageTranslations();
 if(page==="collection"||page==="category")renderCollection();if(page==="search")renderSearch();if(page==="checkout")renderCheckout();if(page==="product")renderProduct();if(page==="cart")renderCart();if(page==="wishlist")renderWishlist();if(page==="account")renderAccount();
}
document.addEventListener("click",async event=>{
 const link=event.target.closest("a[data-action]");if(link&&link.dataset.action==="language-toggle"){event.preventDefault();toggleLanguage();return;}
 const button=event.target.closest("[data-action]");if(!button)return;
 try{
  const action=button.dataset.action;
  if(action==="language-toggle"){toggleLanguage();return;}
  if(action==="toggle-wishlist"){await toggleWishlist(button.dataset.product);return;}
  if(action==="add-default"){const product=state.products.find(item=>item.id===Number(button.dataset.product));if(!product)throw new Error(translate("error"));const available=(product.variants||[]).filter(variant=>variant.stock_quantity>0);if(available.length>1){location.href="/product.html?slug="+encodeURIComponent(product.slug);return;}const variant=available[0]||defaultVariant(button.dataset.product);if(!variant)throw new Error(translate("invalidSize"));await addToCart(button.dataset.product,variant.id,1);return;}
  if(action==="add-detail"){const amount=Number($("#detail-quantity")?.value||1),variantId=$("#detail-size")?.value||"";await addToCart(button.dataset.product,variantId,amount);return;}
  if(action==="remove-cart"){state.cart=state.cart.filter(item=>!(item.id===Number(button.dataset.product)&&item.variantId===button.dataset.variant));state.cartRevision++;await saveCart();renderCart();renderPageTranslations();return;}
  if(action==="quantity-up"||action==="quantity-down"){
   const row=state.cart.find(item=>item.id===Number(button.dataset.product)&&item.variantId===button.dataset.variant);
   if(row){
    const variant=variantById[row.variantId];
    if(!variant||variant.stock_quantity<=0){
     state.cart=state.cart.filter(item=>item!==row);
     await saveCart();renderCart();renderPageTranslations();
     toast(state.lang==="hi"?"यह साइज़ अब उपलब्ध नहीं है।":"This size is no longer available.");
     return;
    }
    const max=Math.min(99,variant.stock_quantity);
    if(action==="quantity-up"&&row.qty>=max){toast(state.lang==="hi"?"इस साइज़ की अधिकतम उपलब्ध मात्रा आपके बैग में है।":"Your bag already has the maximum available stock for this size.");return;}
    row.qty=action==="quantity-up"?Math.min(max,row.qty+1):row.qty-1;
    if(row.qty<1)state.cart=state.cart.filter(item=>item!==row);
    state.cartRevision++;
    await saveCart();renderCart();renderPageTranslations();
   }
   return;
  }
  if(action==="checkout-demo"){
    if(checkoutInProgress)return;
    checkoutInProgress=true;
    button.disabled=true;
    try {
    let cartAdjusted=false;
    const validProductIds=new Set(state.products.map(product=>product.id));
    const reconciledCart=reconcileCartWithStock(state.cart,variantById,validProductIds);
    state.cart=reconciledCart.cart;
    cartAdjusted=reconciledCart.changed;
    if(cartAdjusted){
     state.cartRevision++;
     try{await saveCart();}catch(error){console.warn("Could not persist stock-adjusted cart",error);}
     renderPageAfterState();
     toast(state.lang==="hi"?"स्टॉक के अनुसार बैग अपडेट किया गया है। ऑर्डर देने से पहले जाँच लें।":"Your bag was updated to match available stock. Review it before placing the demo order.");
     return;
    }
    const rows=state.cart.map(item=>({item,product:state.products.find(product=>product.id===item.id)})).filter(row=>row.product);
    if(!rows.length){toast(translate("checkoutEmpty"));return;}
    const order={
    id:"SM-DEMO-"+Date.now().toString(36).toUpperCase(),
    createdAt:new Date().toISOString(),
    status:"demo-only",
    total:rows.reduce((sum,row)=>sum+row.product.price*row.item.qty,0),
    items:rows.map(({item,product})=>({productId:product.id,slug:product.slug,name:nameOf(product),price:product.price,size:item.size||"One size",quantity:item.qty}))
   };
   const orders=loadDemoOrders();orders.unshift(order);
   try{localStorage.setItem(demoOrdersKey(),JSON.stringify(orders.slice(0,20)));}
   catch(error){throw new Error(state.lang==="hi"?"डेमो ऑर्डर सेव नहीं हो सका। ब्राउज़र स्टोरेज जाँचें।":"Could not save the demo order. Check browser storage.");}
   state.cart=[];state.cartRevision++;
   try{await saveCart();}
   catch(error){console.error("Demo order was saved locally, but the remote cart could not be cleared",error);}
   location.href="/checkout.html?demo-order="+encodeURIComponent(order.id);
   return;
    } finally {
      checkoutInProgress=false;
      button.disabled=false;
    }
  }
  if(action==="clear-collection"){if($("#collection-search"))$("#collection-search").value="";if($("#collection-category"))$("#collection-category").value="All";if($("#collection-sort"))$("#collection-sort").value="recommended";if($("#collection-price"))$("#collection-price").value="all";if($("#collection-color"))$("#collection-color").value="All";renderCollection();return;}
  if(action==="clear-search-page"){if($("#site-search"))$("#site-search").value="";if($("#site-search-category"))$("#site-search-category").value="All";if($("#site-search-sort"))$("#site-search-sort").value="recommended";history.replaceState(null,"","/search.html");renderSearch();return;}
  if(action==="auth-mode"){state.authMode=button.dataset.mode==="signup"?"signup":"signin";renderAccount();return;}
  if(action==="signout"){const {error}=await supabase.auth.signOut();if(error)throw error;await restoreUser(null);renderAccount();renderPageTranslations();toast(translate("signedOut"));return;}
 }catch(error){console.error(error);toast(error.message||translate("error"));}
});
document.addEventListener("submit",async event=>{
 if(event.target.id==="account-auth-form"){
  event.preventDefault();const form=new FormData(event.target),email=String(form.get("email")||"").trim(),password=String(form.get("password")||""),full_name=String(form.get("full_name")||"").trim(),message=$("#account-message"),submit=event.target.querySelector('button[type="submit"]');
  submit.disabled=true;message.hidden=true;
  try{
   if(state.authMode==="signup"){
    const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name},emailRedirectTo:location.origin+"/account.html"}});
    if(error)throw error;
    if(data.session){await restoreUser(data.user);renderAccount();renderPageTranslations();toast(translate("signedIn"));}
    else{message.hidden=false;message.className="auth-notice auth-notice-success";message.textContent=translate("checkEmail");}
   }else{
    const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
    await restoreUser(data.user);renderAccount();renderPageTranslations();toast(translate("signedIn"));
   }
  }catch(error){message.hidden=false;message.className="auth-notice auth-notice-error";message.textContent=error.message||translate("error");}
  finally{if(submit)submit.disabled=false;}
  return;
 }
 if(event.target.id==="profile-form"){
  event.preventDefault();const form=new FormData(event.target),full_name=String(form.get("full_name")||"").trim(),email=String(form.get("email")||"").trim();
  const oldEmail=(state.user?.email||"").toLowerCase();
  try{
   const updates={data:{...(state.user?.user_metadata||{}),full_name}};if(email.toLowerCase()!==oldEmail)updates.email=email;
   const {data,error}=await supabase.auth.updateUser(updates);if(error)throw error;
   state.user=data.user;renderAccount();toast(email.toLowerCase()!==oldEmail?(state.lang==="hi"?"ईमेल बदलने के लिए पुष्टि करें।":"Check your email to confirm the email change."):translate("profileSaved"));
  }catch(error){toast(error.message||translate("error"));}
 }
});
$("#collection-search")?.addEventListener("input",renderCollection);
$("#collection-category")?.addEventListener("change",renderCollection);
$("#collection-sort")?.addEventListener("change",renderCollection);
$("#collection-price")?.addEventListener("change",renderCollection);
$("#collection-color")?.addEventListener("change",renderCollection);
$("#site-search")?.addEventListener("input",renderSearch);
$("#site-search-category")?.addEventListener("change",renderSearch);
$("#site-search-sort")?.addEventListener("change",renderSearch);
function toggleLanguage(){
 state.lang=state.lang==="en"?"hi":"en";writeStorage("sm_lang",state.lang);renderCurrentPage();
}
function populateCategorySelect(){
 const select=$("#collection-category");if(!select)return;
 select.innerHTML=CATEGORIES.map(category=>'<option value="'+escapeHtml(category)+'">'+escapeHtml(state.lang==="hi"?(CATEGORY_HI[category]||category):category)+'</option>').join("");
}
async function initialize(){
 await loadCatalogue();
 let session=null;
 try{
  const sessionResult=await supabase.auth.getSession();
  session=sessionResult.data.session||null;
 }catch(error){console.error("Unable to read auth session; continuing with local storefront",error);}
 try{await restoreUser(session?.user||null);}
 catch(error){console.error("Account data could not be restored; keeping storefront available",error);state.user=session?.user||null;toast(state.lang==="hi"?"अकाउंट का डेटा लोड नहीं हुआ। स्थानीय स्टोर जारी है।":"Account data could not be loaded. The local storefront is still available.");}
 supabase.auth.onAuthStateChange((_event,session)=>{setTimeout(async()=>{try{await restoreUser(session?.user||null);renderCurrentPage();}catch(error){console.error(error);toast(translate("error"));}},0);});
 populateCategorySelect();
 renderCurrentPage();
}
await initialize();
