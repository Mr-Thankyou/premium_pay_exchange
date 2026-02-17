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

  const GAS_PERCENT = 0.01;
  const MIN_WITHDRAW = 10000;
  const MAX_WITHDRAW = 500000;

  const amt = Number(amount || 0);

  const isPPEAddress = (addr: string) => addr.startsWith("ppe_");
  const isInternalPPETransfer =
    coin === "PPE" && isPPEAddress(address) && address !== user?.walletAddress;

  const gasFee =
    isInternalPPETransfer || amt < MIN_WITHDRAW
      ? 0
      : Math.ceil(amt * GAS_PERCENT);

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

    // 🚫 Prevent withdrawing to own PPE address
    if (coin === "PPE" && address === user?.walletAddress) {
      return toast.error(
        "You cannot withdraw to your own PPE address. Please enter a different wallet address.",
        { duration: 6000 },
      );
    }

    try {
      // ✅ Internal PPE transfer (no gas)
      if (isInternalPPETransfer) {
        // toast(
        //   "Internal PPE transfer detected. No gas fee is required for transfers within Premium Pay Exchange.",
        //   {
        //     id: toastId,
        //     icon: "ℹ️",
        //     duration: 4000,
        //   },
        // );

        const confirm = window.confirm(
          `Internal PPE transfer detected.\n` +
            `No gas fee is required for transfers within Premium Pay Exchange.\n\n` +
            `Click Ok to continue`,
        );

        if (!confirm) return;
      } else {
        const confirm = window.confirm(
          `Withdrawal requires a gas fee.\n\n` +
            `Withdrawal Amount: $${amt.toLocaleString()}\n` +
            `Gas Fee (1%): $${gasFee.toLocaleString()}\n\n` +
            `Please deposit the gas fee under "Gas Deposit".\n` +
            `Withdrawal will be approved once gas is confirmed.\n\n` +
            `Proceed?`,
        );

        if (!confirm) return;
      }

      // 🟡 Create a SINGLE toast (info/loading)
      const toastId = toast.loading("Processing withdrawal...");

      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coin, amount: amt, address }),
      });

      const j = await res.json();
      if (!res.ok) return toast.error(j.error || "Error");

      // ✅ Final success update
      toast.success("Withdrawal request submitted (pending approval).", {
        id: toastId,
        duration: 5000,
      });
      setAmount("");
      setAddress("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
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
          <small>Withdrawals are processed after approval.</small>
        </LimitBox>

        {/* COIN SELECT */}
        <Section>
          <Label>Select Coin</Label>
          <Select value={coin} onChange={(e) => setCoin(e.target.value)}>
            <option>USDT-TRC20</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>PPE</option>
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
          {amt >= MIN_WITHDRAW && address && (
            <GasInfo>
              <span>
                {isInternalPPETransfer
                  ? "Gas Fee (Not Required)"
                  : "Gas Fee (1%)"}
              </span>
              <b>${gasFee.toLocaleString()}</b>
            </GasInfo>
          )}
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

const GasInfo = styled.div`
  margin-top: 6px;
  background: #f6f7f9;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  color: #232733;
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
