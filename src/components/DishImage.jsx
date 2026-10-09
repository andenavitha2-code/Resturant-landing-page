import { img } from "../lib/assets";

/** Dish photo, or an emoji tile for placeholder items that have no photo yet. */
export default function DishImage({ item, order = false, className = "" }) {
  const file = (order && item.orderImage) || item.image;
  if (file) return <img src={img(file)} alt={item.name} className={className} />;
  return (
    <div role="img" aria-label={item.name} className={`flex items-center justify-center rounded-full bg-brand/10 text-6xl ${className}`}>
      <span aria-hidden>{item.emoji ?? "🍽️"}</span>
    </div>
  );
}

export function Stars({ n, className = "", on = "text-brand", off = "text-stone-200 dark:text-stone-600" }) {
  return (
    <div className={`flex gap-1 ${className}`} role="img" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((s) => <span key={s} aria-hidden className={s < n ? on : off}>★</span>)}
    </div>
  );
}
