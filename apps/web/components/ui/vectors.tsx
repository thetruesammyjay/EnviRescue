import type { SVGProps } from "react";

export function VectorHeroCampus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height="180" viewBox="0 0 320 180" width="320" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect fill="#bbf7d0" height="160" rx="28" width="300" x="10" y="10" />
      <circle cx="160" cy="90" fill="#dcfce7" r="65" />
      <path d="M70 140 C100 80, 220 80, 250 140 Z" fill="#86efac" />
      <path d="M120 135 C140 100, 180 100, 200 135 Z" fill="#4ade80" />
      <rect fill="#15803d" height="35" rx="4" width="8" x="156" y="105" />
      <circle cx="160" cy="95" fill="#16a34a" r="22" />
      <circle cx="145" cy="102" fill="#22c55e" r="16" />
      <circle cx="175" cy="102" fill="#15803d" r="16" />
      <rect fill="#fef08a" height="40" rx="8" width="45" x="80" y="100" />
      <polygon fill="#f59e0b" points="80,100 102.5,80 125,100" />
      <rect fill="#fef9c3" height="10" rx="2" width="10" x="90" y="112" />
      <rect fill="#fef9c3" height="10" rx="2" width="10" x="105" y="112" />
      <rect fill="#bae6fd" height="50" rx="8" width="55" x="200" y="90" />
      <polygon fill="#0284c7" points="200,90 227.5,70 255,90" />
      <rect fill="#e0f2fe" height="12" rx="2" width="12" x="210" y="105" />
      <rect fill="#e0f2fe" height="12" rx="2" width="12" x="230" y="105" />
      <circle cx="260" cy="40" fill="#fde047" r="18" />
    </svg>
  );
}

export function VectorScanIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height="140" viewBox="0 0 200 140" width="200" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect fill="#fef9c3" height="130" rx="24" width="180" x="10" y="5" />
      <rect fill="#ffffff" height="90" rx="16" stroke="#fcd34d" strokeWidth="2" width="140" x="30" y="25" />
      <path d="M45 40 L60 40 M45 40 L45 55" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
      <path d="M155 40 L140 40 M155 40 L155 55" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
      <path d="M45 100 L60 100 M45 100 L45 85" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
      <path d="M155 100 L140 100 M155 100 L155 85" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
      <rect fill="#059669" height="35" rx="6" width="20" x="90" y="48" />
      <rect fill="#34d399" height="8" rx="2" width="12" x="94" y="42" />
      <line stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="2" x1="40" x2="160" y1="70" y2="70" />
    </svg>
  );
}

export function VectorBinSorting(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" height="120" viewBox="0 0 240 120" width="240" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(15, 20)">
        <rect fill="#fef08a" height="70" rx="12" width="50" x="0" y="15" />
        <rect fill="#f59e0b" height="12" rx="4" width="60" x="-5" y="8" />
        <circle cx="25" cy="50" fill="#ffffff" r="12" />
        <path d="M22 45 L28 45 L25 55 Z" fill="#d97706" />
      </g>
      <g transform="translate(90, 20)">
        <rect fill="#bbf7d0" height="70" rx="12" width="50" x="0" y="15" />
        <rect fill="#16a34a" height="12" rx="4" width="60" x="-5" y="8" />
        <circle cx="25" cy="50" fill="#ffffff" r="12" />
        <path d="M20 50 C20 44, 30 44, 30 50 Z" fill="#15803d" />
      </g>
      <g transform="translate(165, 20)">
        <rect fill="#bae6fd" height="70" rx="12" width="50" x="0" y="15" />
        <rect fill="#0284c7" height="12" rx="4" width="60" x="-5" y="8" />
        <circle cx="25" cy="50" fill="#ffffff" r="12" />
        <rect fill="#0369a1" height="14" rx="2" width="10" x="20" y="43" />
      </g>
    </svg>
  );
}
