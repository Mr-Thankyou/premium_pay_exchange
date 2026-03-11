"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import styled from "styled-components";
import toast from "react-hot-toast";

const COLORS = {
  dark: "#232733",
  orange: "#ff9500",
  white: "#ffffff",
};

const PLANS = [
  {
    id: "beginner",
    name: "Beginner Plan",
    weekly: 5,
    min: 500,
    max: 4000,
    description:
      "Perfect for beginners who want to start small. Stable growth with a low entry barrier.",
  },
  {
    id: "standard",
    name: "Standard Plan",
    weekly: 15,
    min: 5000,
    max: 9000,
    description:
      "A balanced investment plan offering higher weekly returns for committed investors.",
  },
  {
    id: "business",
    name: "Business Plan",
    weekly: 35,
    min: 10000,
    max: Infinity,
    description:
      "Our premium plan for business-level investors. Maximum earnings with no deposit limit.",
  },
];

// ==================== 🌤️Main Component ====================
export default function InvestPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [planId, setPlanId] = useState("beginner");
  const [amount, setAmount] = useState("");

  const plan = useMemo(() => PLANS.find((p) => p.id === planId)!, [planId]);

  // Calculate projected weekly profit
  const weeklyProfit = amount ? (Number(amount) * plan.weekly) / 100 : 0;

  const validateAndSubmit = async () => {
    const amt = Number(amount);

    if (!amt || amt < plan.min) {
      return toast.error(`Minimum investment for this plan is $${plan.min}`);
    }

    if (amt > plan.max) {
      return toast.error(
        `Maximum investment for this plan is ${
          plan.max === Infinity ? "unlimited" : "$" + plan.max
        }`,
      );
    }

    const toastId = toast.loading("Processing your investment...");
    const res = await fetch("/api/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId, amount: amt }),
    });

    const j = await res.json();
    if (!res.ok) return toast.error(j.error || "Error");
    toast.success("Investment started successfully", { id: toastId });
    setAmount("");
  };

  return (
    <Wrapper>
      <Card>
        <Title>Start an Investment</Title>

        {/* PLAN SELECTOR */}
        <Section>
          <Label>Select Plan</Label>
          <Select value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.weekly}% weekly)
              </option>
            ))}
          </Select>
        </Section>

        {/* PLAN DETAILS */}
        <PlanDetails>
          <h3>{plan.name}</h3>
          <p>{plan.description}</p>

          <DetailRow>
            <span>Weekly Return:</span>
            <strong>{plan.weekly}%</strong>
          </DetailRow>

          <DetailRow>
            <span>Minimum Investment:</span>
            <strong>${plan.min.toLocaleString()}</strong>
          </DetailRow>

          <DetailRow>
            <span>Maximum Investment:</span>
            <strong>
              {plan.max === Infinity
                ? "Unlimited"
                : `$${plan.max.toLocaleString()}`}
            </strong>
          </DetailRow>
        </PlanDetails>

        {/* AMOUNT INPUT */}
        <Section>
          <Label>Amount to Invest (USD)</Label>
          <Input
            type="number"
            value={amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </Section>

        {/* PROJECTED PROFITS */}
        {amount && (
          <ProfitBox>
            <p>
              Estimated <strong>Weekly Profit:</strong>{" "}
              <span>${weeklyProfit.toFixed(2)}</span>
            </p>
          </ProfitBox>
        )}

        <Button onClick={validateAndSubmit}>Start Investment</Button>
      </Card>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
  background: ${COLORS.dark};
  /* min-height: 100vh; */
  height: 100%;
  align-items: flex-start;
`;

const Card = styled.div`
  background: ${COLORS.white};
  padding: 30px;
  border-radius: 15px;
  width: 500px;
  box-shadow: 0 4px 20px #00000020;
`;

const Title = styled.h2`
  color: ${COLORS.dark};
  margin-bottom: 25px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
  color: ${COLORS.dark};
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: ${COLORS.white};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
`;

const PlanDetails = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;

  h3 {
    margin: 0 0 10px 0;
    color: ${COLORS.orange};
  }

  p {
    margin-bottom: 15px;
    font-size: 14px;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 6px 0;

  span {
    color: #555;
  }
  strong {
    color: ${COLORS.dark};
  }
`;

const ProfitBox = styled.div`
  background: ${COLORS.orange};
  padding: 15px;
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
  font-size: 16px;

  span {
    font-weight: bold;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: ${COLORS.orange};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
`;
