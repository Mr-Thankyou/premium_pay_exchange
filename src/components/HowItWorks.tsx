"use client";

import styled from "styled-components";
import {
  FaMoneyBillWave,
  FaArrowTrendUp,
  FaArrowUpFromBracket,
} from "react-icons/fa6";

// ==================== ☀️Main Component ====================
export default function HowItWorks() {
  return (
    <Wrapper>
      <Title>HOW PREMIUM Pay Exchange WORKS?</Title>

      <Grid>
        <Item className="first">
          <Icon>
            <FaMoneyBillWave size={70} />
          </Icon>
          <ItemTitle>DEPOSIT</ItemTitle>
          <ItemText>
            Fund your account after registration and verification via your
            preferred means of deposit.
          </ItemText>
        </Item>

        <Item className="second">
          <Icon>
            <FaArrowTrendUp size={70} />
          </Icon>
          <ItemTitle>GET PROFIT</ItemTitle>
          <ItemText>
            Let our professional traders using our AI trading system maximize
            your profit earnings.
          </ItemText>
        </Item>

        <Item className="last">
          <Icon>
            <FaArrowUpFromBracket size={70} />
          </Icon>
          <ItemTitle>WITHDRAW</ItemTitle>
          <ItemText>
            Request withdrawals instantly, free and available via multiple
            withdrawal options.
          </ItemText>
        </Item>
      </Grid>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.section`
  background: #1f232d;
  padding: 80px 20px;
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  font-size: 34px;
  margin-bottom: 50px;
  text-transform: uppercase;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  grid-template-columns: repeat(4, 1fr);

  /* Center last item underneath on desktop */
  .first {
    grid-column: 1/ 3;
  }

  .second {
    grid-column: 3/ -1;
  }

  .last {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .first,
    .second,
    .last {
      grid-column: auto;
    }
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* width: 500px; */
  margin: 0 auto;
`;

const Icon = styled.div`
  color: #f58634;
  margin-bottom: 20px;
`;

const ItemTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 10px;
`;

const ItemText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  max-width: 400px;
`;
