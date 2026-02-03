import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { catalogApi, orderApi } from "../api";
import { parseJwt } from "../auth";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
};

export default function Menu() {
  const nav = useNavigate();

  const token = localStorage.getItem("token") || "";
  const user = useMemo(() => parseJwt(token), [token]);
  const isAdmin = user?.role === "ADMIN";

  const [items, setItems] = useState<MenuItem[]>([]);
  const [msg, setMsg] = useState("");

  // cart: itemId -> { item, qty }
  const [cart, setCart] = useState<Record<string, { item: MenuItem; qty: number }>>({});

  // coupon support
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState(""); // disclaimer

  // ADMIN Create Item fields
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    isAvailable: true,
  });

  const [adminMsg, setAdminMsg] = useState("");

  const fetchItems = async () => {
    setMsg("");
    const res = await catalogApi.get("/items");
    setItems(res.data?.data || []);
  };

  useEffect(() => {
    fetchItems().catch(() => setMsg("Failed to load menu"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item._id];
      const qty = existing ? existing.qty + 1 : 1;
      return { ...prev, [item._id]: { item, qty } };
    });
  };

  const decrementFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev[id];
      if (!existing) return prev;

      if (existing.qty <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }

      return { ...prev, [id]: { ...existing, qty: existing.qty - 1 } };
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
    setCouponCode("");
    setCouponMsg("");
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((sum, x) => sum + x.item.price * x.qty, 0);

  const placeOrder = async () => {
    setMsg("");
    setCouponMsg("");

    if (cartItems.length === 0) {
      setCouponMsg("Cart is empty. Add some items before placing order.");
      return;
    }

    try {
      const payload: any = {
        items: cartItems.map((x) => ({ itemId: x.item._id, quantity: x.qty })),
      };

      if (couponCode.trim()) {
        payload.couponCode = couponCode.trim().toUpperCase();
      }

      const res = await orderApi.post("/order", payload);
      const orderId = res.data?.data?._id;

      clearCart();
      nav(`/order/${orderId}`);
    } catch (err: any) {
      const backendMessage = err?.response?.data?.error?.message || "Order failed";

      // Coupon disclaimer handling
      // (Backend should return something like "Invalid coupon code")
      if (
        backendMessage.toLowerCase().includes("coupon") ||
        backendMessage.toLowerCase().includes("invalid")
      ) {
        setCouponMsg(`⚠️ ${backendMessage}`);
        return;
      }

      setMsg(backendMessage);
    }
  };
  const validateNewItem = () => {
    const name = newItem.name.trim();
    const category = newItem.category.trim();
    const price = Number(newItem.price);

    if (!name) return "Name is required";
    if (!category) return "Category is required";
    if (!price || price <= 0) return "Price must be greater than 0";

    return "";
  };
  const createItem = async () => {
    const err = validateNewItem();
    if (err) {
      setAdminMsg(` ${err}`);
      return;
    }
    setMsg("");
    try {
      await catalogApi.post("/items", newItem);
      setNewItem({ name: "", price: 0, category: "", description: "", isAvailable: true });
      await fetchItems();
      setMsg("Item created");
      setAdminMsg(`✅ Item created succesfully`);
    } catch (err: any) {
      setMsg(err?.response?.data?.error?.message || "Create item failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Menu</h2>

        <div>
          <span style={{ marginRight: 12 }}>
            {user?.email} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

      {/* ADMIN Create Item */}
      {isAdmin && (
        <div style={{ border: "1px solid #ccc", padding: 12, marginTop: 15, marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>ADMIN: Create Menu Item</h3>
          {adminMsg && (
            <p style={{ color: adminMsg.startsWith("✅") ? "green" : "red" }}>{adminMsg}</p>
          )}

          <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="name"
            />

            <input
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              placeholder="category"
            />

            <input
              //ref={price}
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              placeholder="price"
              type="number"
            />

            <input
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="description"
            />

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={newItem.isAvailable}
                onChange={(e) => setNewItem({ ...newItem, isAvailable: e.target.checked })}
              />
              Available
            </label>

            <button onClick={createItem}>Create Item</button>
          </div>
        </div>
      )}

      {/* Menu + Cart */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Menu List */}
        <div>
          <h3>Menu Items</h3>

          {items.length === 0 ? (
            <p>No menu items available</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {items.map((it) => (
                <li key={it._id} style={{ marginBottom: 10 }}>
                  <b>{it.name}</b> - ₹{it.price} ({it.category}){" "}
                  {!it.isAvailable && <span style={{ color: "gray" }}>(Not available)</span>}{" "}
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => addToCart(it)}
                    disabled={!it.isAvailable}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart */}
        <div style={{ border: "1px solid #ccc", padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Cart</h3>

          {cartItems.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <>
              <ul style={{ paddingLeft: 18 }}>
                {cartItems.map((x) => (
                  <li key={x.item._id} style={{ marginBottom: 10 }}>
                    <div>
                      <b>{x.item.name}</b>
                    </div>
                    <div>
                      Qty: {x.qty} | ₹{x.item.price * x.qty}
                    </div>

                    <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                      <button onClick={() => decrementFromCart(x.item._id)}>-</button>
                      <button onClick={() => addToCart(x.item)}>+</button>
                      <button onClick={() => removeFromCart(x.item._id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>

              <p>
                <b>Total:</b> ₹{total}
              </p>
              <p>
                <b>Discount:</b> ₹0
              </p>

              <p style={{ color: "gray", fontSize: 12 }}>
                Discount will be applied after placing order (if coupon is valid).
              </p>

              {/* Coupon UI */}
              <div style={{ marginTop: 12 }}>
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  style={{ width: "100%", padding: 6 }}
                />

                {couponMsg && (
                  <p style={{ marginTop: 10, color: couponMsg.startsWith("⚠️") ? "red" : "green" }}>
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                <button onClick={placeOrder}>Place Order</button>
                <button onClick={clearCart}>Clear Cart</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
