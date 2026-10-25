export type Product = { id: number; name: string; hi: string; category: string; categoryHi: string; price: number; oldPrice?: number; color: string; tone: string; badge?: string; image: string; tag: string; };
const photo = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
export const products: Product[] = [
 {id:1,name:"Relaxed linen-blend shirt",hi:"लिनेन-ब्लेंड रिलैक्स्ड शर्ट",category:"Shirts",categoryHi:"शर्ट",price:1899,oldPrice:2499,color:"Oatmeal",tone:"#c9bda9",badge:"BESTSELLER",image:photo("photo-1603252109303-2751441dd157"),tag:"new"},
 {id:2,name:"Tailored wide-leg trousers",hi:"टेलर्ड वाइड-लेग ट्राउज़र",category:"Trousers",categoryHi:"ट्राउज़र",price:2299,color:"Stone",tone:"#b6aa98",image:photo("photo-1594633312681-425c7b97ccd1"),tag:"new"},
 {id:3,name:"Structured everyday tote",hi:"स्ट्रक्चर्ड एवरीडे टोट",category:"Accessories",categoryHi:"एक्सेसरीज़",price:1599,color:"Espresso",tone:"#604637",badge:"JUST IN",image:photo("photo-1590874103328-eac38a683ce7"),tag:"new"},
 {id:4,name:"Soft-touch knit polo",hi:"सॉफ्ट-टच निट पोलो",category:"Knitwear",categoryHi:"निटवेयर",price:1999,color:"Forest",tone:"#68735c",image:photo("photo-1625910513413-5fc45f16b4c1"),tag:"popular"},
 {id:5,name:"Minimal leather-look sneaker",hi:"मिनिमल स्नीकर्स",category:"Shoes",categoryHi:"जूते",price:2799,oldPrice:3299,color:"Off white",tone:"#e5e0d6",image:photo("photo-1542291026-7eec264c27ff"),tag:"popular"},
 {id:6,name:"Cotton poplin midi dress",hi:"कॉटन पॉपलिन मिडी ड्रेस",category:"Dresses",categoryHi:"ड्रेस",price:2699,color:"Ink",tone:"#282a29",badge:"NEW",image:photo("photo-1595777457583-95e059d581b8"),tag:"new"},
 {id:7,name:"Essential heavyweight tee",hi:"हेवीवेट एसेंशियल टी-शर्ट",category:"T-shirts",categoryHi:"टी-शर्ट",price:899,color:"Cloud",tone:"#e9e5dd",image:photo("photo-1521572163474-6864f9cf17ab"),tag:"popular"},
 {id:8,name:"Modern cropped jacket",hi:"मॉडर्न क्रॉप्ड जैकेट",category:"Outerwear",categoryHi:"जैकेट",price:3499,color:"Moss",tone:"#777b61",image:photo("photo-1591047139829-d91aecb6caea"),tag:"new"},
 {id:9,name:"Pleated easy-fit skirt",hi:"प्लीटेड ईज़ी-फिट स्कर्ट",category:"Skirts",categoryHi:"स्कर्ट",price:1799,color:"Clay",tone:"#b87e68",image:photo("photo-1583496661160-fb5886a0aaaa"),tag:"popular"},
 {id:10,name:"Everyday leather belt",hi:"एवरीडे लेदर बेल्ट",category:"Accessories",categoryHi:"एक्सेसरीज़",price:999,color:"Cognac",tone:"#8c6043",image:photo("photo-1624222247344-550fb8c8f10c"),tag:"popular"},
 {id:11,name:"Textured relaxed sweatshirt",hi:"टेक्सचर्ड रिलैक्स्ड स्वेटशर्ट",category:"Knitwear",categoryHi:"निटवेयर",price:2199,color:"Grey marl",tone:"#a5a39e",image:photo("photo-1556821840-3a63f95609a7"),tag:"new"},
 {id:12,name:"Classic straight denim",hi:"क्लासिक स्ट्रेट डेनिम",category:"Denim",categoryHi:"डेनिम",price:2399,color:"Indigo",tone:"#46586c",image:photo("photo-1542272604-787c3835535d"),tag:"popular"},
];
export const categories = ["All","New in","Clothing","Shirts","T-shirts","Trousers","Dresses","Knitwear","Outerwear","Denim","Shoes","Accessories"];
