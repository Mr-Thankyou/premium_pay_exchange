"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

export default function AdminHome() {
  const [totalUsers, setTotalUsers] = useState(0);

  const toastIdRef = useRef("");
  async function fetchUsers() {
    toastIdRef.current = toast.loading("Loading...");
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setTotalUsers(data.length);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      toast.dismiss(toastIdRef.current);
    }
  }

  useEffect(() => {
    fetchUsers();
    return () => {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    };
  }, []);

  return (
    <Wrapper>
      <Card>
        <Title>Total Users</Title>
        <Number>{totalUsers}</Number>
      </Card>

      <Card>
        <Title>Total Deposits</Title>
        <Number>-</Number>
      </Card>

      <Card>
        <Title>Total Pending Withdrawals</Title>
        <Number>-</Number>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  margin: 0 0 10px;
  font-size: 14px;
`;

const Number = styled.h2`
  margin: 0;
  font-size: 28px;
  color: ${({ theme }) => theme.colors.sidebar};
`;
