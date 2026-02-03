// app/admin/stats/page.tsx
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

export default function AdminStatsPage() {
  const [stat, setStat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStat();
  }, []);

  async function fetchStat() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStat(data || { tradersOnline: 0, totalRegistered: 0, dealsToday: 0 });
    setLoading(false);
  }

  async function save() {
    if (!stat._id) {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat),
      });
      if (!res.ok) return alert("Error");
      toast.success("Created");
      fetchStat();
      return;
    }
    const res = await fetch("/api/admin/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stat),
    });
    if (!res.ok) return alert("Error");
    toast.success("Saved");
    fetchStat();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <Wrap>
      <Card>
        <h3>Platform Stats</h3>
        <Row>
          <Label>Traders Online</Label>
          <Input
            type="number"
            value={stat.tradersOnline || 0}
            onChange={(e) =>
              setStat({ ...stat, tradersOnline: Number(e.target.value) })
            }
          />
        </Row>
        <Row>
          <Label>Total Registered</Label>
          <Input
            type="number"
            value={stat.totalRegistered || 0}
            onChange={(e) =>
              setStat({ ...stat, totalRegistered: Number(e.target.value) })
            }
          />
        </Row>
        <Row>
          <Label>Deals Today</Label>
          <Input
            type="number"
            value={stat.dealsToday || 0}
            onChange={(e) =>
              setStat({ ...stat, dealsToday: Number(e.target.value) })
            }
          />
        </Row>

        <BtnRow>
          <button onClick={save}>Save</button>
        </BtnRow>
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
  max-width: 600px;
`;
const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;
const Label = styled.label`
  width: 160px;
  font-weight: 600;
`;
const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;
const BtnRow = styled.div`
  margin-top: 12px;
`;
