"use client";

import GoogleTranslate from "@/components/GoogleTranslate";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

// ==================== 💎Main Component ====================
export default function VerifyPage() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Generate 6-digit code
    const generateCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      localStorage.setItem("verifyCode", code);
    };
    generateCode();
  }, []);

  const handleVerify = () => {
    if (inputCode === generatedCode) {
      router.push("/register");
    } else {
      toast.error("Invalid code");
    }
  };

  return (
    <div>
      <PageWrapper>
        <GoogleTranslate />
        <Card>
          <Title>
            Please confirm you are not a Robot by verifying the code below
          </Title>

          <CodeBox>{generatedCode}</CodeBox>

          <Label>Enter code*</Label>
          <Input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />

          <Button onClick={handleVerify}>Verify Code</Button>
        </Card>
      </PageWrapper>
    </div>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Container = styled.div``;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: black;
`;

const Card = styled.div`
  background: #111;
  padding: 25px;
  width: 100%;
  max-width: 420px;
  border-radius: 10px;
  border: 1px solid #333;
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
`;

const CodeBox = styled.div`
  background: #f7931a;
  color: white;
  text-align: center;
  padding: 12px 0;
  border-radius: 8px;
  font-size: 24px;
  margin-bottom: 25px;
`;

const Label = styled.label`
  color: #ccc;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: black;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #f7931a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #ffa733;
  }
`;
