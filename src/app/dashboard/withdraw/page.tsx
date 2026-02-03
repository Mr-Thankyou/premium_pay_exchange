"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import styled from "styled-components";
import toast from "react-hot-toast";

const COLORS = {
  dark: "#232733",
  orange: "#ff9500",
  white: "#ffffff",
};

// ==================== 🌻Main Component ====================
export default function WithdrawPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [coin, setCoin] = useState("USDT-TRC20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const MIN_WITHDRAW = 10000;
  const MAX_WITHDRAW = 500000;

  const submit = async () => {
    const amt = Number(amount);

    if (!amt || amt < MIN_WITHDRAW) {
      return toast.error(
        `Minimum withdrawal is $${MIN_WITHDRAW.toLocaleString()}`,
      );
    }

    if (amt > MAX_WITHDRAW) {
      return toast.error(
        `Maximum withdrawal is $${MAX_WITHDRAW.toLocaleString()}`,
      );
    }

    if (!address) {
      return toast.error("Please enter a destination wallet address.");
    }

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coin, amount: amt, address }),
    });

    const j = await res.json();
    if (!res.ok) return toast.error(j.error || "Error");

    toast.success("Withdrawal request submitted (pending admin approval).", {
      duration: 6000,
    });
    setAmount("");
    setAddress("");
  };

  return (
    <Wrapper>
      <Card>
        <Title>Request Withdrawal</Title>

        {/* LIMIT NOTICE */}
        <LimitBox>
          <p>
            ⚠️ <strong>Withdrawal Range:</strong>
          </p>
          <span>
            Minimum: <b>${MIN_WITHDRAW.toLocaleString()}</b>
          </span>
          <span>
            Maximum: <b>${MAX_WITHDRAW.toLocaleString()}</b>
          </span>
          <small>Withdrawals are processed after admin approval.</small>
        </LimitBox>

        {/* COIN SELECT */}
        <Section>
          <Label>Select Coin</Label>
          <Select value={coin} onChange={(e) => setCoin(e.target.value)}>
            <option>USDT-TRC20</option>
            <option>BTC</option>
            <option>ETH</option>
          </Select>
        </Section>

        {/* AMOUNT */}
        <Section>
          <Label>Amount (USD)</Label>
          <Input
            value={amount}
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />
        </Section>

        {/* ADDRESS */}
        <Section>
          <Label>Wallet Address</Label>
          <Input
            value={address}
            placeholder="Enter destination address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </Section>

        {/* SUBMIT */}
        <Button onClick={submit}>Request Withdrawal</Button>
      </Card>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  padding: 40px;
  /* min-height: 100vh; */
  height: 100%;
  background: ${COLORS.dark};
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Card = styled.div`
  background: ${COLORS.white};
  padding: 30px;
  width: 500px;
  border-radius: 15px;
  box-shadow: 0 4px 25px #00000025;
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

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  background: ${COLORS.orange};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
`;

const LimitBox = styled.div`
  background: #f9f2e4;
  padding: 15px;
  border-left: 6px solid ${COLORS.orange};
  border-radius: 10px;
  margin-bottom: 25px;

  p {
    margin: 0;
    font-size: 16px;
    color: ${COLORS.dark};
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 6px;
    color: ${COLORS.dark};
  }

  small {
    display: block;
    margin-top: 10px;
    color: #444;
    font-size: 13px;
  }
`;
