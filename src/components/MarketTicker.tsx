"use client";

import styled from "styled-components";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

type MarketData = {
  name: string;
  price: number;
  changePercent: number;
  changeValue: number;
};

const data: MarketData[] = [
  { name: "S&P 500", price: 6625.2, changePercent: 0.19, changeValue: 12.8 },
  { name: "Nasdaq 100", price: 24517.9, changePercent: 0.2, changeValue: 48.3 },
  { name: "EUR/USD", price: 1.1581, changePercent: 0.01, changeValue: 0.0 },
  { name: "BTC/USD", price: 92331, changePercent: -0.62, changeValue: 580 },
  { name: "ETH/USD", price: 3103.7, changePercent: -0.58, changeValue: 18 },
];

export default function MarketTicker() {
  return (
    <TickerWrapper>
      {data.map((item, i) => {
        const isUp = item.changePercent >= 0;

        return (
          <Item key={i}>
            {/* NAME */}
            <Name>{item.name}</Name>

            {/* PRICE */}
            <Price>{item.price.toLocaleString()}</Price>

            {/* % + VALUE */}
            <Change isUp={isUp}>
              {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
              <strong>{Math.abs(item.changePercent)}%</strong>
              <span>{item.changeValue}</span>
            </Change>

            {/* Divider except last */}
            {i !== data.length - 1 && <Divider />}
          </Item>
        );
      })}
    </TickerWrapper>
  );
}

// =========== styled-components ===========

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  background: #232733;
  padding: 20px 150px;
  color: #fff;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const Name = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const Price = styled.div`
  font-size: 14px;
  margin-left: 5px;
`;

const Change = styled.div<{ isUp: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: bold;

  color: ${(p) => (p.isUp ? "#00b894" : "#e17055")};

  svg {
    stroke-width: 2;
  }

  span {
    font-size: 12px;
    opacity: 0.8;
  }
`;

const Divider = styled.div`
  height: 30px;
  width: 1px;
  background: #3a3d47;
  margin: 0 20px;
`;
