/**
 * Shared gradients for the ingredient art. Rendered once per SVG stage so the
 * 24 food renderers stay light — they only reference these by id.
 */
export function FoodDefs() {
  return (
    <defs>
      <radialGradient id="fa-gloss" cx="34%" cy="26%" r="72%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
      </radialGradient>

      <linearGradient id="fa-beef" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F2707A" />
        <stop offset="55%" stopColor="#D8404F" />
        <stop offset="100%" stopColor="#A31F31" />
      </linearGradient>
      <linearGradient id="fa-wagyu" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FA8E93" />
        <stop offset="50%" stopColor="#E2515C" />
        <stop offset="100%" stopColor="#B22A38" />
      </linearGradient>
      <linearGradient id="fa-lamb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5949A" />
        <stop offset="100%" stopColor="#C4525E" />
      </linearGradient>
      <linearGradient id="fa-pork" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBC7C2" />
        <stop offset="100%" stopColor="#E58C88" />
      </linearGradient>
      <linearGradient id="fa-chicken" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBE3C4" />
        <stop offset="100%" stopColor="#E3BE8C" />
      </linearGradient>
      <linearGradient id="fa-prawn" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFB08A" />
        <stop offset="55%" stopColor="#F5764F" />
        <stop offset="100%" stopColor="#D84E2E" />
      </linearGradient>
      <linearGradient id="fa-fish" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE9E2" />
        <stop offset="100%" stopColor="#EDB7A6" />
      </linearGradient>
      <linearGradient id="fa-squid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFDF8" />
        <stop offset="100%" stopColor="#E4D9CD" />
      </linearGradient>
      <linearGradient id="fa-white-ball" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#DFD4C4" />
      </linearGradient>
      <linearGradient id="fa-leaf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8CC64A" />
        <stop offset="100%" stopColor="#3E7A1E" />
      </linearGradient>
      <linearGradient id="fa-leaf-deep" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6BA834" />
        <stop offset="100%" stopColor="#2C5E15" />
      </linearGradient>
      <linearGradient id="fa-stem" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBFCEC" />
        <stop offset="100%" stopColor="#D6E2B4" />
      </linearGradient>
      <linearGradient id="fa-corn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFE07A" />
        <stop offset="100%" stopColor="#E8A824" />
      </linearGradient>
      <linearGradient id="fa-shiitake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9A6B44" />
        <stop offset="100%" stopColor="#5A3A22" />
      </linearGradient>
      <linearGradient id="fa-oyster" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E6DACB" />
        <stop offset="100%" stopColor="#B39C82" />
      </linearGradient>
      <linearGradient id="fa-udon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFCF2" />
        <stop offset="100%" stopColor="#E6DCC2" />
      </linearGradient>
      <linearGradient id="fa-ramen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBDC8F" />
        <stop offset="100%" stopColor="#E0B354" />
      </linearGradient>
      <linearGradient id="fa-tofu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFCF0" />
        <stop offset="100%" stopColor="#EADFC0" />
      </linearGradient>
      <linearGradient id="fa-puff" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F3C173" />
        <stop offset="100%" stopColor="#C88735" />
      </linearGradient>
      <linearGradient id="fa-dumpling" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF6E2" />
        <stop offset="100%" stopColor="#E7CE9E" />
      </linearGradient>
      <linearGradient id="fa-meatball" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C88A6A" />
        <stop offset="100%" stopColor="#8E5136" />
      </linearGradient>
    </defs>
  );
}
