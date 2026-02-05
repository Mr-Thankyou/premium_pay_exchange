"use client";

import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

// ==================== 🌻Main Component ====================
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loading = toast.loading("Signing in...");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, remember }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message, { id: loading });
      return;
    }

    toast.success("Login successful!", { id: loading });
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error("Enter your email first");

    const loading = toast.loading("Sending reset link...");

    const res = await fetch("/api/auth/reset-password-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message, { id: loading });
      return;
    }

    toast.success("Reset link sent to email", { id: loading });
  };

  return (
    <Wrapper>
      <Card onSubmit={handleLogin}>
        <LogoBox>
          <img src="images/logo.png" alt="logo" width="60" />
          <Title>User Login</Title>
        </LogoBox>

        <Label>Your Email *</Label>
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Label>Password *</Label>
        <PasswordWrapper>
          <Input
            $noMargin
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <EyeIcon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
        </PasswordWrapper>
        <Row>
          <RememberBox>
            <Checkbox
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <span>Remember me</span>
          </RememberBox>

          <ForgotButton type="button" onClick={handleForgotPassword}>
            Forgot password?
          </ForgotButton>
        </Row>
        <Button type="submit">Sign in</Button>
        <BottomText>
          Don’t have an account?
          <LinkSpan onClick={() => router.push("/register")}> Sign Up</LinkSpan>
        </BottomText>
        <Footer>© 2026 Premium Pay Exchange. All Rights Reserved.</Footer>
      </Card>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  min-height: 100dvh;
  background: #000;
  display: flex;
  justify-content: center;
  padding: 40px 10px;
`;

const Card = styled.form`
  width: 100%;
  max-width: 550px;
  background: #111;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #333;
  color: white;
`;

const LogoBox = styled.div`
  text-align: center;
  margin-bottom: 20px;

  img {
    margin-bottom: 10px;
  }
`;

const Title = styled.h2`
  color: orange;
  font-size: 26px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: #ccc;
`;

const Input = styled.input<{ $noMargin?: boolean }>`
  width: 100%;
  padding: 12px;
  background: #000;
  border: 1px solid #444;
  color: white;
  border-radius: 6px;
  margin-bottom: ${(props) => (props.$noMargin ? "0" : "16px")};
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #666;

  svg {
    display: flex;
  }

  &:hover {
    color: #7c7c7c;
  }
`;

const Checkbox = styled.input`
  margin-right: 5px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const RememberBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ccc;
`;

const ForgotButton = styled.button`
  background: none;
  border: none;
  color: orange;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;

  &:hover {
    color: #ff9c2b;
  }
`;

const Button = styled.button`
  width: 100%;
  background: orange;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 15px;
  &:hover {
    background: #ff8f1f;
  }
`;

const BottomText = styled.p`
  text-align: center;
  margin-top: 15px;
  color: #aaa;
`;

const LinkSpan = styled.span`
  color: orange;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #ff9c2b;
  }
`;

const Footer = styled.footer`
  margin-top: 25px;
  text-align: center;
  font-size: 12px;
  color: #555;
`;
