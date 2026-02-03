// app/admin/coin-address/page.tsx
"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function CoinAddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState({ coin: "BTC", address: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/admin/coin-address");
      const data = await res.json();
      setAddresses(data || []);
    }
    fetchData();
  }, []);

  async function load() {
    const res = await fetch("/api/admin/coin-address");
    const data = await res.json();
    setAddresses(data || []);
  }

  async function save() {
    if (editingId) {
      const res = await fetch(`/api/admin/coin-address/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) return alert("Error");
      alert("Saved");
      setEditingId(null);
      setForm({ coin: "BTC", address: "" });
      load();
      return;
    }
    const res = await fetch("/api/admin/coin-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return alert("Error");
    alert("Created");
    setForm({ coin: "BTC", address: "" });
    load();
  }

  async function edit(id: string) {
    const res = await fetch(`/api/admin/coin-address/${id}`);
    const d = await res.json();
    setEditingId(id);
    setForm({ coin: d.coin, address: d.address });
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const res = await fetch(`/api/admin/coin-address/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return alert("Error");
    alert("Deleted");
    load();
  }

  return (
    <Wrap>
      <Card>
        <h3>Coin Addresses</h3>

        <Row>
          <Label>Coin</Label>
          <Select
            value={form.coin}
            onChange={(e) => setForm({ ...form, coin: e.target.value })}
          >
            <option>BTC</option>
            <option>USDT-TRC20</option>
            <option>ETH</option>
          </Select>
        </Row>

        <Row>
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </Row>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={save}>{editingId ? "Save" : "Create"}</button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({ coin: "BTC", address: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <hr style={{ margin: "16px 0" }} />

        <List>
          {addresses.map((a) => (
            <Item key={a._id}>
              <div>
                <b>{a.coin}</b>
                <div style={{ color: "#666" }}>{a.address}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => edit(a._id)}>Edit</button>
                <button onClick={() => remove(a._id)}>Delete</button>
              </div>
            </Item>
          ))}
        </List>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 30px;
`;
const Card = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  max-width: 900px;
`;
const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;
const Label = styled.label`
  width: 120px;
  font-weight: 600;
`;
const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;
const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;
const List = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eee;
`;
