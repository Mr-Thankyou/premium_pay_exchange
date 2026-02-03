"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import styled from "styled-components";
import toast from "react-hot-toast";

export default function DepositPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [coin, setCoin] = useState("USDT-TRC20");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      const res = await fetch(`/api/coin-addresses?coin=${coin}`);
      const data = await res.json();
      if (res.ok) setAddress(data.address);
      else setAddress("Address not available");
    };
    fetchAddress();
  }, [coin]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(String(reader.result)); //callback for the next line
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = async () => {
    if (!amount) return toast.error("Enter amount");
    setLoading(true);

    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?._id,
        coin,
        amount,
        screenshotBase64: screenshot,
        depositAddress: address,
      }),
    });

    const j = await res.json();
    setLoading(false);

    if (!res.ok) return toast.error(j.error || "Error");

    toast.success("Deposit submitted. Waiting approval.");
    setAmount("");
    setScreenshot("");
  };

  return (
    <Wrapper>
      <Container>
        <Title>Make a Deposit</Title>

        {/* Select Coin */}
        <Field>
          <label>Coin</label>
          <select value={coin} onChange={(e) => setCoin(e.target.value)}>
            <option value="BTC">BTC</option>
            <option value="USDT-TRC20">USDT (TRC20)</option>
            <option value="ETH">ETH</option>
          </select>
        </Field>

        {/* Deposit Address */}
        <Field>
          <label>Deposit Address</label>
          <AddressRow>
            <input value={address} readOnly />
            <CopyButton onClick={copyToClipboard}>
              {copied ? "Copied!" : "Copy"}
            </CopyButton>
          </AddressRow>
        </Field>

        {/* Amount */}
        <Field>
          <label>Amount (USD)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>

        {/* Screenshot Upload */}
        <Field>
          <label>Upload Screenshot (proof)</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {screenshot && <Preview src={screenshot} />}
        </Field>

        {/* Submit */}
        <SubmitButton onClick={submit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Deposit"}
        </SubmitButton>
      </Container>
    </Wrapper>
  );
}

/* 🌟 Styled Components */

const Wrapper = styled.div`
  background: #232733;
  height: 100%;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

const Container = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: #232733;
`;

const Field = styled.div`
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;

  label {
    font-size: 14px;
    margin-bottom: 6px;
    color: #232733;
  }

  select,
  input {
    padding: 10px;
    border: 1px solid #dadada;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
  }
`;

const AddressRow = styled.div`
  display: flex;
  gap: 10px;

  input {
    flex: 1;
  }
`;

const CopyButton = styled.button`
  background: #ff8c00;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  min-width: 70px;
  /* width: 70px; */
  transition: 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const Preview = styled.img`
  width: 230px;
  margin-top: 10px;
  border-radius: 8px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #ff8c00;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  margin-top: 10px;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    opacity: 0.9;
  }
`;
