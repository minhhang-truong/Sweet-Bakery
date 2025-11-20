import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);

function load() {
  try { return JSON.parse(localStorage.getItem("cart:v1")) || []; }
  catch { return []; }
}
function save(items) {
  localStorage.setItem("cart:v1", JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => { save(items); }, [items]);

  const api = useMemo(() => ({
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),

    add(item) { // item: {id,name,image,price}
      setItems(prev => {
        const ix = prev.findIndex(p => p.id === item.id);
        if (ix >= 0) {
          const copy = [...prev];
          copy[ix] = { ...copy[ix], qty: copy[ix].qty + 1 };
          return copy;
        }
        return [...prev, { ...item, qty: 1 }];
      });
    },
    remove(id) { setItems(prev => prev.filter(i => i.id !== id)); },
    setQty(id, qty) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty|0) } : i));
    },
    inc(id) { setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)); },
    dec(id) { setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)); },
    clear() { setItems([]); },
  }), [items]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
