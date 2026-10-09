import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { byId } from "../data/menu";
import { usePersistentState } from "../lib/storage";

export const TAX_RATE = 0.045;
export const VOUCHERS = { FREETOEAT: 5 }; // code -> $ off

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [qtys, setQtys] = usePersistentState("delizioso.cart", {});
  const [order, setOrder] = usePersistentState("delizioso.lastOrder", null);
  const [voucher, setVoucherText] = useState("");
  const [applied, setApplied] = useState(0); // $ off currently applied
  const [voucherMessage, setMsg] = useState("");
  const [draft, setDraft] = useState({});

  const lines = useMemo(
    () => Object.entries(qtys).flatMap(([id, qty]) => { const item = byId(id); return item && qty > 0 ? [{ item, qty }] : []; }),
    [qtys],
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.item.price, 0);
  const taxFee = subtotal * TAX_RATE;
  const discount = Math.min(applied, subtotal);
  const total = Math.max(0, subtotal + taxFee - discount);

  const add = useCallback((id, qty = 1) => setQtys((q) => ({ ...q, [id]: (q[id] ?? 0) + qty })), [setQtys]);
  const setQty = useCallback((id, qty) => setQtys((q) => {
    if (qty <= 0) { const { [id]: _drop, ...rest } = q; return rest; }
    return { ...q, [id]: qty };
  }), [setQtys]);
  const remove = useCallback((id) => setQty(id, 0), [setQty]);

  const setVoucher = (v) => { setVoucherText(v); setApplied(0); setMsg(""); };
  const applyVoucher = () => {
    const off = VOUCHERS[voucher.trim().toUpperCase()];
    if (off) { setApplied(off); setMsg(`Voucher applied: $${off} off`); }
    else { setApplied(0); setMsg(voucher.trim() ? "That voucher code isn't valid." : "Enter a voucher code first."); }
  };

  const placeOrder = (o) => {
    const placed = {
      ...o,
      id: String(Math.floor(100000 + Math.random() * 900000)),
      lines: lines.map((l) => ({ name: l.item.name, qty: l.qty, price: l.item.price })),
      subtotal, taxFee, discount, total,
    };
    setOrder(placed);
    setQtys({});
    setVoucherText(""); setApplied(0); setMsg(""); setDraft({});
    return placed;
  };

  const value = { lines, count, subtotal, taxFee, discount, total, add, setQty, remove, voucher, voucherApplied: applied > 0, voucherMessage, setVoucher, applyVoucher, draft, setDraft, order, placeOrder };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
