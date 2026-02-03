"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import styled from "styled-components";
import {
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaExchangeAlt,
} from "react-icons/fa";

interface Transaction {
  type:
    | "deposit"
    | "withdrawal"
    | "transfer"
    | "investment"
    | "profit"
    | "referral_bonus";
  direction?: "in" | "out";
  title: string;
  description: string;
  amount: number;
  coin: string;
  status: "pending" | "approved" | "rejected";
  reference?: string;
  date: Date;
}

// ==================== 🌤️Main Component ====================
export default function TransactionHistoryPage() {
  const { user } = useSelector((state: RootState) => state.user);

  const transactions = user?.transactions || [];

  function isNegativeTransaction(tx: Transaction) {
    if (tx.type === "withdrawal") return true;
    if (tx.type === "investment") return true;
    if (tx.type === "transfer" && tx.direction === "out") return true;
    return false;
  }

  return (
    <Wrapper>
      <Header>
        <h2>Transaction History</h2>
        <p>All your deposits, withdrawals, transfers & investments</p>
      </Header>

      {transactions.length === 0 ? (
        <EmptyState>No transactions yet</EmptyState>
      ) : (
        <List>
          {transactions
            .slice()
            .reverse()
            .map((tx: any) => (
              <TransactionCard key={tx._id}>
                <Left>
                  <Icon type={tx.type}>
                    {tx.type === "deposit" && <FaArrowDown />}
                    {tx.type === "withdrawal" && <FaArrowUp />}
                    {tx.type === "investment" && <FaChartLine />}
                    {tx.type === "transfer" && <FaExchangeAlt />}
                  </Icon>

                  <Details>
                    <Title>{tx.title}</Title>
                    <Description>{tx.description}</Description>
                    <DateText>{new Date(tx.date).toLocaleString()}</DateText>
                  </Details>
                </Left>

                <Right>
                  <Amount negative={isNegativeTransaction(tx)}>
                    {isNegativeTransaction(tx) ? "-" : "+"}${tx.amount}
                  </Amount>
                  <Status status={tx.status}>{tx.status}</Status>
                </Right>
              </TransactionCard>
            ))}
        </List>
      )}
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  padding: 30px;
  color: #fff;
`;

const Header = styled.div`
  margin-bottom: 25px;

  h2 {
    color: #f2cc8f;
  }

  p {
    color: #aaa;
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  background: #1f212b;
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  color: #aaa;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TransactionCard = styled.div`
  background: #1f212b;
  padding: 18px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Left = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Icon = styled.div<{ type: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ type }) =>
    type === "deposit"
      ? "#1d8f4e"
      : type === "withdrawal"
        ? "#8f1d1d"
        : type === "investment"
          ? "#1d4e8f"
          : "#6f42c1"}; // transfer
`;

const Details = styled.div``;

const Title = styled.div`
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 14px;
  color: #ccc;
`;

const DateText = styled.div`
  font-size: 12px;
  color: #888;
`;

const Right = styled.div`
  text-align: right;

  @media (max-width: 600px) {
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

const Amount = styled.div<{ negative: boolean }>`
  font-weight: bold;
  font-size: 16px;
  color: ${({ negative }) => (negative ? "#ff6b6b" : "#4caf50")};
`;

const Status = styled.div<{ status: string }>`
  margin-top: 6px;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
  text-transform: capitalize;

  background: ${({ status }) =>
    status === "approved"
      ? "rgba(40,167,69,0.15)"
      : status === "rejected"
        ? "rgba(220,53,69,0.15)"
        : "rgba(255,193,7,0.15)"};

  color: ${({ status }) =>
    status === "approved"
      ? "#28a745"
      : status === "rejected"
        ? "#dc3545"
        : "#ffc107"};
`;
