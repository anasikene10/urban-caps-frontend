import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Check, ArrowRight, Bell, Truck, ChevronLeft } from "lucide-react";
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
      <line x1="70" y1="30" x2="88"
