import type { ReactElement } from "react";
import { FOOD_IMAGES } from "../lib/foodImages";

interface FoodIllustrationProps {
  name: string;
  size?: number;
  className?: string;
  variant?: "circle" | "rect";
}

function BiryaniIcon() {
  return (
    <>
      <circle cx="48" cy="48" r="48" fill="#F8D7C4" />
      <path d="M20 46 Q48 40 76 46 L70 66 Q48 74 26 66 Z" fill="#C97B45" />
      <ellipse cx="48" cy="45" rx="28" ry="7" fill="#F3E4C9" />
      <circle cx="38" cy="43" r="2.5" fill="#E3A567" />
      <circle cx="52" cy="41" r="2.5" fill="#E3A567" />
      <circle cx="45" cy="47" r="2" fill="#8FA37E" />
      <circle cx="58" cy="46" r="2" fill="#8FA37E" />
    </>
  );
}

function BurgerIcon() {
  return (
    <>
      <circle cx="48" cy="48" r="48" fill="#FCEBD5" />
      <path d="M28 46 Q48 24 68 46 Z" fill="#E8B473" />
      <circle cx="40" cy="36" r="1.6" fill="#FCEBD5" />
      <circle cx="48" cy="32" r="1.6" fill="#FCEBD5" />
      <circle cx="56" cy="36" r="1.6" fill="#FCEBD5" />
      <path d="M26 46 Q48 54 70 46 L70 50 Q48 58 26 50 Z" fill="#9CB380" />
      <rect x="26" y="50" width="44" height="8" rx="4" fill="#8B5A3C" />
      <path d="M26 58 L34 66 L40 58 L48 66 L54 58 L62 66 L70 58 Z" fill="#F4C95D" />
      <rect x="28" y="64" width="40" height="10" rx="5" fill="#E8B473" />
    </>
  );
}

function SandwichIcon() {
  return (
    <>
      <circle cx="48" cy="48" r="48" fill="#F8D7C4" />
      <path d="M48 22 L74 68 L22 68 Z" fill="#EAC996" />
      <path d="M34 44 L62 44 L58 50 L38 50 Z" fill="#D9705A" />
      <path d="M32 54 L64 54 L60 60 L36 60 Z" fill="#9CB380" />
      <line x1="48" y1="18" x2="48" y2="26" stroke="#222222" strokeWidth="2" />
      <circle cx="48" cy="16" r="3" fill="#D9705A" />
    </>
  );
}

function JuiceIcon() {
  return (
    <>
      <circle cx="48" cy="48" r="48" fill="#FBE0DE" />
      <path d="M36 30 L60 30 L56 70 L40 70 Z" fill="none" stroke="#222222" strokeWidth="2" />
      <path d="M38.5 42 L57.5 42 L55.2 68 L40.8 68 Z" fill="#F0A868" />
      <line x1="58" y1="20" x2="50" y2="42" stroke="#F4B6C2" strokeWidth="3" strokeLinecap="round" />
      <circle cx="66" cy="26" r="8" fill="#F0A868" />
    </>
  );
}

function GenericIcon() {
  return (
    <>
      <circle cx="48" cy="48" r="48" fill="#F8D7C4" />
      <circle cx="48" cy="48" r="22" fill="#FFFFFF" stroke="#C97B45" strokeWidth="2" />
      <line x1="34" y1="34" x2="34" y2="46" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="34" x2="38" y2="46" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="46" x2="36" y2="62" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 34 Q64 40 60 46 L60 62" fill="none" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

const ICONS: Record<string, () => ReactElement> = {
  "chicken biryani": BiryaniIcon,
  "beef burger": BurgerIcon,
  "club sandwich": SandwichIcon,
  "fresh juice": JuiceIcon,
};

export function FoodIllustration({ name, size = 72, className, variant = "circle" }: FoodIllustrationProps) {
  const key = name.trim().toLowerCase();
  const photo = FOOD_IMAGES[key];

  if (photo) {
    const boxStyle =
      variant === "circle" ? { width: size, height: size } : { width: "100%", height: size };
    return (
      <div
        className={`overflow-hidden ${variant === "circle" ? "rounded-full" : ""} ${className ?? ""}`}
        style={boxStyle}
      >
        <img
          src={photo.src}
          alt={name}
          className="h-full w-full object-cover"
          style={{
            objectPosition: photo.position ?? "center",
            transform: photo.scale ? `scale(${photo.scale})` : undefined,
          }}
        />
      </div>
    );
  }

  const Icon = ICONS[key] ?? GenericIcon;

  if (variant === "rect") {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--color-soft-peach)] ${className ?? ""}`}
        style={{ width: "100%", height: size }}
      >
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 96 96" aria-hidden="true">
          <Icon />
        </svg>
      </div>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} aria-hidden="true">
      <Icon />
    </svg>
  );
}
