"use client";
import styled from "styled-components";
import { useEffect, useState } from "react";

type Stats = {
  tradersOnline: number;
  totalRegistered: number;
  dealsToday: number;
};

// ==================== 🎇Main Component ====================
export default function StatsBoxes() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/stats");
      const json = await res.json();
      setStats(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // optional: poll every 30s for updated numbers
    // const t = setInterval(load, 30000);
    // return () => clearInterval(t);
  }, []);

  if (loading) return <Placeholder>Loading stats…</Placeholder>;
  if (!stats) return <Placeholder>No stats found</Placeholder>;

  return (
    <Flex>
      <Card>
        <Big>{stats.tradersOnline.toLocaleString()}+</Big>
        <Label>Traders Online</Label>
      </Card>

      <Card>
        <Big>{stats.totalRegistered.toLocaleString()}</Big>
        <Label>Total Registered</Label>
      </Card>

      <Card>
        <Big>{stats.dealsToday.toLocaleString()}</Big>
        <Label>Deals Today</Label>
      </Card>
    </Flex>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Flex = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const Card = styled.div`
  border-radius: 8px;
  border: 1px solid #f7a54a;
  padding: 18px 22px;
  width: 140px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
`;

const Big = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
`;

const Label = styled.div`
  font-size: 13px;
  color: #cfcfcf;
  white-space: nowrap;
`;

const Placeholder = styled.div`
  color: #999;
  text-align: center;
  padding: 20px;
`;
