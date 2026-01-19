import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderApi } from "../api";

type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderResponse = {
  _id: string;
  status: string;
  createdAt?: string;
  items: OrderItem[];
  totalAmount: number;
  couponCode?: string;
  discount?: number; // how much discount applied
  finalAmount?: number; // payable total after discount
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await orderApi.get(`/orders/${id}`);
      setOrder(res.data?.data);
    };

    load().catch((err) => {
      const backendMessage = err?.response?.data?.error?.message || "Failed to load order";
      setMsg(backendMessage);
    });
  }, [id]);

  if (msg) return <div style={{ padding: 20 }}>{msg}</div>;
  if (!order) return <div style={{ padding: 20 }}>Loading...</div>;

  const itemsTotal = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  // ✅ fallback logic in case backend does not send finalAmount
  const discount = order.discount ?? 0;
  const payable = Math.max(itemsTotal - discount, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>Order Details</h2>

      <p>
        <b>Order ID:</b> {order._id}
      </p>
      <p>
        <b>Status:</b> {order.status}
      </p>

      {order.createdAt && (
        <p>
          <b>Created At:</b> {new Date(order.createdAt).toLocaleString()}
        </p>
      )}

      <hr />

      <h3>Items</h3>
      <ul style={{ paddingLeft: 18 }}>
        {order.items.map((it) => (
          <li key={it.itemId} style={{ marginBottom: 8 }}>
            <b>{it.name}</b> — ₹{it.price} × {it.quantity} = ₹{it.price * it.quantity}
          </li>
        ))}
      </ul>

      <hr />

      <h3>Bill Summary</h3>

      <p>
        <b>Items Total:</b> ₹{itemsTotal}
      </p>

      <>
        <p>
          <b>Discount:</b> ₹{discount}
        </p>

        <p>
          <b>Payable Amount:</b> ₹{payable}
        </p>
      </>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={() => alert("Sending to printer!!!! Thankyou...")}>Submit</button>
        <Link to="/menu">Back to Menu</Link>
      </div>
    </div>
  );
}
