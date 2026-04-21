export function EmptyClientsIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="10"
        y="14"
        width="100"
        height="44"
        rx="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <line x1="10" y1="26" x2="110" y2="26" stroke="currentColor" strokeOpacity="0.15" />
      <circle cx="22" cy="40" r="5" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="22" cy="52" r="5" stroke="currentColor" strokeOpacity="0.15" />
      <line x1="33" y1="38" x2="74" y2="38" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="33" y1="42" x2="58" y2="42" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="33" y1="50" x2="70" y2="50" stroke="currentColor" strokeOpacity="0.15" />
      <line x1="33" y1="54" x2="54" y2="54" stroke="currentColor" strokeOpacity="0.1" />
      <circle cx="94" cy="40" r="2" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

export function SearchEmptyIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="34" cy="28" r="16" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.25" />
      <line
        x1="46"
        y1="40"
        x2="58"
        y2="52"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1="26" y1="24" x2="42" y2="24" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="26" y1="30" x2="38" y2="30" stroke="currentColor" strokeOpacity="0.15" />
    </svg>
  );
}
