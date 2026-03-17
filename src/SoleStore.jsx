import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import imgAirPhantom from "@/assets/products/air-phantom-pro.png";
import imgOxford from "@/assets/products/classic-oxford-elite.png";
import imgStreetwave from "@/assets/products/streetwave-casual.png";
import imgLuna from "@/assets/products/luna-blossom-pump.png";
import imgTrailblazer from "@/assets/products/trailblazer-x9.png";
import imgVelvetDerby from "@/assets/products/velvet-derby.png";
import imgCorkSlide from "@/assets/products/cork-slide-pro.png";
import imgAuraChunky from "@/assets/products/aura-chunky-w.png";
import imgBoostElite from "@/assets/products/boost-elite-pro.png";
import imgWeekendLoafer from "@/assets/products/weekend-loafer.png";
import imgStilettoElegance from "@/assets/products/elegance-stiletto.png";
import imgHeritageBrogue from "@/assets/products/heritage-brogue.png";
import imgWatch from "@/assets/products/luxury-chrono-watch.png";
import imgChain from "@/assets/products/cuban-link-chain.png";
import imgBracelet from "@/assets/products/leather-bracelet.png";
import imgBelt from "@/assets/products/classic-leather-belt.png";
import imgWallet from "@/assets/products/premium-wallet.png";
import imgSunglasses from "@/assets/products/aviator-sunglasses.png";
import imgHeroBanner from "@/assets/hero-banner.png";

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════ */
const C = {
  bg:     "#05050a",
  s1:     "#0d0d14",
  s2:     "#13131c",
  s3:     "#1a1a26",
  s4:     "#222230",
  border: "#282838",
  gold:   "#c8a84b",
  goldL:  "#e6c86a",
  goldD:  "#9e7e2a",
  white:  "#f0f0f5",
  muted:  "#7878a0",
  dim:    "#48485e",
  green:  "#22c55e",
  red:    "#ef4444",
  blue:   "#3b82f6",
  purple: "#8b5cf6",
  pink:   "#ec4899",
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.white};-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${C.s4};border-radius:99px}
input,select,textarea,button{font-family:'DM Sans',sans-serif;outline:none}
button{cursor:pointer;border:none;background:none}

.syne{font-family:'Syne',sans-serif}
.mono{font-family:'JetBrains Mono',monospace}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes toastIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
@keyframes checkPop{0%{transform:scale(0) rotate(-30deg)}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(200,168,75,.12)}50%{box-shadow:0 0 50px rgba(200,168,75,.3)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

.fu{animation:fadeUp .38s cubic-bezier(.16,1,.3,1) both}
.fu1{animation:fadeUp .38s .06s cubic-bezier(.16,1,.3,1) both}
.fu2{animation:fadeUp .38s .12s cubic-bezier(.16,1,.3,1) both}
.fu3{animation:fadeUp .38s .18s cubic-bezier(.16,1,.3,1) both}
.fu4{animation:fadeUp .38s .24s cubic-bezier(.16,1,.3,1) both}
.si{animation:scaleIn .32s cubic-bezier(.16,1,.3,1) both}

.btn-gold{background:linear-gradient(135deg,${C.gold},${C.goldL});color:#000;font-weight:700;border-radius:10px;transition:all .18s;border:none}
.btn-gold:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(200,168,75,.32)}
.btn-gold:active{transform:translateY(0)}
.btn-ghost{background:transparent;border:1px solid ${C.border};color:${C.muted};border-radius:10px;transition:all .18s}
.btn-ghost:hover{border-color:${C.gold}80;color:${C.white}}
.btn-outline{background:transparent;border:1px solid ${C.gold};color:${C.gold};border-radius:10px;transition:all .18s}
.btn-outline:hover{background:${C.gold}18}
.btn-danger{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:${C.red};border-radius:10px;transition:all .18s}
.btn-danger:hover{background:rgba(239,68,68,.15)}

.field{width:100%;background:${C.s3};border:1px solid ${C.border};border-radius:10px;padding:11px 14px;color:${C.white};font-size:13px;transition:border-color .18s,box-shadow .18s}
.field:focus{border-color:${C.gold};box-shadow:0 0 0 3px ${C.gold}18}
.field::placeholder{color:${C.dim}}
select.field{appearance:none;cursor:pointer}

.card{background:${C.s1};border:1px solid ${C.border};border-radius:16px}
.card-lift{transition:transform .22s,box-shadow .22s,border-color .22s}
.card-lift:hover{transform:translateY(-3px);box-shadow:0 18px 50px rgba(0,0,0,.45);border-color:${C.s4}}

.pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.3px}
.chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:7px;font-size:11px;font-weight:600;background:${C.s3};border:1px solid ${C.border};color:${C.muted}}

.nav-item{display:flex;align-items:center;gap:7px;padding:8px 13px;border-radius:9px;font-size:13px;font-weight:500;transition:all .15s;color:${C.muted};background:none;border:none;cursor:pointer}
.nav-item:hover{color:${C.white}}
.nav-item.on{color:${C.gold};background:${C.gold}12}

.tab{padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;transition:all .14s;color:${C.muted};background:none;border:none;cursor:pointer}
.tab.on{color:${C.gold};background:${C.gold}18}
.tab:hover:not(.on){color:${C.white}}

.sb-item{width:100%;text-align:left;padding:8px 12px;border-radius:8px;font-size:13px;cursor:pointer;transition:all .14s;background:none;border:1px solid transparent;color:${C.muted};font-family:'DM Sans',sans-serif}
.sb-item.on{background:${C.gold}12;color:${C.gold};border-color:${C.gold}28}
.sb-item:hover:not(.on){background:${C.s3}}

.size-btn{width:44px;height:44px;border-radius:9px;border:1px solid ${C.border};font-size:13px;font-weight:600;color:${C.muted};transition:all .14s;background:${C.s3};cursor:pointer}
.size-btn:hover:not(.on){border-color:${C.gold}60;color:${C.white}}
.size-btn.on{background:${C.gold};border-color:${C.gold};color:#000}
`;

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const USERS = [
  {id:1,name:"Raj Kumar",email:"raj@sole.com",password:"raj123",phone:"98765 43210",role:"user",initials:"RK",joined:"Oct 2023"},
  {id:2,name:"Priya Sharma",email:"priya@sole.com",password:"priya123",phone:"98765 43211",role:"user",initials:"PS",joined:"Nov 2023"},
  {id:3,name:"Admin",email:"admin@sole.com",password:"admin123",phone:"98765 00000",role:"admin",initials:"AD",joined:"Jan 2023"},
];

const COLOR_MAP = {
  Black:"#1c1c20",White:"#f0f0f4",Red:"#c0392b","Navy Blue":"#1e2f5f",
  "Forest Green":"#1a4731","Rose Gold":"#c9a0a0",Silver:"#9ca3af",
  Orange:"#e07230","Sky Blue":"#3b82f6",Cream:"#f5f0e8",
};

const PRODUCTS = [
  {id:1,name:"Air Phantom Pro",brand:"Nike",price:8999,mrp:12999,cat:"sports",
   desc:"Nike's pinnacle runner with dual Zoom Air cushioning and a carbon fibre plate for explosive energy return. The breathable Flyknit upper wraps your foot like a second skin while the Continental rubber outsole grips any surface.",
   features:["Zoom Air dual cushioning","Carbon fibre plate","Flyknit upper","Continental rubber outsole","Reflective detailing"],
   sizes:[7,8,9,10,11],colors:["Black","White","Red"],stock:24,rating:4.8,reviews:312,badge:"BESTSELLER",img:imgAirPhantom,grad:"135deg,#0f1923,#1a3a5c"},
  {id:2,name:"Classic Oxford Elite",brand:"Clarks",price:5499,mrp:7499,cat:"formal",
   desc:"Timeless Goodyear-welted Oxford in full-grain calfskin. Burnished toe cap, hand-finished patina, and a triple-density insole ensure comfort through the longest days without sacrificing elegance.",
   features:["Full-grain calfskin","Goodyear welt construction","Burnished toe cap","Triple-density insole","Brass eyelets"],
   sizes:[7,8,9,10,11],colors:["Black","Navy Blue"],stock:16,rating:4.6,reviews:189,badge:null,img:imgOxford,grad:"135deg,#1a0e05,#3e2408"},
  {id:3,name:"StreetWave Casual",brand:"Adidas",price:4299,mrp:5999,cat:"casual",
   desc:"All-day comfort meets street style. Recycled-yarn knit upper, Cloudfoam midsole, and a flexible rubber outsole make this the perfect everyday sneaker from campus to café.",
   features:["Recycled knit upper","Cloudfoam midsole","EVA sock liner","Flexible outsole","Eco-friendly materials"],
   sizes:[6,7,8,9,10,11],colors:["White","Black","Sky Blue"],stock:42,rating:4.7,reviews:478,badge:"NEW",img:imgStreetwave,grad:"135deg,#101820,#1e3040"},
  {id:4,name:"Luna Blossom Pump",brand:"Aldo",price:3899,mrp:5299,cat:"women",
   desc:"Modern femininity in a sleek block heel. Vegan suede upper, padded collar, and memory foam insole. The 4cm heel gives lift and stability — perfect from brunch to boardroom.",
   features:["Vegan suede upper","4cm block heel","Memory foam insole","Anti-slip outsole","Padded collar"],
   sizes:[4,5,6,7,8],colors:["Rose Gold","Black","Cream"],stock:28,rating:4.9,reviews:561,badge:"TOP RATED",img:imgLuna,grad:"135deg,#2a0a18,#5c1a32"},
  {id:5,name:"TrailBlazer X9",brand:"New Balance",price:7299,mrp:9999,cat:"sports",
   desc:"Built for serious trail runners. Gore-Tex membrane, Vibram MegaGrip outsole, rock protection plate, and Fresh Foam X midsole handle the toughest terrain while keeping feet fresh.",
   features:["Gore-Tex waterproof","Vibram MegaGrip outsole","Rock plate","Fresh Foam X","Debris gaiters"],
   sizes:[7,8,9,10,11],colors:["Forest Green","Black","Orange"],stock:18,rating:4.7,reviews:203,badge:null,img:imgTrailblazer,grad:"135deg,#0a1a0a,#163418"},
  {id:6,name:"Velvet Derby",brand:"Louis Philippe",price:6999,mrp:9499,cat:"formal",
   desc:"Handcrafted Italian smooth calf leather with antique brass hardware. Dainite rubber sole, arch-support insole system, and polished welt seam make this the definitive formal shoe.",
   features:["Italian calf leather","Dainite rubber sole","Antique brass hardware","Arch support system","Hand-stitched welt"],
   sizes:[7,8,9,10,11],colors:["Black","Navy Blue"],stock:10,rating:4.5,reviews:94,badge:"PREMIUM",img:imgVelvetDerby,grad:"135deg,#080c20,#151a3a"},
  {id:7,name:"Cork Slide Pro",brand:"Birkenstock",price:2999,mrp:3999,cat:"casual",
   desc:"The ultimate recovery slide. Birkenstock's contoured cork-latex footbed moulds to your feet over time. Adjustable buckle strap, natural suede lining, and a lightweight EVA sole.",
   features:["Cork-latex footbed","Natural suede lining","Adjustable buckle","EVA sole","Anatomic contour"],
   sizes:[6,7,8,9,10],colors:["Cream","Black","Silver"],stock:55,rating:4.3,reviews:723,badge:null,img:imgCorkSlide,grad:"135deg,#1a1505,#362b0a"},
  {id:8,name:"Aura Chunky W",brand:"Puma",price:5499,mrp:7499,cat:"women",
   desc:"Athleisure meets high fashion. Premium leather-look upper, tone-on-tone lacing, and a chunky platform sole. SoftFoam+ insole for plush comfort from gym to gallery.",
   features:["Leather-look upper","Platform chunky sole","SoftFoam+ insole","Tone-on-tone lacing","Rubber outsole"],
   sizes:[4,5,6,7,8,9],colors:["White","Rose Gold","Black"],stock:32,rating:4.8,reviews:417,badge:"TRENDING",img:imgAuraChunky,grad:"135deg,#1a0a25,#32104a"},
  {id:9,name:"Boost Elite Pro",brand:"Adidas",price:9499,mrp:12999,cat:"sports",
   desc:"The fastest Adidas shoe. Densest Boost foam for max energy return. Primeknit 360 upper, Continental rubber outsole, and a Torsion midfoot stability system.",
   features:["Boost 360 foam","Primeknit 360 upper","Continental outsole","Torsion stability","Reflective 3-stripes"],
   sizes:[7,8,9,10,11],colors:["White","Black","Orange"],stock:19,rating:4.9,reviews:389,badge:"NEW",img:imgBoostElite,grad:"135deg,#08101e,#102038"},
  {id:10,name:"Weekend Loafer",brand:"Mochi",price:2499,mrp:3499,cat:"casual",
   desc:"Slip-on perfection. Hand-stitched moccasin detailing, buttery leather upper, and a metal snaffle bit add equestrian heritage to your weekend wardrobe.",
   features:["Moccasin hand-stitching","Soft leather upper","Metal snaffle bit","Cushioned footbed","Flexible sole"],
   sizes:[6,7,8,9,10,11],colors:["Navy Blue","Black","Cream"],stock:38,rating:4.4,reviews:256,badge:null,img:imgWeekendLoafer,grad:"135deg,#0c1525,#182438"},
  {id:11,name:"Elegance Stiletto",brand:"Steve Madden",price:4999,mrp:6999,cat:"women",
   desc:"Make an entrance. 9cm stiletto in polished patent leather with a hidden 1cm platform. Padded toe box prevents pinching during long evenings. Available in bold finishes.",
   features:["Patent leather upper","9cm stiletto heel","Hidden 1cm platform","Padded toe box","Non-slip heel cap"],
   sizes:[4,5,6,7,8],colors:["Black","Red","Silver"],stock:21,rating:4.6,reviews:298,badge:null,img:imgStilettoElegance,grad:"135deg,#1a0a0a,#381515"},
  {id:12,name:"Heritage Brogue",brand:"Bata",price:3799,mrp:5299,cat:"formal",
   desc:"Traditional brogue craft, modern comfort. Pebbled leather upper with intricate perforation detailing, memory foam insole, and a flexible rubber heel for all-day formal wear.",
   features:["Pebbled leather","Brogue perforation","Memory foam insole","Flex rubber heel","Antique finish"],
   sizes:[7,8,9,10,11],colors:["Black","Navy Blue"],stock:22,rating:4.3,reviews:134,badge:null,img:imgHeritageBrogue,grad:"135deg,#150a00,#371e08"},
  // Accessories
  {id:13,name:"Luxury Chrono Watch",brand:"Titan",price:4999,mrp:7499,cat:"accessories",
   desc:"Premium chronograph with stainless steel case, sapphire crystal, and Japanese quartz movement. Water-resistant to 100m. The perfect blend of style and precision.",
   features:["Stainless steel case","Sapphire crystal","Japanese quartz","100m water resistant","Chronograph"],
   sizes:[],colors:["Silver","Black"],stock:30,rating:4.8,reviews:245,badge:"BESTSELLER",img:imgWatch,grad:"135deg,#0a1020,#1a2848"},
  {id:14,name:"Cuban Link Chain",brand:"Malabar",price:2999,mrp:4499,cat:"accessories",
   desc:"Bold 18K gold-plated Cuban link chain. 22-inch length with secure lobster clasp. Tarnish-resistant coating ensures lasting shine.",
   features:["18K gold plated","22-inch length","Lobster clasp","Tarnish resistant","Hypoallergenic"],
   sizes:[],colors:["Gold","Silver"],stock:45,rating:4.5,reviews:178,badge:"TRENDING",img:imgChain,grad:"135deg,#1a1505,#362b0a"},
  {id:15,name:"Braided Leather Bracelet",brand:"Fossil",price:1499,mrp:2199,cat:"accessories",
   desc:"Hand-braided genuine leather with stainless steel magnetic clasp. Sleek knot detail adds character. Fits wrists 7-8.5 inches.",
   features:["Genuine leather","Magnetic clasp","Hand-braided","Adjustable fit","Stainless steel"],
   sizes:[],colors:["Black","Brown"],stock:60,rating:4.4,reviews:312,badge:null,img:imgBracelet,grad:"135deg,#0d0d14,#1a1a26"},
  {id:16,name:"Classic Leather Belt",brand:"Louis Philippe",price:1999,mrp:2999,cat:"accessories",
   desc:"Italian full-grain leather belt with brushed nickel buckle. 35mm width, perfect for both formal and casual wear. Feathered edge finishing.",
   features:["Italian full-grain leather","Brushed nickel buckle","35mm width","Feathered edge","Reversible"],
   sizes:[],colors:["Brown","Black"],stock:50,rating:4.6,reviews:198,badge:null,img:imgBelt,grad:"135deg,#1a0e05,#3e2408"},
  {id:17,name:"Premium Bifold Wallet",brand:"Tommy Hilfiger",price:2499,mrp:3499,cat:"accessories",
   desc:"Genuine leather bifold wallet with RFID blocking technology. 8 card slots, 2 note compartments, and a coin pocket. Slim profile fits any pocket.",
   features:["Genuine leather","RFID blocking","8 card slots","Coin pocket","Slim profile"],
   sizes:[],colors:["Black","Brown"],stock:40,rating:4.7,reviews:423,badge:"NEW",img:imgWallet,grad:"135deg,#0d0d14,#1e1e2a"},
  {id:18,name:"Aviator Sunglasses",brand:"Ray-Ban",price:3499,mrp:5299,cat:"accessories",
   desc:"Classic aviator with gold metal frame and gradient UV400 lenses. Adjustable nose pads, spring-loaded temples, and iconic teardrop shape.",
   features:["UV400 protection","Gold metal frame","Gradient lenses","Spring temples","Adjustable nose pads"],
   sizes:[],colors:["Gold","Silver","Black"],stock:35,rating:4.9,reviews:567,badge:"TOP RATED",img:imgSunglasses,grad:"135deg,#1a1505,#2a2510"},
];

const ORDERS_INIT = [
  {id:"SS-2401",uid:1,name:"Raj Kumar",phone:"98765 43210",
   items:[{...PRODUCTS[0],selSize:9,selColor:"Black",qty:1}],
   sub:8999,disc:0,ship:99,total:9098,status:"delivered",
   addr:"23 Anna Nagar West, Chennai — 600 040",date:"2024-01-08",coupon:null,payMethod:"UPI"},
  {id:"SS-2402",uid:2,name:"Priya Sharma",phone:"98765 43211",
   items:[{...PRODUCTS[3],selSize:6,selColor:"Rose Gold",qty:1},{...PRODUCTS[7],selSize:7,selColor:"White",qty:1}],
   sub:9398,disc:940,ship:0,total:8458,status:"shipped",
   addr:"18 T Nagar, Chennai — 600 017",date:"2024-01-14",coupon:"SAVE10",payMethod:"Card"},
  {id:"SS-2403",uid:1,name:"Raj Kumar",phone:"98765 43210",
   items:[{...PRODUCTS[8],selSize:10,selColor:"White",qty:1}],
   sub:9499,disc:500,ship:0,total:8999,status:"processing",
   addr:"23 Anna Nagar West, Chennai — 600 040",date:"2024-01-19",coupon:"FLAT500",payMethod:"UPI"},
  {id:"SS-2404",uid:2,name:"Priya Sharma",phone:"98765 43211",
   items:[{...PRODUCTS[5],selSize:9,selColor:"Black",qty:1}],
   sub:6999,disc:0,ship:99,total:7098,status:"pending",
   addr:"18 T Nagar, Chennai — 600 017",date:"2024-01-21",coupon:null,payMethod:"COD"},
  {id:"SS-2405",uid:1,name:"Raj Kumar",phone:"98765 43210",
   items:[{...PRODUCTS[2],selSize:8,selColor:"White",qty:2}],
   sub:8598,disc:1290,ship:0,total:7308,status:"delivered",
   addr:"23 Anna Nagar West, Chennai — 600 040",date:"2023-12-28",coupon:"SAVE15",payMethod:"UPI"},
];

const COUPONS_INIT = [
  {id:1,code:"SAVE10",type:"percent",value:10,minOrder:2000,active:true,used:87,desc:"10% off above ₹2,000"},
  {id:2,code:"SAVE15",type:"percent",value:15,minOrder:5000,active:true,used:43,desc:"15% off above ₹5,000"},
  {id:3,code:"FLAT500",type:"flat",value:500,minOrder:3000,active:true,used:126,desc:"₹500 off above ₹3,000"},
  {id:4,code:"WELCOME",type:"flat",value:200,minOrder:1000,active:true,used:201,desc:"₹200 welcome offer"},
  {id:5,code:"SUMMER20",type:"percent",value:20,minOrder:4000,active:false,used:312,desc:"20% summer sale (expired)"},
];

const REVENUE = [
  {m:"Aug",rev:42000,orders:28},{m:"Sep",rev:67000,orders:44},{m:"Oct",rev:83000,orders:61},
  {m:"Nov",rev:91000,orders:69},{m:"Dec",rev:148000,orders:112},{m:"Jan",rev:118000,orders:89},
];

const STATUS = {
  pending:   {label:"Pending",    color:"#ca8a04", bg:"rgba(202,138,4,.12)"},
  processing:{label:"Processing", color:"#3b82f6", bg:"rgba(59,130,246,.12)"},
  shipped:   {label:"Shipped",    color:"#8b5cf6", bg:"rgba(139,92,246,.12)"},
  delivered: {label:"Delivered",  color:"#22c55e", bg:"rgba(34,197,94,.12)"},
  cancelled: {label:"Cancelled",  color:"#ef4444", bg:"rgba(239,68,68,.12)"},
};

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
const rupee = n => `₹${Number(n).toLocaleString("en-IN")}`;
const off = (mrp, price) => Math.round(((mrp - price) / mrp) * 100);
const calcDiscount = (coupon, sub) => {
  if (!coupon?.active || sub < coupon.minOrder) return 0;
  return coupon.type === "percent" ? Math.round(sub * coupon.value / 100) : coupon.value;
};

const makeInvoice = (order) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoice ${order.id}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#fff;color:#111;padding:48px;max-width:720px;margin:auto}.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;margin-bottom:24px;border-bottom:3px solid #c8a84b}.brand{font-size:32px;font-weight:900;letter-spacing:4px;color:#c8a84b}.brand-sub{font-size:10px;letter-spacing:5px;color:#888;margin-top:2px;text-transform:uppercase}.inv{text-align:right}.inv h2{font-size:18px;letter-spacing:2px;text-transform:uppercase}.inv p{font-size:12px;color:#666;margin-top:4px}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}.sec-title{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#c8a84b;font-weight:700;margin-bottom:8px}.info p{font-size:13px;line-height:1.9;color:#555}.info strong{color:#111}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#f8f6f0;padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888}td{padding:12px;border-bottom:1px solid #f0f0f0;font-size:13px}.totals{margin-left:auto;width:260px}.t-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#666}.t-grand{border-top:2px solid #c8a84b;margin-top:8px;padding-top:12px;font-size:16px;font-weight:800;color:#111}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center}</style>
</head><body>
<div class="header"><div><div class="brand">SOLESTORE</div><div class="brand-sub">Premium Footwear</div></div><div class="inv"><h2>Invoice</h2><p>${order.id} &bull; ${order.date}</p></div></div>
<div class="grid2">
<div class="info"><div class="sec-title">Bill To</div><p><strong>${order.name}</strong><br>${order.phone}<br>${order.addr}</p></div>
<div class="info"><div class="sec-title">Payment</div><p>Method: <strong>${order.payMethod||"UPI"}</strong><br>Status: <strong style="color:#22c55e">Paid</strong><br>${order.coupon?`Coupon: <strong>${order.coupon}</strong>`:"No coupon"}</p></div>
</div>
<div class="sec-title">Items</div>
<table><thead><tr><th>Product</th><th>Brand</th><th>Size</th><th>Color</th><th>Qty</th><th style="text-align:right">Amount</th></tr></thead>
<tbody>${order.items.map(i=>`<tr><td><strong>${i.name}</strong></td><td>${i.brand}</td><td>UK ${i.selSize}</td><td>${i.selColor}</td><td>${i.qty}</td><td style="text-align:right;font-weight:600">${rupee(i.price*i.qty)}</td></tr>`).join("")}</tbody></table>
<div class="totals">
<div class="t-row"><span>Subtotal</span><span>${rupee(order.sub)}</span></div>
${order.disc>0?`<div class="t-row" style="color:#22c55e"><span>Discount${order.coupon?` (${order.coupon})`:""}</span><span>−${rupee(order.disc)}</span></div>`:""}
<div class="t-row"><span>Shipping</span><span>${order.ship===0?"Free":rupee(order.ship)}</span></div>
<div class="t-row t-grand"><span>Total Paid</span><span>${rupee(order.total)}</span></div>
</div>
<div class="footer">Thank you for shopping with SoleStore &bull; support@solestore.in</div>
</body></html>`;

const downloadInvoice = (order) => {
  const blob = new Blob([makeInvoice(order)], {type:"text/html"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `SoleStore_Invoice_${order.id}.html`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
};

/* ═══════════════════════════════════════════════════════════════════
   STORE CONTEXT
═══════════════════════════════════════════════════════════════════ */
const StoreCtx = createContext(null);
const useStore = () => useContext(StoreCtx);

function StoreProvider({children}) {
  const [products,  setProducts]  = useState(PRODUCTS);
  const [orders,    setOrders]    = useState(ORDERS_INIT);
  const [coupons,   setCoupons]   = useState(COUPONS_INIT);
  const [cart,      setCart]      = useState([]);
  const [wishlist,  setWishlist]  = useState([]);
  const [authUser,  setAuthUser]  = useState(null);
  const [page,      setPage]      = useState("home");
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);
  const [checkData, setCheckData] = useState(null);
  const toastRef = useRef(null);

  const showToast = useCallback((msg, type="success") => {
    clearTimeout(toastRef.current);
    setToast({msg,type});
    toastRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(c => {
      const i = c.findIndex(x => x.id===item.id && x.selSize===item.selSize && x.selColor===item.selColor);
      if (i >= 0) return c.map((x,idx) => idx===i ? {...x,qty:x.qty+(item.qty||1)} : x);
      return [...c, {...item, qty:item.qty||1}];
    });
    showToast(`${item.name} added to cart`);
  }, [showToast]);

  const toggleWish = useCallback((id) => {
    setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w,id]);
  }, []);

  const cartQty = cart.reduce((s,i) => s+i.qty, 0);

  return (
    <StoreCtx.Provider value={{
      products, setProducts, orders, setOrders, coupons, setCoupons,
      cart, setCart, wishlist, addToCart, toggleWish, cartQty,
      authUser, setAuthUser, page, setPage, modal, setModal,
      toast, showToast, checkData, setCheckData,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED UI
═══════════════════════════════════════════════════════════════════ */

function Btn({children,onClick,variant="gold",size="md",full,disabled,style={},cls=""}) {
  const pad = size==="sm" ? "7px 14px" : size==="lg" ? "13px 28px" : "9px 20px";
  const fs  = size==="sm" ? 12 : size==="lg" ? 15 : 13;
  return (
    <button className={`btn-${variant} ${cls}`} onClick={disabled?undefined:onClick} disabled={disabled}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,
        padding:pad,fontSize:fs,width:full?"100%":undefined,
        opacity:disabled?.45:1,cursor:disabled?"not-allowed":"pointer",...style}}>
      {children}
    </button>
  );
}

function Field({label,value,onChange,placeholder,type="text",icon,right,err,style={},fStyle={},onKD,autoFocus}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5,...style}}>
      {label && <label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>{label}</label>}
      <div style={{position:"relative"}}>
        {icon && <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.dim,display:"flex",pointerEvents:"none"}}>{icon}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          autoFocus={autoFocus} onKeyDown={onKD}
          className="field" style={{paddingLeft:icon?40:14,paddingRight:right?40:14,...fStyle}}/>
        {right && <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",display:"flex"}}>{right}</span>}
      </div>
      {err && <p style={{fontSize:11,color:C.red}}>{err}</p>}
    </div>
  );
}

function Sel({label,value,onChange,opts,style={}}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5,...style}}>
      {label && <label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>{label}</label>}
      <select value={value} onChange={onChange} className="field select">
        {opts.map(o => <option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
      </select>
    </div>
  );
}

function Avi({initials,size=36}) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,
      background:`linear-gradient(135deg,${C.goldD},${C.gold})`,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Syne',sans-serif",fontWeight:800,color:"#000",fontSize:size*.36}}>
      {initials}
    </div>
  );
}

function StatusPill({status}) {
  const s = STATUS[status] || {label:status,color:C.muted,bg:C.s3};
  return (
    <span className="pill" style={{color:s.color,background:s.bg}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:s.color,display:"inline-block",marginRight:3}}/>
      {s.label}
    </span>
  );
}

function Toast() {
  const {toast} = useStore();
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div style={{position:"fixed",top:22,right:22,zIndex:9999,
      background:C.s2,border:`1px solid ${ok?C.green:C.red}40`,
      borderRadius:12,padding:"13px 18px",display:"flex",alignItems:"center",gap:11,
      boxShadow:"0 8px 40px rgba(0,0,0,.55)",maxWidth:330,
      animation:"toastIn .28s cubic-bezier(.16,1,.3,1) both"}}>
      <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
        background:ok?"rgba(34,197,94,.14)":"rgba(239,68,68,.14)",
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        {ok
          ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={C.red} strokeWidth="2" strokeLinecap="round"/></svg>}
      </div>
      <p style={{fontSize:13,fontWeight:500,color:C.white,lineHeight:1.4}}>{toast.msg}</p>
    </div>
  );
}

/* Product Image Helper */
function PImg({src,size=40,style={}}) {
  return <img src={src} alt="" style={{width:size,height:size,objectFit:"contain",borderRadius:4,...style}}/>;
}


function QRCode({size=180}) {
  const cell = Math.floor(size/25);
  const pat = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,1,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,1,1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0],
    [0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,0,1,1,0,0,1,0],
    [0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1],
    [1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0],
    [0,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1,0,0,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,0],
    [0,1,1,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,1,0,1,0,1,1],
    [1,0,0,1,1,0,1,1,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,0,1,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,1,0,0,1,0,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,0,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,1,1,0,0,1,0,1,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block",borderRadius:6}}>
      <rect width={size} height={size} fill="#fff"/>
      {pat.map((row,r) => row.map((v,c) => v ? (
        <rect key={`${r}-${c}`} x={c*cell+2} y={r*cell+2} width={cell-1} height={cell-1} fill="#111" rx={1}/>
      ) : null))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LOGIN — 2-STEP: role select → credentials
═══════════════════════════════════════════════════════════════════ */
function LoginPage() {
  const {setAuthUser, showToast} = useStore();
  const [step,  setStep]  = useState("role");   // "role" | "form"
  const [role,  setRole]  = useState(null);
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [showP, setShowP] = useState(false);
  const [err,   setErr]   = useState("");
  const [busy,  setBusy]  = useState(false);

  const prefill = (u) => { setEmail(u.email); setPass(u.password); };
  const goRole = (r) => { setRole(r); setStep("form"); setErr(""); setEmail(""); setPass(""); };

  const login = () => {
    if (!email) { setErr("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Enter a valid email"); return; }
    if (!pass) { setErr("Password is required"); return; }
    setBusy(true); setErr("");
    setTimeout(() => {
      const u = USERS.find(x => x.email===email && x.password===pass && x.role===role);
      if (u) { setAuthUser(u); showToast(`Welcome back, ${u.name}!`); }
      else { setErr("Incorrect credentials. Use the demo accounts below."); setBusy(false); }
    }, 700);
  };

  const demoUsers = USERS.filter(u => u.role === role);

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",position:"relative",overflow:"hidden"}}>
      {/* Left panel */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",
        padding:"60px 80px",background:`linear-gradient(160deg,${C.s1},${C.bg})`,
        borderRight:`1px solid ${C.border}`}}>
        <div className="fu">
          <div style={{display:"inline-flex",alignItems:"center",gap:8,
            background:C.s2,border:`1px solid ${C.border}`,borderRadius:9,
            padding:"5px 13px",marginBottom:20}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
            <span style={{fontSize:11,color:C.muted,letterSpacing:1.2}}>India's Premier Footwear Store</span>
          </div>
          <h1 className="syne fu1" style={{fontSize:68,fontWeight:800,lineHeight:.9,marginBottom:18}}>
            SOLE<br/><span style={{color:C.gold}}>STORE</span>
          </h1>
          <p className="fu2" style={{fontSize:14,color:C.muted,lineHeight:1.85,maxWidth:340}}>
            Curated footwear from the world's best brands. Athletic performance, refined formal, timeless casual — all in one place.
          </p>
        </div>
        <div className="fu3" style={{display:"flex",gap:32,marginTop:48}}>
          {[["500+","Curated Styles"],["50K+","Happy Customers"],["4.9★","App Rating"]].map(([v,l])=>(
            <div key={l}>
              <p className="syne" style={{fontSize:22,fontWeight:800,color:C.gold}}>{v}</p>
              <p style={{fontSize:11,color:C.dim,marginTop:2}}>{l}</p>
            </div>
          ))}
        </div>
        <img src={imgHeroBanner} alt="" style={{position:"absolute",bottom:0,left:20,width:200,opacity:.08,transform:"rotate(-12deg)",pointerEvents:"none"}}/>
      </div>

      {/* Right panel */}
      <div style={{width:460,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 48px"}}>
        {step === "role" ? (
          <div className="si">
            <h2 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:6}}>Welcome</h2>
            <p style={{fontSize:13,color:C.muted,marginBottom:28}}>How would you like to continue?</p>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
              {[
                {r:"user",label:"Customer",sub:"Browse & shop our collection",icon:"🛍️",c:C.gold},
                {r:"admin",label:"Admin Dashboard",sub:"Manage store, orders & inventory",icon:"⚙️",c:C.purple},
              ].map(opt => (
                <button key={opt.r} onClick={() => goRole(opt.r)}
                  style={{padding:"18px 20px",background:C.s2,border:`1px solid ${C.border}`,
                    borderRadius:14,display:"flex",alignItems:"center",gap:14,cursor:"pointer",
                    textAlign:"left",transition:"all .18s",fontFamily:"'DM Sans',sans-serif"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=opt.c+"70";e.currentTarget.style.background=opt.c+"0a";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.s2;}}>
                  <div style={{width:46,height:46,borderRadius:12,
                    background:opt.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                    {opt.icon}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:700,color:C.white}}>{opt.label}</p>
                    <p style={{fontSize:12,color:C.muted,marginTop:2}}>{opt.sub}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="si">
            <button onClick={()=>setStep("role")}
              style={{display:"flex",alignItems:"center",gap:6,color:C.muted,marginBottom:22,
                fontSize:12,fontFamily:"'DM Sans',sans-serif",background:"none",cursor:"pointer",
                transition:"color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.white}
              onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back
            </button>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:36,height:36,borderRadius:10,
                background:role==="admin"?C.purple+"20":C.gold+"20",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                {role==="admin"?"⚙️":"🛍️"}
              </div>
              <div>
                <h2 className="syne" style={{fontSize:22,fontWeight:800}}>{role==="admin"?"Admin Login":"Customer Login"}</h2>
                <p style={{fontSize:11,color:C.muted,marginTop:1}}>{role==="admin"?"Use admin credentials below":"Use any demo account"}</p>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
              <Field label="Email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                placeholder="email@example.com" type="email"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}/>
              <Field label="Password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}}
                placeholder="••••••••" type={showP?"text":"password"} onKD={e=>e.key==="Enter"&&login()}
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                right={<button onClick={()=>setShowP(v=>!v)} style={{color:C.dim,background:"none",display:"flex"}}>
                  {showP
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>}
                err={err}/>
            </div>
            <Btn full size="lg" onClick={login} disabled={busy} style={{marginBottom:20}}>
              {busy
                ? <><span style={{width:15,height:15,border:"2px solid #000",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>Signing in…</>
                : <>Sign In →</>}
            </Btn>
            {/* Demo accounts */}
            <div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              <p style={{fontSize:10,color:C.dim,textTransform:"uppercase",letterSpacing:1.2,marginBottom:10,fontWeight:600}}>Quick Demo Login</p>
              {demoUsers.map(u => (
                <button key={u.id} onClick={()=>prefill(u)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                    background:C.s3,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer",
                    textAlign:"left",marginBottom:6,transition:"all .15s",fontFamily:"'DM Sans',sans-serif",
                    ":last-child":{marginBottom:0}}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"60"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <Avi initials={u.initials} size={30}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:12,fontWeight:600,color:C.white}}>{u.name}</p>
                    <p style={{fontSize:10,color:C.dim}}>{u.email}</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAYMENT GATEWAY — 5 methods
═══════════════════════════════════════════════════════════════════ */
function PayGateway({amount, onSuccess, onBack}) {
  const [method, setMethod] = useState(null);
  const [stage,  setStage]  = useState("select");  // select | details | processing | success | failed
  const [cd,     setCd]     = useState(30);
  const [card,   setCard]   = useState({num:"",exp:"",cvv:"",name:""});
  const [upiId,  setUpiId]  = useState("");
  const [bank,   setBank]   = useState("SBI");
  const [wallet, setWallet] = useState("PhonePe");
  const [ferr,   setFerr]   = useState({});
  const tRef = useRef(null);

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const startCD = useCallback(() => {
    setCd(30);
    tRef.current = setInterval(() => {
      setCd(p => { if(p<=1){clearInterval(tRef.current);setStage("failed");return 0;} return p-1; });
    },1000);
  },[]);

  useEffect(() => () => clearInterval(tRef.current), []);

  const sim = () => { clearInterval(tRef.current); setStage("processing"); setTimeout(()=>setStage("success"),2200); };

  /* ── Processing ──────────────────────────────────────────────── */
  if (stage==="processing") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,gap:18}}>
      <div style={{position:"relative",width:68,height:68}}>
        <div style={{position:"absolute",inset:0,border:`3px solid ${C.border}`,borderRadius:"50%"}}/>
        <div style={{position:"absolute",inset:0,border:`3px solid transparent`,borderTopColor:C.gold,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      </div>
      <div style={{textAlign:"center"}}>
        <p className="syne" style={{fontSize:17,fontWeight:700}}>Processing Payment</p>
        <p style={{fontSize:12,color:C.muted,marginTop:5}}>Please wait, do not refresh…</p>
      </div>
      <div style={{display:"flex",gap:5}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.gold,animation:"pulse 1.2s infinite",animationDelay:`${i*.2}s`}}/>)}
      </div>
    </div>
  );

  /* ── Success ─────────────────────────────────────────────────── */
  if (stage==="success") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,gap:14}}>
      <div style={{width:76,height:76,borderRadius:"50%",background:"rgba(34,197,94,.1)",border:`2px solid ${C.green}`,
        display:"flex",alignItems:"center",justifyContent:"center",animation:"checkPop .5s cubic-bezier(.34,1.56,.64,1) both"}}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M7 17l6 6L27 9" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{textAlign:"center"}}>
        <p className="syne" style={{fontSize:20,fontWeight:800}}>Payment Successful!</p>
        <p style={{fontSize:12,color:C.muted,marginTop:5}}>Your order is now confirmed</p>
      </div>
      <div style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 28px",textAlign:"center"}}>
        <p style={{fontSize:11,color:C.muted}}>Amount Paid</p>
        <p className="syne" style={{fontSize:28,fontWeight:800,color:C.gold}}>{rupee(amount)}</p>
      </div>
      <Btn size="lg" onClick={onSuccess}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        View Confirmation
      </Btn>
    </div>
  );

  /* ── Failed ──────────────────────────────────────────────────── */
  if (stage==="failed") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,gap:14}}>
      <div style={{width:76,height:76,borderRadius:"50%",background:"rgba(239,68,68,.1)",border:`2px solid ${C.red}`,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M9 9l16 16M25 9L9 25" stroke={C.red} strokeWidth="3" strokeLinecap="round"/></svg>
      </div>
      <div style={{textAlign:"center"}}>
        <p className="syne" style={{fontSize:20,fontWeight:800}}>QR Expired</p>
        <p style={{fontSize:12,color:C.muted,marginTop:5}}>The payment window timed out. Please try again.</p>
      </div>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={()=>{setStage("select");setMethod(null);}}>Try Again</Btn>
      </div>
    </div>
  );

  /* ── Method Select ───────────────────────────────────────────── */
  if (!method || stage==="select") return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{color:C.muted,display:"flex",padding:4,cursor:"pointer"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div>
          <h3 className="syne" style={{fontSize:16,fontWeight:700}}>Payment Method</h3>
          <p style={{fontSize:11,color:C.muted}}>Total: <span style={{color:C.gold,fontWeight:700}}>{rupee(amount)}</span></p>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[
          {k:"upi",  label:"UPI / QR Code",       sub:"GPay, PhonePe, Paytm, BHIM", icon:"📱", popular:true},
          {k:"card", label:"Credit / Debit Card",  sub:"Visa, Mastercard, RuPay",    icon:"💳", popular:false},
          {k:"nb",   label:"Net Banking",          sub:"All major banks supported",  icon:"🏦", popular:false},
          {k:"wallet",label:"Wallets",             sub:"Paytm, GPay, Amazon Pay",    icon:"👛", popular:false},
          {k:"cod",  label:"Cash on Delivery",     sub:"Pay when your order arrives",icon:"💵", popular:false},
        ].map(m => (
          <button key={m.k}
            onClick={()=>{
              setMethod(m.k); setFerr({});
              if(m.k==="upi"){setStage("details");startCD();}
              else setStage("details");
            }}
            style={{display:"flex",alignItems:"center",gap:13,padding:"15px 16px",
              background:C.s3,border:`1px solid ${C.border}`,borderRadius:12,cursor:"pointer",
              textAlign:"left",transition:"all .15s",fontFamily:"'DM Sans',sans-serif",position:"relative"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold+"55";e.currentTarget.style.background=C.s4;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.s3;}}>
            <div style={{width:42,height:42,borderRadius:10,background:C.s2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.icon}</div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:600,color:C.white}}>{m.label}</p>
              <p style={{fontSize:11,color:C.dim,marginTop:1}}>{m.sub}</p>
            </div>
            {m.popular && <span style={{background:C.gold+"1a",color:C.gold,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:4,letterSpacing:.5,textTransform:"uppercase"}}>Popular</span>}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:16}}>
        {["🔒 SSL Encrypted","⚡ Instant","📄 Invoice"].map(t=>(
          <span key={t} style={{fontSize:10,color:C.dim}}>{t}</span>
        ))}
      </div>
    </div>
  );

  const Back = () => (
    <button onClick={()=>{clearInterval(tRef.current);setMethod(null);setStage("select");}} style={{color:C.muted,display:"flex",padding:4,cursor:"pointer"}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
    </button>
  );

  /* ── UPI QR ───────────────────────────────────────────────────── */
  if (method==="upi") return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><Back/><h3 className="syne" style={{fontSize:16,fontWeight:700}}>Pay via UPI</h3></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{padding:14,background:"#fff",borderRadius:16,animation:"glow 3s ease-in-out infinite"}}>
            <QRCode size={155}/>
          </div>
          <div style={{width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
              <span style={{color:C.muted}}>Expires in</span>
              <span className="mono" style={{color:cd<=10?C.red:C.gold,fontWeight:700}}>{cd}s</span>
            </div>
            <div style={{background:C.s3,borderRadius:99,height:4,overflow:"hidden"}}>
              <div style={{height:"100%",background:`linear-gradient(90deg,${cd<=10?C.red:C.gold},${C.goldL})`,transition:"width 1s linear",width:`${(cd/30)*100}%`}}/>
            </div>
          </div>
          <p className="mono" style={{fontSize:12,color:C.gold}}>solestore@sbi</p>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center"}}>
            {["GPay","PhonePe","Paytm","BHIM","Cred"].map(a=>(
              <span key={a} style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",fontSize:9,color:C.muted}}>{a}</span>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:12,padding:14,textAlign:"center"}}>
            <p style={{fontSize:11,color:C.dim}}>Amount</p>
            <p className="syne" style={{fontSize:26,fontWeight:800,color:C.gold}}>{rupee(amount)}</p>
          </div>
          <div style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:12,padding:14}}>
            <p style={{fontSize:11,color:C.muted,marginBottom:7,textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>Or pay by UPI ID</p>
            <div style={{display:"flex",gap:7}}>
              <input value={upiId} onChange={e=>{setUpiId(e.target.value);setFerr({});}}
                placeholder="name@upi" className="field" style={{flex:1,padding:"8px 11px",fontSize:12}}/>
              <Btn size="sm" onClick={()=>{
                if(!upiId.includes("@")){setFerr({upi:"Enter valid UPI ID"});return;}
                sim();
              }}>Pay</Btn>
            </div>
            {ferr.upi && <p style={{fontSize:11,color:C.red,marginTop:5}}>{ferr.upi}</p>}
          </div>
          <div style={{background:C.gold+"0d",border:`1px solid ${C.gold}28`,borderRadius:10,padding:12}}>
            <p style={{fontSize:11,color:C.gold,fontWeight:700,marginBottom:5}}>🔒 Secure Payment</p>
            <p style={{fontSize:11,color:C.muted,lineHeight:1.7}}>Scan with any UPI app. Encrypted & processed securely.</p>
          </div>
          <Btn full variant="outline" onClick={sim} style={{borderStyle:"dashed"}}>
            ▶ Simulate Payment (Demo)
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Card ─────────────────────────────────────────────────────── */
  if (method==="card") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><Back/><h3 className="syne" style={{fontSize:16,fontWeight:700}}>Credit / Debit Card</h3></div>
      {/* Live card preview */}
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#2d1b69,#0f3460)",borderRadius:16,
        padding:"22px 26px",position:"relative",overflow:"hidden",border:`1px solid rgba(255,255,255,.08)`,minHeight:148}}>
        <div style={{position:"absolute",top:-28,right:-28,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        <div style={{position:"absolute",bottom:-18,left:-18,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.03)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,position:"relative"}}>
          <div style={{width:36,height:26,background:"linear-gradient(135deg,#d4a017,#ffd700)",borderRadius:3}}/>
          <svg width="40" height="26" viewBox="0 0 40 26">
            <circle cx="14" cy="13" r="12" fill="#eb001b" fillOpacity=".9"/>
            <circle cx="26" cy="13" r="12" fill="#f79e1b" fillOpacity=".9"/>
            <path d="M20 4.2a12 12 0 010 17.6A12 12 0 0120 4.2z" fill="#ff5f00"/>
          </svg>
        </div>
        <p className="mono" style={{fontSize:17,color:"rgba(255,255,255,.88)",letterSpacing:3,marginBottom:14,position:"relative"}}>
          {card.num || "•••• •••• •••• ••••"}
        </p>
        <div style={{display:"flex",justifyContent:"space-between",position:"relative"}}>
          <div><p style={{fontSize:8,color:"rgba(255,255,255,.45)",letterSpacing:1,marginBottom:2}}>CARDHOLDER</p><p style={{fontSize:12,color:"rgba(255,255,255,.88)",fontWeight:500}}>{card.name||"YOUR NAME"}</p></div>
          <div><p style={{fontSize:8,color:"rgba(255,255,255,.45)",letterSpacing:1,marginBottom:2}}>EXPIRES</p><p style={{fontSize:12,color:"rgba(255,255,255,.88)",fontWeight:500}}>{card.exp||"MM/YY"}</p></div>
        </div>
      </div>
      <div style={{display:"grid",gap:12}}>
        <Field label="Card Number" value={card.num} onChange={e=>setCard(p=>({...p,num:fmtCard(e.target.value)}))} placeholder="1234 5678 9012 3456" err={ferr.num}/>
        <Field label="Cardholder Name" value={card.name} onChange={e=>setCard(p=>({...p,name:e.target.value}))} placeholder="Name as on card" err={ferr.name}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Expiry" value={card.exp} onChange={e=>setCard(p=>({...p,exp:fmtExp(e.target.value)}))} placeholder="MM/YY" err={ferr.exp}/>
          <Field label="CVV" value={card.cvv} onChange={e=>setCard(p=>({...p,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))} placeholder="•••" type="password" err={ferr.cvv}/>
        </div>
      </div>
      <Btn full size="lg" onClick={()=>{
        const e={};
        if(card.num.replace(/\s/g,"").length<16) e.num="Enter 16-digit card number";
        if(card.exp.length<5) e.exp="Enter valid expiry";
        if(card.cvv.length<3) e.cvv="Enter CVV";
        if(!card.name.trim()) e.name="Enter cardholder name";
        if(Object.keys(e).length){setFerr(e);return;}
        setStage("processing"); setTimeout(()=>setStage("success"),2500);
      }}>
        🔒 Pay {rupee(amount)} Securely
      </Btn>
      <p style={{fontSize:10,color:C.dim,textAlign:"center"}}>256-bit SSL &nbsp;·&nbsp; PCI DSS Compliant &nbsp;·&nbsp; Demo Mode</p>
    </div>
  );

  /* ── Net Banking ──────────────────────────────────────────────── */
  if (method==="nb") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><Back/><h3 className="syne" style={{fontSize:16,fontWeight:700}}>Net Banking</h3></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{k:"SBI",c:"#2563eb"},{k:"HDFC",c:"#dc2626"},{k:"ICICI",c:"#d97706"},{k:"Axis",c:"#7c3aed"},{k:"Kotak",c:"#dc2626"},{k:"Yes Bank",c:"#16a34a"}].map(b=>(
          <button key={b.k} onClick={()=>setBank(b.k)}
            style={{padding:"11px 13px",borderRadius:10,border:`1px solid ${bank===b.k?b.c:C.border}`,
              background:bank===b.k?b.c+"18":C.s3,cursor:"pointer",textAlign:"left",transition:"all .14s",fontFamily:"'DM Sans',sans-serif"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=b.c+"70"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=bank===b.k?b.c:C.border}>
            <div style={{width:7,height:7,borderRadius:"50%",background:b.c,marginBottom:5}}/>
            <p style={{fontSize:12,fontWeight:600,color:C.white}}>{b.k}</p>
          </button>
        ))}
      </div>
      <div style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p style={{fontSize:11,color:C.muted}}>Selected</p><p style={{fontSize:14,fontWeight:700,color:C.white}}>{bank}</p></div>
        <div style={{textAlign:"right"}}><p style={{fontSize:11,color:C.muted}}>Amount</p><p className="syne" style={{fontSize:18,fontWeight:700,color:C.gold}}>{rupee(amount)}</p></div>
      </div>
      <Btn full size="lg" onClick={()=>{setStage("processing");setTimeout(()=>setStage("success"),2400);}}>Proceed to {bank} →</Btn>
    </div>
  );

  /* ── Wallet ───────────────────────────────────────────────────── */
  if (method==="wallet") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><Back/><h3 className="syne" style={{fontSize:16,fontWeight:700}}>Wallets</h3></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{k:"PhonePe",c:"#5f259f"},{k:"Paytm",c:"#00baf2"},{k:"GPay",c:"#1a73e8"},{k:"Amazon Pay",c:"#ff9900"}].map(w=>(
          <button key={w.k} onClick={()=>setWallet(w.k)}
            style={{padding:"14px",borderRadius:10,border:`1px solid ${wallet===w.k?w.c:C.border}`,
              background:wallet===w.k?w.c+"18":C.s3,cursor:"pointer",textAlign:"center",transition:"all .14s",fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:w.c,margin:"0 auto 7px"}}/>
            <p style={{fontSize:12,fontWeight:700,color:C.white}}>{w.k}</p>
          </button>
        ))}
      </div>
      <div style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p style={{fontSize:11,color:C.muted}}>Wallet</p><p style={{fontSize:14,fontWeight:700,color:C.white}}>{wallet}</p></div>
        <div style={{textAlign:"right"}}><p style={{fontSize:11,color:C.muted}}>Amount</p><p className="syne" style={{fontSize:18,fontWeight:700,color:C.gold}}>{rupee(amount)}</p></div>
      </div>
      <Btn full size="lg" onClick={()=>{setStage("processing");setTimeout(()=>setStage("success"),1800);}}>Pay with {wallet}</Btn>
    </div>
  );

  /* ── COD ─────────────────────────────────────────────────────── */
  if (method==="cod") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}><Back/><h3 className="syne" style={{fontSize:16,fontWeight:700}}>Cash on Delivery</h3></div>
      <div style={{textAlign:"center",padding:"28px 20px",background:C.s3,border:`1px solid ${C.border}`,borderRadius:16}}>
        <div style={{fontSize:56,marginBottom:14}}>💵</div>
        <p className="syne" style={{fontSize:18,fontWeight:700,marginBottom:8}}>Pay at Doorstep</p>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.75,marginBottom:18}}>
          Keep the exact amount ready when your order arrives.<br/>
          COD available for orders under ₹25,000.
        </p>
        <div style={{background:C.s2,borderRadius:12,padding:"14px 24px",display:"inline-block",marginBottom:6}}>
          <p style={{fontSize:11,color:C.muted}}>Amount to pay on delivery</p>
          <p className="syne" style={{fontSize:28,fontWeight:800,color:C.gold}}>{rupee(amount)}</p>
        </div>
        <div style={{background:C.gold+"0d",border:`1px solid ${C.gold}25`,borderRadius:10,padding:12,marginTop:14}}>
          <p style={{fontSize:11,color:C.muted,lineHeight:1.7}}>📦 Demo mode — click the button below to simulate placement of a COD order.</p>
        </div>
      </div>
      <Btn full size="lg" onClick={()=>{setStage("processing");setTimeout(()=>setStage("success"),1500);}}>
        Confirm COD Order →
      </Btn>
    </div>
  );

  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════════════════════════ */
function ProductCard({p}) {
  const {wishlist, addToCart, toggleWish, setModal, showToast} = useStore();
  const isW = wishlist.includes(p.id);
  return (
    <div className="card card-lift" style={{overflow:"hidden",cursor:"pointer",position:"relative"}}
      onClick={()=>setModal(p)}>
      {p.badge && (
        <div style={{position:"absolute",top:11,left:11,zIndex:3,background:C.gold,color:"#000",
          fontSize:8,fontWeight:900,padding:"3px 8px",borderRadius:4,letterSpacing:.9,textTransform:"uppercase"}}>
          {p.badge}
        </div>
      )}
      <button onClick={e=>{e.stopPropagation();toggleWish(p.id);}}
        style={{position:"absolute",top:11,right:11,zIndex:3,width:30,height:30,borderRadius:8,
          background:isW?"rgba(239,68,68,.12)":"rgba(255,255,255,.06)",
          border:`1px solid ${isW?"rgba(239,68,68,.35)":C.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s",cursor:"pointer"}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={isW?"#ef4444":"none"} stroke={isW?"#ef4444":C.muted} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
      <div style={{height:175,background:`linear-gradient(${p.grad})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        {p.img ? <img src={p.img} alt={p.name} style={{height:130,objectFit:"contain",filter:"drop-shadow(0 8px 18px rgba(0,0,0,.5))"}}/> : <span style={{fontSize:78,filter:"drop-shadow(0 8px 18px rgba(0,0,0,.5))"}}>{p.name[0]}</span>}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.28),transparent)"}}/>
      </div>
      <div style={{padding:"14px 14px 16px"}}>
        <p style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:1.2,marginBottom:3}}>{p.brand}</p>
        <h3 style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:7,lineHeight:1.3}}>{p.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10}}>
          <div style={{display:"flex",gap:1}}>
            {[1,2,3,4,5].map(i=>(
              <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i<=Math.floor(p.rating)?C.gold:"none"} stroke={C.gold} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span style={{fontSize:10,color:C.dim}}>({p.reviews})</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <span style={{fontSize:15,fontWeight:800,color:C.gold}}>{rupee(p.price)}</span>
            <span style={{fontSize:10,color:C.dim,textDecoration:"line-through",marginLeft:5}}>{rupee(p.mrp)}</span>
            <span style={{fontSize:9,color:C.green,fontWeight:700,marginLeft:4}}>{off(p.mrp,p.price)}%</span>
          </div>
          <button onClick={e=>{e.stopPropagation();addToCart({...p,selSize:p.sizes[0],selColor:p.colors[0],qty:1});}}
            style={{width:32,height:32,borderRadius:8,background:C.gold,display:"flex",alignItems:"center",
              justifyContent:"center",cursor:"pointer",border:"none",transition:"all .18s"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.goldL}
            onMouseLeave={e=>e.currentTarget.style.background=C.gold}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT MODAL
═══════════════════════════════════════════════════════════════════ */
function ProductModal() {
  const {modal, setModal, wishlist, addToCart, toggleWish, showToast} = useStore();
  const [selSize,  setSz]  = useState(null);
  const [selColor, setClr] = useState(null);
  const [qty,      setQty] = useState(1);
  const [tab,      setTab] = useState("desc");

  const p = modal;
  useEffect(()=>{ if(p){setSz(null);setClr(p.colors[0]);setQty(1);setTab("desc");} },[p]);
  if (!p) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.82)",backdropFilter:"blur(14px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setModal(null)}>
      <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:20,
        width:"100%",maxWidth:840,maxHeight:"90vh",overflow:"auto",animation:"scaleIn .3s cubic-bezier(.16,1,.3,1)"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
          {/* Visual */}
          <div style={{background:`linear-gradient(${p.grad})`,borderRadius:"20px 0 0 20px",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            padding:40,minHeight:480,position:"relative"}}>
            {p.img ? <img src={p.img} alt={p.name} style={{height:200,objectFit:"contain",filter:"drop-shadow(0 20px 40px rgba(0,0,0,.6))"}}/> : <span style={{fontSize:130}}>{p.name[0]}</span>}
            {p.badge && <div style={{marginTop:20,background:C.gold,color:"#000",fontSize:10,fontWeight:900,padding:"4px 14px",borderRadius:5,letterSpacing:1,textTransform:"uppercase"}}>{p.badge}</div>}
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.22),transparent)",borderRadius:"20px 0 0 20px"}}/>
          </div>
          {/* Details */}
          <div style={{padding:"28px 30px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <p style={{fontSize:10,color:C.dim,textTransform:"uppercase",letterSpacing:1.2,marginBottom:3}}>{p.brand} · {p.cat}</p>
                <h2 className="syne" style={{fontSize:21,fontWeight:800,lineHeight:1.2}}>{p.name}</h2>
              </div>
              <button onClick={()=>setModal(null)} style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:8,padding:7,color:C.muted,display:"flex",cursor:"pointer",transition:"all .14s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.white} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i<=Math.floor(p.rating)?C.gold:"none"} stroke={C.gold} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <span style={{fontSize:12,fontWeight:600}}>{p.rating}</span>
              <span style={{fontSize:11,color:C.muted}}>({p.reviews} reviews)</span>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span className="syne" style={{fontSize:30,fontWeight:800,color:C.gold}}>{rupee(p.price)}</span>
              <span style={{fontSize:13,color:C.dim,textDecoration:"line-through"}}>{rupee(p.mrp)}</span>
              <span style={{background:"rgba(34,197,94,.1)",color:C.green,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4}}>{off(p.mrp,p.price)}% OFF</span>
            </div>
            {/* Tabs */}
            <div style={{display:"flex",gap:2,background:C.s3,borderRadius:9,padding:3}}>
              {["desc","features"].map(t=>(
                <button key={t} className={`tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}
                  style={{flex:1,textTransform:"capitalize",fontFamily:"'DM Sans',sans-serif"}}>
                  {t==="desc"?"Description":"Features"}
                </button>
              ))}
            </div>
            {tab==="desc" && <p style={{fontSize:12,color:C.muted,lineHeight:1.85}}>{p.desc}</p>}
            {tab==="features" && (
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {p.features.map(f=>(
                  <span className="chip" key={f} style={{background:C.s3}}>
                    <svg width="9" height="9" viewBox="0 0 12 12" fill={C.gold} style={{marginRight:4,flexShrink:0}}><circle cx="6" cy="6" r="3"/></svg>
                    {f}
                  </span>
                ))}
              </div>
            )}
            {/* Color */}
            <div>
              <p style={{fontSize:10,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>
                Colour — <span style={{color:C.white}}>{selColor}</span>
              </p>
              <div style={{display:"flex",gap:7}}>
                {p.colors.map(c=>(
                  <button key={c} title={c} onClick={()=>setClr(c)}
                    style={{width:24,height:24,borderRadius:"50%",background:COLOR_MAP[c]||"#666",cursor:"pointer",
                      border:selColor===c?`3px solid ${C.gold}`:"2px solid transparent",
                      outline:selColor===c?`2px solid ${C.gold}50`:undefined,
                      outlineOffset:selColor===c?2:undefined,
                      boxShadow:"0 2px 8px rgba(0,0,0,.35)",transition:"all .14s"}}/>
                ))}
              </div>
            </div>
            {/* Size */}
            <div>
              <p style={{fontSize:10,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>
                Size (UK) — <span style={{color:selSize?C.white:C.red}}>{selSize||"Select size"}</span>
              </p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {p.sizes.map(s=>(
                  <button key={s} className={`size-btn ${selSize===s?"on":""}`} onClick={()=>setSz(s)}>{s}</button>
                ))}
              </div>
            </div>
            {/* Qty & Actions */}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.border}`,borderRadius:9,overflow:"hidden"}}>
                <button onClick={()=>setQty(Math.max(1,qty-1))}
                  style={{background:C.s3,padding:"9px 13px",color:C.white,display:"flex",cursor:"pointer",border:"none"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span style={{padding:"9px 16px",fontSize:13,fontWeight:700,color:C.white,borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`}}>{qty}</span>
                <button onClick={()=>setQty(qty+1)}
                  style={{background:C.s3,padding:"9px 13px",color:C.white,display:"flex",cursor:"pointer",border:"none"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              <Btn full onClick={()=>{
                if(!selSize){showToast("Please select a size","error");return;}
                addToCart({...p,selSize,selColor,qty});
                setModal(null);
              }}>Add to Cart</Btn>
              <button onClick={()=>toggleWish(p.id)}
                style={{width:40,height:40,borderRadius:9,background:wishlist.includes(p.id)?"rgba(239,68,68,.1)":C.s3,
                  border:`1px solid ${wishlist.includes(p.id)?"rgba(239,68,68,.3)":C.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center",transition:"all .18s",cursor:"pointer"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlist.includes(p.id)?"#ef4444":"none"} stroke={wishlist.includes(p.id)?"#ef4444":C.muted} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════════ */
function AdminPanel() {
  const {authUser, setAuthUser, products, setProducts, orders, setOrders, coupons, setCoupons, showToast} = useStore();
  const [pg, setPg] = useState("dash");

  const NAV = [
    {k:"dash",    l:"Dashboard", d:"M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"},
    {k:"products",l:"Products",  d:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"},
    {k:"orders",  l:"Orders",    d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"},
    {k:"coupons", l:"Coupons",   d:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"},
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg}}>
      <aside style={{width:218,background:C.s1,borderRight:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",padding:"24px 10px",flexShrink:0,
        position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
        <div style={{padding:"0 8px",marginBottom:28}}>
          <p className="syne" style={{fontSize:19,fontWeight:800,color:C.gold,letterSpacing:2.5}}>SOLESTORE</p>
          <p style={{fontSize:9,color:C.dim,letterSpacing:3.5,textTransform:"uppercase",marginTop:1}}>Admin Panel</p>
        </div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(n=>(
            <button key={n.k} className={`nav-item ${pg===n.k?"on":""}`}
              onClick={()=>setPg(n.k)} style={{width:"100%",textAlign:"left",border:`1px solid ${pg===n.k?C.gold+"25":"transparent"}`,fontFamily:"'DM Sans',sans-serif"}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={n.d}/></svg>
              {n.l}
            </button>
          ))}
        </nav>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",marginBottom:6}}>
            <Avi initials={authUser.initials} size={30}/>
            <div>
              <p style={{fontSize:12,fontWeight:600,color:C.white}}>{authUser.name}</p>
              <p style={{fontSize:9,color:C.dim}}>Administrator</p>
            </div>
          </div>
          <button className="nav-item" onClick={()=>setAuthUser(null)}
            style={{width:"100%",textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}
            onMouseEnter={e=>e.currentTarget.style.color=C.red}
            onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>
      <main style={{flex:1,padding:"36px 38px",overflow:"auto"}}>
        {pg==="dash"     && <AdminDash products={products} orders={orders}/>}
        {pg==="products" && <AdminProducts products={products} setProducts={setProducts} showToast={showToast}/>}
        {pg==="orders"   && <AdminOrders   orders={orders} setOrders={setOrders} showToast={showToast}/>}
        {pg==="coupons"  && <AdminCoupons  coupons={coupons} setCoupons={setCoupons} showToast={showToast}/>}
      </main>
    </div>
  );
}

function AdminDash({products, orders}) {
  const rev = orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);
  const cats = ["sports","casual","formal","women","accessories"].map(c=>({name:c,value:products.filter(p=>p.cat===c).length}));
  const PIE_C = [C.gold,C.blue,C.purple,C.pink,C.green];
  return (
    <div className="fu">
      <div style={{marginBottom:24}}>
        <h1 className="syne" style={{fontSize:28,fontWeight:800}}>Dashboard</h1>
        <p style={{fontSize:12,color:C.muted,marginTop:3}}>Store performance overview</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {[
          {l:"Products",v:products.length,s:`${products.filter(p=>p.stock<20).length} low stock`,cl:C.gold},
          {l:"Customers",v:new Set(orders.map(o=>o.uid)).size,s:"Active buyers",cl:C.blue},
          {l:"Orders",v:orders.length,s:`${orders.filter(o=>o.status==="pending").length} pending`,cl:C.purple},
          {l:"Revenue",v:rupee(rev),s:"All time",cl:C.green},
        ].map(s=>(
          <div className="card" key={s.l} style={{padding:18}}>
            <p style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>{s.l}</p>
            <p className="syne" style={{fontSize:24,fontWeight:800}}>{s.v}</p>
            <p style={{fontSize:10,color:C.dim,marginTop:3}}>{s.s}</p>
            <div style={{height:2,background:`linear-gradient(90deg,${s.cl},transparent)`,borderRadius:99,marginTop:10}}/>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card" style={{padding:22}}>
          <p style={{fontSize:13,fontWeight:700,marginBottom:2}}>Revenue Trend</p>
          <p style={{fontSize:11,color:C.muted,marginBottom:18}}>Monthly revenue</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={REVENUE}>
              <defs><linearGradient id="grd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={.22}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" stroke={C.dim} fontSize={10} tickLine={false}/>
              <YAxis stroke={C.dim} fontSize={10} tickLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip contentStyle={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}} formatter={v=>[rupee(v),"Revenue"]}/>
              <Area type="monotone" dataKey="rev" stroke={C.gold} fill="url(#grd)" strokeWidth={2.2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:22}}>
          <p style={{fontSize:13,fontWeight:700,marginBottom:2}}>Orders / Month</p>
          <p style={{fontSize:11,color:C.muted,marginBottom:18}}>Order count</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" stroke={C.dim} fontSize={10} tickLine={false}/>
              <YAxis stroke={C.dim} fontSize={10} tickLine={false}/>
              <Tooltip contentStyle={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
              <Bar dataKey="orders" fill={C.gold} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:22}}>
          <p style={{fontSize:13,fontWeight:700,marginBottom:2}}>By Category</p>
          <p style={{fontSize:11,color:C.muted,marginBottom:8}}>Product split</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={cats} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                {cats.map((_,i)=><Cell key={i} fill={PIE_C[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {cats.map((c,i)=>(
              <div key={c.name} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:PIE_C[i]}}/>
                <span style={{fontSize:10,color:C.muted,textTransform:"capitalize"}}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{padding:22}}>
        <p style={{fontSize:13,fontWeight:700,marginBottom:14}}>Recent Orders</p>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            {["Order","Customer","Items","Amount","Status","Date"].map(h=>(
              <th key={h} style={{textAlign:"left",padding:"8px 11px",fontSize:9,color:C.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:.8}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orders.slice(0,5).map(o=>(
              <tr key={o.id} style={{borderBottom:`1px solid ${C.border}18`}}
                onMouseEnter={e=>e.currentTarget.style.background=C.s2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td className="mono" style={{padding:"11px",fontSize:12,fontWeight:700,color:C.gold}}>{o.id}</td>
                <td style={{padding:"11px",fontSize:12,color:C.white}}>{o.name}</td>
                <td style={{padding:"11px",fontSize:11,color:C.muted}}>{o.items.length} item{o.items.length>1?"s":""}</td>
                <td style={{padding:"11px",fontSize:12,fontWeight:700,color:C.white}}>{rupee(o.total)}</td>
                <td style={{padding:"11px"}}><StatusPill status={o.status}/></td>
                <td style={{padding:"11px",fontSize:11,color:C.muted}}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminProducts({products, setProducts, showToast}) {
  const BLANK = {name:"",brand:"",price:"",mrp:"",cat:"sports",desc:"",sizesStr:"7,8,9,10",colorsStr:"Black,White",stock:"",grad:"135deg,#0f1923,#1a3a5c"};
  const [form,   setForm]   = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [show,   setShow]   = useState(false);
  const [q,      setQ]      = useState("");
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const reset = () => { setForm(BLANK); setEditId(null); setShow(false); };
  const save = () => {
    if (!form.name||!form.brand||!form.price) { showToast("Fill required fields","error"); return; }
    const s = {...form,id:editId||Date.now(),price:+form.price,mrp:+form.mrp||+form.price,
      sizes:form.sizesStr.split(",").map(x=>+x.trim()).filter(Boolean),
      colors:form.colorsStr.split(",").map(x=>x.trim()).filter(Boolean),
      stock:+form.stock||0,rating:4.5,reviews:0,badge:null,features:[]};
    if (editId) setProducts(p=>p.map(x=>x.id===editId?s:x));
    else setProducts(p=>[s,...p]);
    showToast(editId?"Product updated":"Product added"); reset();
  };
  const del = id => { setProducts(p=>p.filter(x=>x.id!==id)); showToast("Product deleted"); };
  const visible = products.filter(p => (p.name+p.brand).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 className="syne" style={{fontSize:28,fontWeight:800}}>Products</h1>
          <p style={{fontSize:12,color:C.muted,marginTop:3}}>{products.length} total</p>
        </div>
        <Btn onClick={()=>{reset();setShow(true);}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </Btn>
      </div>
      {show && (
        <div className="card" style={{padding:22,marginBottom:22,border:`1px solid ${C.gold}28`}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:18}}>{editId?"Edit":"New"} Product</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:12}}>
            <Field label="Name *" value={form.name} onChange={e=>f("name",e.target.value)}/>
            <Field label="Brand *" value={form.brand} onChange={e=>f("brand",e.target.value)}/>
            <Sel label="Category" value={form.cat} onChange={e=>f("cat",e.target.value)}
              opts={[{v:"sports",l:"Sports"},{v:"casual",l:"Casual"},{v:"formal",l:"Formal"},{v:"women",l:"Women's"},{v:"accessories",l:"Accessories"}]}/>
            <Field label="Price ₹ *" value={form.price} onChange={e=>f("price",e.target.value)} type="number"/>
            <Field label="MRP ₹" value={form.mrp} onChange={e=>f("mrp",e.target.value)} type="number"/>
            <Field label="Stock" value={form.stock} onChange={e=>f("stock",e.target.value)} type="number"/>
            <Field label="Sizes (comma)" value={form.sizesStr} onChange={e=>f("sizesStr",e.target.value)}/>
            <Field label="Colors (comma)" value={form.colorsStr} onChange={e=>f("colorsStr",e.target.value)}/>
            
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.7,display:"block",marginBottom:5}}>Description</label>
            <textarea value={form.desc} onChange={e=>f("desc",e.target.value)} rows={3} className="field" style={{resize:"vertical",width:"100%"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={save}>{editId?"Update":"Save"} Product</Btn>
            <Btn variant="ghost" onClick={reset}>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{marginBottom:14,maxWidth:260}}>
        <Field value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products…"
          icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>}/>
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            {["Product","Category","Price","Stock","Rating",""].map(h=>(
              <th key={h} style={{textAlign:"left",padding:"11px 14px",fontSize:9,color:C.dim,fontWeight:600,textTransform:"uppercase",letterSpacing:.8}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {visible.map(p=>(
              <tr key={p.id} style={{borderBottom:`1px solid ${C.border}14`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.s2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"13px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:40,height:40,borderRadius:9,background:`linear-gradient(${p.grad})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{p.img?<img src={p.img} alt="" style={{width:36,height:36,objectFit:"contain"}}/>:<span style={{fontSize:20}}>{p.name[0]}</span>}</div>
                    <div><p style={{fontSize:13,fontWeight:600,color:C.white}}>{p.name}</p><p style={{fontSize:10,color:C.dim}}>{p.brand}</p></div>
                  </div>
                </td>
                <td style={{padding:"13px 14px"}}>
                  <span className="chip" style={{color:p.cat==="sports"?C.blue:p.cat==="formal"?C.purple:p.cat==="women"?C.pink:C.green,background:p.cat==="sports"?C.blue+"18":p.cat==="formal"?C.purple+"18":p.cat==="women"?C.pink+"18":C.green+"18",textTransform:"capitalize"}}>{p.cat}</span>
                </td>
                <td style={{padding:"13px 14px"}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.gold}}>{rupee(p.price)}</p>
                  <p style={{fontSize:10,color:C.dim,textDecoration:"line-through"}}>{rupee(p.mrp)}</p>
                </td>
                <td style={{padding:"13px 14px"}}><span style={{fontSize:13,fontWeight:700,color:p.stock<20?C.red:C.white}}>{p.stock}{p.stock<20&&<span style={{fontSize:9,color:C.red,display:"block"}}>Low</span>}</span></td>
                <td style={{padding:"13px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span style={{fontSize:11,color:C.white}}>{p.rating}</span>
                  </div>
                </td>
                <td style={{padding:"13px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{setForm({name:p.name,brand:p.brand,price:String(p.price),mrp:String(p.mrp),cat:p.cat,desc:p.desc||"",sizesStr:p.sizes.join(","),colorsStr:p.colors.join(","),stock:String(p.stock),grad:p.grad});setEditId(p.id);setShow(true);}}
                      style={{background:C.gold+"18",border:`1px solid ${C.gold}28`,borderRadius:6,padding:"5px 9px",color:C.gold,display:"flex",cursor:"pointer"}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={()=>del(p.id)}
                      style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:6,padding:"5px 9px",color:C.red,display:"flex",cursor:"pointer"}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminOrders({orders, setOrders, showToast}) {
  const [flt, setFlt] = useState("all");
  const [exp, setExp] = useState(null);
  const list = flt==="all" ? orders : orders.filter(o=>o.status===flt);
  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 className="syne" style={{fontSize:28,fontWeight:800}}>Orders</h1>
        <p style={{fontSize:12,color:C.muted,marginTop:3}}>{orders.length} total orders</p>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {["all","pending","processing","shipped","delivered","cancelled"].map(s=>(
          <button key={s} className={`tab ${flt===s?"on":""}`}
            onClick={()=>setFlt(s)}
            style={{background:flt===s?C.gold+"18":C.s2,border:`1px solid ${flt===s?C.gold+"35":C.border}`,
              textTransform:"capitalize",fontFamily:"'DM Sans',sans-serif"}}>
            {s} ({s==="all"?orders.length:orders.filter(o=>o.status===s).length})
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {list.map(o=>{
          const isExp = exp===o.id;
          return (
            <div className="card" key={o.id} style={{overflow:"hidden"}}>
              <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"background .1s"}}
                onClick={()=>setExp(isExp?null:o.id)}
                onMouseEnter={e=>e.currentTarget.style.background=C.s2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{flex:1,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  <span className="mono" style={{fontSize:12,fontWeight:700,color:C.gold,minWidth:75}}>{o.id}</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.white}}>{o.name}</span>
                  <span style={{fontSize:11,color:C.muted}}>{o.items.length} item{o.items.length>1?"s":""}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.white}}>{rupee(o.total)}</span>
                  {o.payMethod && <span className="chip">{o.payMethod}</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <StatusPill status={o.status}/>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2"
                    style={{transform:isExp?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
              {isExp && (
                <div style={{borderTop:`1px solid ${C.border}`,padding:18}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:14}}>
                    <div>
                      {o.items.map((it,i)=>(
                        <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:9}}>
                          <div style={{width:38,height:38,borderRadius:8,background:`linear-gradient(${it.grad})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{it.img?<img src={it.img} alt="" style={{width:34,height:34,objectFit:"contain"}}/>:<span style={{fontSize:18}}>{it.name[0]}</span>}</div>
                          <div style={{flex:1}}>
                            <p style={{fontSize:12,fontWeight:600,color:C.white}}>{it.name}</p>
                            <p style={{fontSize:10,color:C.dim}}>UK {it.selSize} · {it.selColor} · ×{it.qty}</p>
                          </div>
                          <p style={{fontSize:12,fontWeight:700,color:C.gold}}>{rupee(it.price*it.qty)}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <div style={{background:C.s2,borderRadius:9,padding:12}}>
                        <p style={{fontSize:10,color:C.dim,marginBottom:4}}>📍 Address</p>
                        <p style={{fontSize:12,color:C.white,lineHeight:1.7}}>{o.addr}</p>
                      </div>
                      <div style={{background:C.s2,borderRadius:9,padding:12}}>
                        {[["Subtotal",rupee(o.sub)],o.disc>0?["Discount",`−${rupee(o.disc)}`]:null,["Shipping",o.ship===0?"Free":rupee(o.ship)],["Total",rupee(o.total)]].filter(Boolean).map(([l,v],i,a)=>(
                          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:`${i>0?"6px":0} 0`,borderTop:i>0?`1px solid ${C.border}18`:undefined}}>
                            <span style={{fontSize:11,color:i===a.length-1?C.white:C.muted,fontWeight:i===a.length-1?700:400}}>{l}</span>
                            <span style={{fontSize:11,color:i===a.length-1?C.gold:l==="Discount"?C.green:C.white,fontWeight:600}}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <p style={{fontSize:11,color:C.muted,fontWeight:600}}>Status:</p>
                    {["pending","processing","shipped","delivered","cancelled"].map(s=>{
                      const sc = STATUS[s];
                      return (
                        <button key={s} onClick={()=>{setOrders(p=>p.map(x=>x.id===o.id?{...x,status:s}:x));showToast("Status updated");}}
                          style={{padding:"4px 11px",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize",
                            fontFamily:"'DM Sans',sans-serif",transition:"all .13s",
                            background:o.status===s?sc.color+"22":C.s3,color:o.status===s?sc.color:C.dim,
                            border:`1px solid ${o.status===s?sc.color+"55":C.border}`}}>
                          {s}
                        </button>
                      );
                    })}
                    <button onClick={()=>downloadInvoice(o)}
                      style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"6px 13px",
                        background:C.s3,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,
                        fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s"}}
                      onMouseEnter={e=>{e.currentTarget.style.color=C.white;e.currentTarget.style.borderColor=C.gold+"55";}}
                      onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor=C.border;}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminCoupons({coupons, setCoupons, showToast}) {
  const BLANK = {code:"",type:"percent",value:"",minOrder:"",desc:""};
  const [form, setForm] = useState(BLANK);
  const [show, setShow] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const add = () => {
    if (!form.code||!form.value) { showToast("Fill required fields","error"); return; }
    if (coupons.find(c=>c.code===form.code.toUpperCase())) { showToast("Code already exists","error"); return; }
    setCoupons(p=>[...p,{id:Date.now(),code:form.code.toUpperCase(),type:form.type,value:+form.value,minOrder:+form.minOrder||0,active:true,used:0,desc:form.desc}]);
    setForm(BLANK); setShow(false); showToast("Coupon created");
  };
  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 className="syne" style={{fontSize:28,fontWeight:800}}>Coupons</h1>
          <p style={{fontSize:12,color:C.muted,marginTop:3}}>{coupons.filter(c=>c.active).length} active</p>
        </div>
        <Btn onClick={()=>setShow(!show)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Coupon
        </Btn>
      </div>
      {show && (
        <div className="card" style={{padding:22,marginBottom:22,border:`1px solid ${C.gold}28`}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Create Coupon</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:12}}>
            <Field label="Code *" value={form.code} onChange={e=>f("code",e.target.value.toUpperCase())} placeholder="SAVE15"/>
            <Sel label="Type" value={form.type} onChange={e=>f("type",e.target.value)} opts={[{v:"percent",l:"Percentage (%)"},{v:"flat",l:"Flat Amount (₹)"}]}/>
            <Field label={form.type==="percent"?"Discount % *":"Amount ₹ *"} value={form.value} onChange={e=>f("value",e.target.value)} type="number"/>
            <Field label="Min Order ₹" value={form.minOrder} onChange={e=>f("minOrder",e.target.value)} type="number" placeholder="2000"/>
            <Field label="Description" value={form.desc} onChange={e=>f("desc",e.target.value)} placeholder="Short note" style={{gridColumn:"span 2"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={add}>Create</Btn>
            <Btn variant="ghost" onClick={()=>setShow(false)}>Cancel</Btn>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {coupons.map(c=>(
          <div className="card" key={c.id} style={{padding:18,opacity:c.active?1:.5,transition:"opacity .2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{background:c.active?C.gold+"15":"rgba(255,255,255,.04)",border:`1.5px dashed ${c.active?C.gold:C.border}`,borderRadius:7,padding:"6px 14px"}}>
                <span className="mono" style={{fontSize:16,fontWeight:700,color:c.active?C.gold:C.muted,letterSpacing:2}}>{c.code}</span>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setCoupons(p=>p.map(x=>x.id===c.id?{...x,active:!x.active}:x));showToast("Updated");}}
                  style={{background:c.active?"rgba(34,197,94,.1)":"rgba(255,255,255,.05)",border:`1px solid ${c.active?"rgba(34,197,94,.3)":C.border}`,borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",color:c.active?C.green:C.dim,fontFamily:"'DM Sans',sans-serif"}}>
                  {c.active?"Active":"Off"}
                </button>
                <button onClick={()=>{setCoupons(p=>p.filter(x=>x.id!==c.id));showToast("Deleted");}}
                  style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:6,padding:"4px 7px",color:C.red,cursor:"pointer",display:"flex"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
              <div style={{background:C.s2,borderRadius:7,padding:"9px",textAlign:"center"}}>
                <p className="syne" style={{fontSize:20,fontWeight:800,color:C.gold}}>{c.type==="percent"?`${c.value}%`:`₹${c.value}`}</p>
                <p style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:.8}}>Discount</p>
              </div>
              <div style={{background:C.s2,borderRadius:7,padding:"9px",textAlign:"center"}}>
                <p className="syne" style={{fontSize:20,fontWeight:800,color:C.white}}>{c.used}</p>
                <p style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:.8}}>Used</p>
              </div>
            </div>
            <p style={{fontSize:11,color:C.muted,marginBottom:3}}>{c.desc}</p>
            <p style={{fontSize:10,color:C.dim}}>Min order: <span style={{color:C.white,fontWeight:600}}>{rupee(c.minOrder)}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   USER STORE
═══════════════════════════════════════════════════════════════════ */
function UserStore() {
  const {authUser, setAuthUser, cart, cartQty, wishlist, page, setPage, modal, setModal, products, orders, setOrders, coupons, showToast} = useStore();
  const [curUser, setCurUser] = useState(authUser);
  const [checkData, setCheckData] = useState(null);

  const NAV = [
    {k:"home",    l:"Home"},
    {k:"shop",    l:"Shop"},
    {k:"wishlist",l:"Wishlist"},
    {k:"orders",  l:"My Orders"},
    {k:"profile", l:"Profile"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Navbar */}
      <header style={{background:C.s1,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:600,height:60}}>
        <div style={{maxWidth:1260,margin:"0 auto",padding:"0 28px",height:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>setPage("home")} style={{background:"none",cursor:"pointer"}}>
            <span className="syne" style={{fontSize:18,fontWeight:800,color:C.gold,letterSpacing:2.5}}>SOLESTORE</span>
          </button>
          <nav style={{display:"flex",gap:1}}>
            {NAV.map(n=>(
              <button key={n.k} className={`nav-item ${page===n.k?"on":""}`}
                onClick={()=>setPage(n.k)} style={{fontFamily:"'DM Sans',sans-serif",position:"relative",fontSize:12}}>
                {n.l}
                {n.k==="wishlist"&&wishlist.length>0&&<span style={{position:"absolute",top:4,right:4,width:5,height:5,borderRadius:"50%",background:C.red}}/>}
              </button>
            ))}
          </nav>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <button onClick={()=>setPage("cart")}
              style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:9,
                padding:"7px 13px",display:"flex",alignItems:"center",gap:6,
                fontSize:12,fontWeight:500,color:C.white,cursor:"pointer",position:"relative",transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"60"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Cart
              {cartQty>0 && (
                <span style={{position:"absolute",top:-5,right:-5,background:C.gold,color:"#000",
                  borderRadius:"50%",width:17,height:17,fontSize:9,fontWeight:900,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>{cartQty}</span>
              )}
            </button>
            <Avi initials={curUser.initials} size={32}/>
            <button onClick={()=>setAuthUser(null)} style={{color:C.dim,display:"flex",padding:4,cursor:"pointer",transition:"color .14s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.red}
              onMouseLeave={e=>e.currentTarget.style.color=C.dim}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main style={{maxWidth:1260,margin:"0 auto",padding:"32px 28px"}}>
        {page==="home"    && <HomePage />}
        {page==="shop"    && <ShopPage />}
        {page==="cart"    && <CartPage setCheckData={setCheckData} />}
        {page==="checkout"&& <CheckoutPage checkData={checkData} curUser={curUser} orders={orders} setOrders={setOrders} />}
        {page==="wishlist"&& <WishlistPage />}
        {page==="orders"  && <OrdersPage orders={orders} uid={curUser.id} />}
        {page==="profile" && <ProfilePage user={curUser} setUser={setCurUser} />}
      </main>

      {modal && <ProductModal/>}
    </div>
  );
}

/* ── Home Page ─────────────────────────────────────────────────── */
function HomePage() {
  const {products, setPage, wishlist, addToCart, toggleWish, setModal} = useStore();
  const [cat, setCat] = useState("all");
  const CATS = [{k:"all",l:"All"},{k:"sports",l:"Sports"},{k:"casual",l:"Casual"},{k:"formal",l:"Formal"},{k:"women",l:"Women's"},{k:"accessories",l:"Accessories"}];
  const visible = cat==="all" ? products : products.filter(p=>p.cat===cat);

  return (
    <div className="fu">
      {/* Hero */}
      <div style={{borderRadius:20,padding:"76px 60px",marginBottom:36,position:"relative",overflow:"hidden",
        background:"linear-gradient(150deg,#0d0d14 0%,#111118 60%,#0a0a0f 100%)",border:`1px solid ${C.border}`}}>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:"45%",background:`radial-gradient(circle at 80% 50%,${C.gold}0d,transparent 65%)`}}/>
        <img src={imgHeroBanner} alt="Hero" style={{position:"absolute",bottom:0,right:0,width:"50%",height:"100%",objectFit:"cover",opacity:.35,pointerEvents:"none",maskImage:"linear-gradient(to left,rgba(0,0,0,.7),transparent)"}}/>
        <div style={{position:"relative",maxWidth:520}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,background:C.s2,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 12px",marginBottom:18}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.gold}}/>
            <span style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>New Collection 2026</span>
          </div>
          <h1 className="syne fu1" style={{fontSize:66,fontWeight:800,lineHeight:.88,marginBottom:18}}>
            STEP INTO<br/><span style={{color:C.gold}}>GREATNESS</span>
          </h1>
          <p className="fu2" style={{fontSize:14,color:C.muted,lineHeight:1.85,marginBottom:30}}>
            Premium footwear from the world's best brands. Athletic performance to refined elegance — all curated for you.
          </p>
          <div className="fu3" style={{display:"flex",gap:10}}>
            <Btn size="lg" onClick={()=>setPage("shop")}>Shop Collection</Btn>
            <Btn size="lg" variant="ghost" onClick={()=>setCat("sports")}>Sports →</Btn>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{display:"flex",gap:7,marginBottom:26,flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c.k} onClick={()=>setCat(c.k)}
            style={{padding:"8px 20px",borderRadius:99,fontSize:12,fontWeight:600,cursor:"pointer",
              transition:"all .18s",fontFamily:"'DM Sans',sans-serif",
              background:cat===c.k?C.gold:"none",color:cat===c.k?"#000":C.muted,
              border:`1px solid ${cat===c.k?C.gold:C.border}`}}>
            {c.l}
          </button>
        ))}
      </div>

      {/* Promo banners */}
      {cat==="all" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:30}}>
          {[
            {k:"sports",l:"Sports",sub:"Peak performance",bg:"linear-gradient(135deg,#0e2040,#0f3460)",pimg:imgAirPhantom,c:C.blue},
            {k:"women",l:"Women's",sub:"Style meets comfort",bg:"linear-gradient(135deg,#2a0a18,#5c1a32)",pimg:imgLuna,c:C.pink},
            {k:"formal",l:"Formal",sub:"Crafted for elegance",bg:"linear-gradient(135deg,#0a0c1e,#141836)",pimg:imgOxford,c:C.purple},
            {k:"accessories",l:"Accessories",sub:"Complete your look",bg:"linear-gradient(135deg,#1a1505,#2a2510)",pimg:imgWatch,c:C.gold},
          ].map(b=>(
            <button key={b.k} onClick={()=>setCat(b.k)}
              style={{background:b.bg,borderRadius:14,padding:"22px 18px",cursor:"pointer",
                border:`1px solid ${b.c}20`,textAlign:"left",transition:"all .2s",position:"relative",overflow:"hidden",fontFamily:"'DM Sans',sans-serif"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <img src={b.pimg} alt="" style={{position:"absolute",right:6,bottom:-4,width:70,height:70,objectFit:"contain",opacity:.3}}/>
              <p style={{fontSize:9,color:b.c,textTransform:"uppercase",letterSpacing:2,marginBottom:5,fontWeight:700}}>{products.filter(p=>p.cat===b.k).length} styles</p>
              <p className="syne" style={{fontSize:18,fontWeight:800,color:C.white}}>{b.l}</p>
              <p style={{fontSize:11,color:C.muted,marginTop:3}}>{b.sub}</p>
            </button>
          ))}
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <h2 className="syne" style={{fontSize:18,fontWeight:800}}>
          {cat==="all"?"Featured Products":CATS.find(c=>c.k===cat)?.l+" Collection"}
        </h2>
        {cat==="all" && <button onClick={()=>setPage("shop")} style={{fontSize:12,color:C.gold,fontWeight:600,background:"none",cursor:"pointer"}}>View All →</button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
        {visible.slice(0,cat==="all"?8:undefined).map(p=><ProductCard key={p.id} p={p}/>)}
      </div>
      {cat==="all" && <div style={{textAlign:"center",marginTop:26}}><Btn variant="outline" size="lg" onClick={()=>setPage("shop")}>View All Products →</Btn></div>}
    </div>
  );
}

/* ── Shop Page ─────────────────────────────────────────────────── */
function ShopPage() {
  const {products} = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("popular");
  const [maxP, setMaxP] = useState(15000);
  let list = products.filter(p=>(p.name+p.brand).toLowerCase().includes(q.toLowerCase())&&(cat==="all"||p.cat===cat)&&p.price<=maxP);
  if(sort==="price-asc") list=[...list].sort((a,b)=>a.price-b.price);
  else if(sort==="price-desc") list=[...list].sort((a,b)=>b.price-a.price);
  else if(sort==="rating") list=[...list].sort((a,b)=>b.rating-a.rating);
  else list=[...list].sort((a,b)=>b.reviews-a.reviews);
  return (
    <div className="fu">
      <div style={{marginBottom:20}}>
        <h1 className="syne" style={{fontSize:26,fontWeight:800}}>Shop</h1>
        <p style={{fontSize:12,color:C.muted,marginTop:3}}>{list.length} products</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"210px 1fr",gap:22,alignItems:"start"}}>
        <div className="card" style={{padding:18,position:"sticky",top:70}}>
          <p style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:13,display:"flex",alignItems:"center",gap:5}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </p>
          <Field value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"
            icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>}
            style={{marginBottom:16}}/>
          <p style={{fontSize:9,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Category</p>
          {[{v:"all",l:"All Products",n:products.length},{v:"sports",l:"Sports"},{v:"casual",l:"Casual"},{v:"formal",l:"Formal"},{v:"women",l:"Women's"},{v:"accessories",l:"Accessories"}].map(c=>(
            <button key={c.v} className={`sb-item ${cat===c.v?"on":""}`} onClick={()=>setCat(c.v)}
              style={{display:"flex",justifyContent:"space-between"}}>
              <span>{c.l}</span>
              <span style={{fontSize:10}}>{c.n||products.filter(p=>p.cat===c.v).length}</span>
            </button>
          ))}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,marginTop:14}}>
            <p style={{fontSize:9,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>
              Max Price: <span style={{color:C.gold}}>{rupee(maxP)}</span>
            </p>
            <input type="range" min={1000} max={15000} step={500} value={maxP} onChange={e=>setMaxP(+e.target.value)}
              style={{width:"100%",accentColor:C.gold,cursor:"pointer"}}/>
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,marginTop:14}}>
            <p style={{fontSize:9,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Sort</p>
            {[{v:"popular",l:"Most Popular"},{v:"rating",l:"Top Rated"},{v:"price-asc",l:"Price ↑"},{v:"price-desc",l:"Price ↓"}].map(s=>(
              <button key={s.v} className={`sb-item ${sort===s.v?"on":""}`} onClick={()=>setSort(s.v)}>{s.l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:13,alignContent:"start"}}>
          {list.map(p=><ProductCard key={p.id} p={p}/>)}
          {list.length===0 && (
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:"72px 20px"}}>
              <div style={{fontSize:52,marginBottom:12}}>🔍</div>
              <p className="syne" style={{fontSize:17,fontWeight:700}}>No results found</p>
              <p style={{fontSize:12,color:C.muted,marginTop:4}}>Try adjusting filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Cart Page ─────────────────────────────────────────────────── */
function CartPage({setCheckData}) {
  const {cart, setCart, coupons, showToast, setPage} = useStore();
  const [couponInput, setCI]      = useState("");
  const [applied, setApplied]     = useState(null);
  const updQty = (idx,q) => { if(q<1){setCart(c=>c.filter((_,i)=>i!==idx));return;} setCart(c=>c.map((x,i)=>i===idx?{...x,qty:q}:x)); };
  const sub  = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const disc = calcDiscount(applied,sub);
  const ship = sub-disc>=3000?0:99;
  const total= sub-disc+ship;
  const apply= () => {
    const c = coupons.find(x=>x.code===couponInput.toUpperCase()&&x.active);
    if(!c){showToast("Invalid coupon","error");return;}
    if(sub<c.minOrder){showToast(`Min order ${rupee(c.minOrder)} required`,"error");return;}
    setApplied(c); showToast(`${c.code} applied — saved ${c.type==="percent"?c.value+"%":rupee(c.value)}`);
  };

  if (!cart.length) return (
    <div className="fu" style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:70,marginBottom:14}}>🛒</div>
      <h2 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:7}}>Cart is empty</h2>
      <p style={{color:C.muted,fontSize:13}}>Add some amazing shoes to get started</p>
    </div>
  );

  return (
    <div className="fu">
      <h1 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:22}}>Your Cart</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:22,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {cart.map((item,idx)=>(
            <div className="card" key={idx} style={{padding:15}}>
              <div style={{display:"flex",alignItems:"center",gap:13}}>
                <div style={{width:68,height:68,borderRadius:12,background:`linear-gradient(${item.grad})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{item.img?<img src={item.img} alt="" style={{width:60,height:60,objectFit:"contain"}}/>:<span style={{fontSize:34}}>{item.name[0]}</span>}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:10,color:C.dim}}>{item.brand}</p>
                  <p style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:4}}>{item.name}</p>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:11,color:C.muted}}>UK {item.selSize}</span>
                    <span style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:9,height:9,borderRadius:"50%",background:COLOR_MAP[item.selColor]||"#666",display:"inline-block",border:`1px solid rgba(255,255,255,.2)`}}/>
                      {item.selColor}
                    </span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
                    <button onClick={()=>updQty(idx,item.qty-1)} style={{background:C.s3,padding:"7px 11px",color:C.white,display:"flex",cursor:"pointer",border:"none"}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span style={{padding:"7px 13px",fontSize:12,fontWeight:700,color:C.white,borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`}}>{item.qty}</span>
                    <button onClick={()=>updQty(idx,item.qty+1)} style={{background:C.s3,padding:"7px 11px",color:C.white,display:"flex",cursor:"pointer",border:"none"}}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                  <span style={{fontSize:14,fontWeight:800,color:C.gold,minWidth:75,textAlign:"right"}}>{rupee(item.price*item.qty)}</span>
                  <button onClick={()=>updQty(idx,0)} style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.18)",borderRadius:7,padding:"7px",color:C.red,display:"flex",cursor:"pointer"}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:20,position:"sticky",top:70}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>Order Summary</h3>
          {/* Coupon */}
          <div style={{marginBottom:16}}>
            <p style={{fontSize:10,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>🏷️ Coupon Code</p>
            {applied ? (
              <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.22)",borderRadius:9,padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p className="mono" style={{fontSize:12,color:C.green,fontWeight:700}}>{applied.code}</p>
                  <p style={{fontSize:10,color:C.muted}}>Saved {rupee(disc)}</p>
                </div>
                <button onClick={()=>{setApplied(null);setCI("");}} style={{color:C.red,display:"flex",background:"none",cursor:"pointer"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",gap:7}}>
                  <input value={couponInput} onChange={e=>setCI(e.target.value.toUpperCase())}
                    placeholder="Enter code" onKeyDown={e=>e.key==="Enter"&&apply()}
                    className="field" style={{flex:1}}/>
                  <Btn size="sm" onClick={apply}>Apply</Btn>
                </div>
                <div style={{marginTop:7,display:"flex",gap:5,flexWrap:"wrap"}}>
                  {coupons.filter(c=>c.active).map(c=>(
                    <button key={c.code} onClick={()=>setCI(c.code)}
                      style={{background:"none",border:"none",fontSize:11,color:C.muted,cursor:"pointer",
                        textDecoration:"underline",fontFamily:"'DM Sans',sans-serif",transition:"color .13s"}}
                      onMouseEnter={e=>e.currentTarget.style.color=C.gold}
                      onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
                      {c.code}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Breakdown */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:"flex",flexDirection:"column",gap:9}}>
            {[{l:"Subtotal",v:rupee(sub)},
              ...(disc>0?[{l:`Discount (${applied?.code})`,v:`−${rupee(disc)}`,c:C.green}]:[]),
              {l:"Shipping",v:ship===0?"FREE":rupee(ship),c:ship===0?C.green:undefined},
            ].map(({l,v,c})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:C.muted}}>{l}</span>
                <span style={{fontSize:12,fontWeight:600,color:c||C.white}}>{v}</span>
              </div>
            ))}
            {ship===0 && <p style={{fontSize:10,color:C.green}}>🎉 Free shipping above ₹3,000!</p>}
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:11,marginTop:2,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:700}}>Total</span>
              <span className="syne" style={{fontSize:20,fontWeight:800,color:C.gold}}>{rupee(total)}</span>
            </div>
          </div>
          <Btn full size="lg" style={{marginTop:16}} onClick={()=>{setCheckData({sub,disc,ship,total,coupon:applied});setPage("checkout");}}>
            Checkout →
          </Btn>
          <p style={{fontSize:10,color:C.dim,textAlign:"center",marginTop:9}}>🔒 Secure · SSL encrypted</p>
        </div>
      </div>
    </div>
  );
}

/* ── Checkout Page ─────────────────────────────────────────────── */
function CheckoutPage({checkData, curUser, orders, setOrders}) {
  const {cart, setCart, setPage, showToast} = useStore();
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({name:curUser.name,phone:curUser.phone,line1:"",line2:"",city:"Chennai",pin:""});
  const [placed, setPlaced] = useState(null);
  const [method, setMethod] = useState(null);
  const a = (k,v) => setAddr(p=>({...p,[k]:v}));
  const cd = checkData || {sub:0,disc:0,ship:0,total:0,coupon:null};

  const placeOrder = (payMethod) => {
    const id = "SS-"+(Date.now()+"").slice(-4);
    const o = {
      id, uid:curUser.id, name:addr.name, phone:addr.phone,
      items: cart.map(x=>({...x})),
      sub:cd.sub, disc:cd.disc, ship:cd.ship, total:cd.total,
      status:"processing",
      addr:`${addr.line1}${addr.line2?", "+addr.line2:""}, ${addr.city} — ${addr.pin}`,
      date:new Date().toISOString().split("T")[0],
      coupon:cd.coupon?.code||null,
      payMethod: payMethod || "UPI",
    };
    setOrders(p=>[o,...p]);
    setCart([]);
    setPlaced(o);
    setStep(3);
    showToast("Order placed successfully! 🎉");
  };

  /* Step indicator */
  const StepBar = () => (
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:26}}>
      {["Address","Payment","Confirmation"].map((l,i)=>{
        const n=i+1, done=step>n, active=step===n;
        return (
          <div key={l} style={{display:"flex",alignItems:"center",flex:i<2?1:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:700,transition:"all .25s",
                background:done||active?C.gold:C.s3,
                color:done||active?"#000":C.dim,
                border:`2px solid ${done||active?C.gold:C.border}`,
                boxShadow:active?`0 0 14px ${C.gold}60`:"none"}}>
                {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> : n}
              </div>
              <span style={{fontSize:10,color:done||active?C.gold:C.dim,fontWeight:done||active?600:400,whiteSpace:"nowrap"}}>{l}</span>
            </div>
            {i<2 && <div style={{flex:1,height:2,background:step>n?C.gold:C.border,margin:"0 8px",marginBottom:14,transition:"background .25s"}}/>}
          </div>
        );
      })}
    </div>
  );

  /* Step 3: Confirmation */
  if (step===3&&placed) return (
    <div className="fu" style={{maxWidth:540,margin:"0 auto",textAlign:"center",padding:"40px 0"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(34,197,94,.1)",border:`2px solid ${C.green}`,
        display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",
        animation:"checkPop .55s cubic-bezier(.34,1.56,.64,1) both"}}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M8 18l7 7 13-13" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 className="syne" style={{fontSize:30,fontWeight:800,marginBottom:6}}>Order Confirmed!</h2>
      <p style={{color:C.muted,fontSize:13,marginBottom:18}}>Thank you {addr.name}! Your order is being processed.</p>
      <div className="mono" style={{background:C.gold+"15",border:`1px solid ${C.gold}28`,borderRadius:9,
        padding:"9px 18px",display:"inline-block",fontSize:14,fontWeight:700,color:C.gold,marginBottom:22}}>
        {placed.id}
      </div>
      <div className="card" style={{padding:18,marginBottom:22,textAlign:"left"}}>
        {placed.items.map((it,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,marginBottom:i<placed.items.length-1?10:0}}>
            <div style={{width:40,height:40,borderRadius:8,background:`linear-gradient(${it.grad})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{it.img?<img src={it.img} alt="" style={{width:36,height:36,objectFit:"contain"}}/>:<span style={{fontSize:20}}>{it.name[0]}</span>}</div>
            <div style={{flex:1}}><p style={{fontSize:12,fontWeight:600,color:C.white}}>{it.name}</p><p style={{fontSize:10,color:C.dim}}>UK {it.selSize} · {it.selColor} · ×{it.qty}</p></div>
            <p style={{fontSize:12,fontWeight:700,color:C.gold}}>{rupee(it.price*it.qty)}</p>
          </div>
        ))}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:11,marginTop:11,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:13,fontWeight:700}}>Total Paid</span>
          <span className="syne" style={{fontSize:20,fontWeight:800,color:C.gold}}>{rupee(placed.total)}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn onClick={()=>downloadInvoice(placed)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Invoice
        </Btn>
        <Btn variant="ghost" onClick={()=>setPage("orders")}>View Orders</Btn>
        <Btn variant="outline" onClick={()=>setPage("shop")}>Continue Shopping</Btn>
      </div>
    </div>
  );

  return (
    <div className="fu" style={{maxWidth:780,margin:"0 auto"}}>
      <h1 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:22}}>Checkout</h1>
      <StepBar/>

      {/* Step 1: Address */}
      {step===1 && (
        <div>
          <div className="card" style={{padding:26,marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:18}}>Delivery Address</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Field label="Full Name" value={addr.name} onChange={e=>a("name",e.target.value)}/>
              <Field label="Phone" value={addr.phone} onChange={e=>a("phone",e.target.value)}/>
              <Field label="Address Line 1" value={addr.line1} onChange={e=>a("line1",e.target.value)} placeholder="Door No, Street" style={{gridColumn:"span 2"}}/>
              <Field label="Address Line 2 (Optional)" value={addr.line2} onChange={e=>a("line2",e.target.value)} placeholder="Landmark, Area" style={{gridColumn:"span 2"}}/>
              <Field label="City" value={addr.city} onChange={e=>a("city",e.target.value)}/>
              <Field label="PIN Code" value={addr.pin} onChange={e=>a("pin",e.target.value)} placeholder="600001"/>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setPage("cart")}>← Back to Cart</Btn>
            <Btn size="lg" onClick={()=>{
              if(!addr.name||!addr.phone||!addr.line1||!addr.pin){showToast("Fill all required fields","error");return;}
              setStep(2);
            }}>Continue to Payment →</Btn>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step===2 && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 270px",gap:18,alignItems:"start"}}>
          <div className="card" style={{padding:26}}>
            <PayGateway
              amount={cd.total}
              onSuccess={()=>placeOrder(method)}
              onBack={()=>setStep(1)}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="card" style={{padding:16}}>
              <p style={{fontSize:10,color:C.dim,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Order Summary</p>
              {[["Subtotal",rupee(cd.sub)],
                ...(cd.disc>0?[["Discount",`−${rupee(cd.disc)}`]]:[] ),
                ["Shipping",cd.ship===0?"FREE":rupee(cd.ship)],
                ["Total",rupee(cd.total)]].map(([l,v],i,arr)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:`${i>0?"7px":0} 0`,borderTop:i>0?`1px solid ${C.border}18`:undefined}}>
                  <span style={{fontSize:12,color:i===arr.length-1?C.white:C.muted,fontWeight:i===arr.length-1?700:400}}>{l}</span>
                  <span className={i===arr.length-1?"syne":""} style={{fontSize:i===arr.length-1?18:12,fontWeight:i===arr.length-1?800:600,color:i===arr.length-1?C.gold:l==="Discount"?C.green:C.white}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:14}}>
              <p style={{fontSize:10,color:C.dim,marginBottom:7}}>📍 Delivering to</p>
              <p style={{fontSize:12,color:C.white,lineHeight:1.75}}>{addr.name}<br/>{addr.line1}{addr.line2?", "+addr.line2:""}<br/>{addr.city} — {addr.pin}</p>
            </div>
            <Btn variant="ghost" onClick={()=>setStep(1)} style={{width:"100%",justifyContent:"center",fontSize:12}}>← Edit Address</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Wishlist Page ─────────────────────────────────────────────── */
function WishlistPage() {
  const {products, wishlist} = useStore();
  const items = products.filter(p=>wishlist.includes(p.id));
  if (!items.length) return (
    <div className="fu" style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:68,marginBottom:14}}>🤍</div>
      <h2 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:7}}>Wishlist is empty</h2>
      <p style={{color:C.muted}}>Heart items you love while browsing</p>
    </div>
  );
  return (
    <div className="fu">
      <h1 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:22}}>Wishlist ({items.length})</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
        {items.map(p=><ProductCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

/* ── Orders Page ───────────────────────────────────────────────── */
function OrdersPage({orders, uid}) {
  const [exp, setExp] = useState(null);
  const mine = orders.filter(o=>o.uid===uid);
  const STEPS = ["pending","processing","shipped","delivered"];
  if (!mine.length) return (
    <div className="fu" style={{textAlign:"center",padding:"80px 20px"}}>
      <div style={{fontSize:68,marginBottom:14}}>📦</div>
      <h2 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:7}}>No orders yet</h2>
      <p style={{color:C.muted}}>Your order history appears here</p>
    </div>
  );
  return (
    <div className="fu">
      <h1 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:22}}>My Orders</h1>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {mine.map(o=>{
          const isExp = exp===o.id;
          const stepIdx = STEPS.indexOf(o.status);
          return (
            <div className="card" key={o.id} style={{overflow:"hidden"}}>
              <div style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"background .1s"}}
                onClick={()=>setExp(isExp?null:o.id)}
                onMouseEnter={e=>e.currentTarget.style.background=C.s2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{flex:1,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                  <span className="mono" style={{fontSize:12,fontWeight:700,color:C.gold}}>{o.id}</span>
                  <div style={{display:"flex"}}>
                    {o.items.slice(0,3).map((it,i)=>(
                      <div key={i} style={{width:34,height:34,borderRadius:7,background:`linear-gradient(${it.grad})`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        marginLeft:i?-7:0,border:`2px solid ${C.s1}`,flexShrink:0,overflow:"hidden"}}>{it.img?<img src={it.img} alt="" style={{width:30,height:30,objectFit:"contain"}}/>:<span style={{fontSize:16}}>{it.name[0]}</span>}</div>
                    ))}
                  </div>
                  <span style={{fontSize:12,color:C.muted}}>{o.items.length} item{o.items.length>1?"s":""}</span>
                  <span style={{fontSize:13,fontWeight:700}}>{rupee(o.total)}</span>
                  <span style={{fontSize:10,color:C.dim}}>{o.date}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <StatusPill status={o.status}/>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2"
                    style={{transform:isExp?"rotate(180deg)":"none",transition:"transform .2s"}}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
              {isExp && (
                <div style={{borderTop:`1px solid ${C.border}`,padding:18}}>
                  {/* Progress timeline */}
                  {o.status!=="cancelled" && (
                    <div style={{marginBottom:20}}>
                      <div style={{display:"flex",alignItems:"center"}}>
                        {STEPS.map((s,i)=>{
                          const done=stepIdx>=i, active=stepIdx===i;
                          return (
                            <div key={s} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:0}}>
                              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                                <div style={{width:26,height:26,borderRadius:"50%",transition:"all .25s",
                                  background:done?C.gold:C.s3,border:`2px solid ${done?C.gold:C.border}`,
                                  display:"flex",alignItems:"center",justifyContent:"center",
                                  boxShadow:active?`0 0 12px ${C.gold}55`:"none"}}>
                                  {done&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                </div>
                                <span style={{fontSize:9,color:done?C.gold:C.dim,textTransform:"capitalize",whiteSpace:"nowrap"}}>{s}</span>
                              </div>
                              {i<STEPS.length-1&&<div style={{flex:1,height:2,background:stepIdx>i?C.gold:C.border,margin:"0 5px",marginBottom:15,transition:"background .25s"}}/>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {o.items.map((it,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:11,marginBottom:9}}>
                      <div style={{width:48,height:48,borderRadius:10,background:`linear-gradient(${it.grad})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{it.img?<img src={it.img} alt="" style={{width:42,height:42,objectFit:"contain"}}/>:<span style={{fontSize:24}}>{it.name[0]}</span>}</div>
                      <div style={{flex:1}}>
                        <p style={{fontSize:12,fontWeight:600,color:C.white}}>{it.name}</p>
                        <p style={{fontSize:10,color:C.dim}}>{it.brand} · UK {it.selSize} · {it.selColor} · ×{it.qty}</p>
                      </div>
                      <p style={{fontSize:12,fontWeight:700,color:C.gold}}>{rupee(it.price*it.qty)}</p>
                    </div>
                  ))}
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:5,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
                    <div>
                      <p style={{fontSize:11,color:C.dim}}>📍 {o.addr}</p>
                      {o.coupon && <p style={{fontSize:10,color:C.green,marginTop:3}}>🏷️ {o.coupon} applied (saved {rupee(o.disc)})</p>}
                      {o.payMethod && <p style={{fontSize:10,color:C.muted,marginTop:2}}>💳 {o.payMethod}</p>}
                    </div>
                    <button onClick={()=>downloadInvoice(o)}
                      style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",
                        background:C.s3,border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .18s"}}
                      onMouseEnter={e=>{e.currentTarget.style.color=C.white;e.currentTarget.style.borderColor=C.gold+"55";}}
                      onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor=C.border;}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Profile Page ──────────────────────────────────────────────── */
function ProfilePage({user, setUser}) {
  const {showToast} = useStore();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({...user});
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const save = () => { setUser(form); setEdit(false); showToast("Profile updated"); };
  return (
    <div className="fu" style={{maxWidth:500}}>
      <h1 className="syne" style={{fontSize:26,fontWeight:800,marginBottom:22}}>My Profile</h1>
      <div className="card" style={{padding:26}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,paddingBottom:20,borderBottom:`1px solid ${C.border}`}}>
          <Avi initials={user.initials} size={60}/>
          <div>
            <h2 style={{fontSize:17,fontWeight:800}}>{user.name}</h2>
            <p style={{fontSize:12,color:C.muted,marginTop:2}}>{user.email}</p>
            <p style={{fontSize:10,color:C.dim,marginTop:3}}>Member since {user.joined}</p>
          </div>
        </div>
        {edit ? (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Field label="Full Name" value={form.name} onChange={e=>f("name",e.target.value)}/>
            <Field label="Email" value={form.email} onChange={e=>f("email",e.target.value)} type="email"/>
            <Field label="Phone" value={form.phone} onChange={e=>f("phone",e.target.value)}/>
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <Btn onClick={save}>Save Changes</Btn>
              <Btn variant="ghost" onClick={()=>{setEdit(false);setForm({...user});}}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["Full Name",user.name],["Email",user.email],["Phone",user.phone]].map(([l,v])=>(
              <div key={l} style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 14px"}}>
                <p style={{fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</p>
                <p style={{fontSize:13,color:C.white,fontWeight:500}}>{v}</p>
              </div>
            ))}
            <Btn variant="outline" style={{marginTop:7}} onClick={()=>setEdit(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════ */
function AppContent() {
  const {authUser} = useStore();
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Toast/>
      {!authUser
        ? <LoginPage/>
        : authUser.role==="admin"
          ? <AdminPanel/>
          : <UserStore/>}
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent/>
    </StoreProvider>
  );
}
