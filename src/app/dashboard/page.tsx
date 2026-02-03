"use client";

import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { MdAttachMoney } from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import { FaGifts } from "react-icons/fa";
import { IoArrowDownCircle } from "react-icons/io5";
import { IoArrowUpCircleSharp } from "react-icons/io5";

// ==================== 🌟 Main Component ====================
export default function DashboardHomePage() {
  const { user } = useSelector((state: RootState) => state.user);

  // const totalProfit = user.investments
  // .filter(i => i.active)
  // .reduce((sum, inv) => sum + inv.accumulatedProfit, 0);

  const totalInvested = user?.investments
    .filter((i) => i.active)
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <Wrapper>
      <User>
        <h2>Welcome, {user?.fullname}!</h2>
      </User>

      <AccountSummary>
        <h3>Account Summary</h3>

        <Grid>
          <Item>
            <div>
              <h4>Account Balance</h4>
              <p>
                $
                {user?.accountBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Icon>
              <MdAttachMoney />
            </Icon>
          </Item>

          <Item>
            <div>
              <h4>Total Profit</h4>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p>
                  $
                  {user?.totalProfit.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                {!!totalInvested && (
                  <Capital>+${totalInvested?.toLocaleString()}</Capital>
                )}
              </div>
            </div>
            <Icon>
              <FaCoins />
            </Icon>
          </Item>

          <Item>
            <div>
              <h4>Referral Bonus</h4>
              <p>
                $
                {user?.referralBonus.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Icon>
              <FaGifts />
            </Icon>
          </Item>

          <Item>
            <div>
              <h4>Total Deposit</h4>
              <p>
                $
                {user?.totalDeposit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Icon>
              <IoArrowDownCircle />
            </Icon>
          </Item>

          <Item>
            <div>
              <h4>Total Withdrawal</h4>
              <p>
                $
                {user?.totalWithdrawal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <Icon>
              <IoArrowUpCircleSharp />
            </Icon>
          </Item>
        </Grid>
      </AccountSummary>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  width: 95%;
  margin: 20px auto;
`;

const User = styled.div`
  h2 {
    color: white;
  }
`;

const AccountSummary = styled.div`
  background: #fff;
  color: #232733;
  margin-top: 8px;
  border-radius: 7px;
  padding: 20px;

  h3 {
    margin-bottom: 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
`;

const Item = styled.div`
  border-radius: 7px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eff2f7;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h4 {
    color: #8492a6;
  }

  p {
    font-size: 24px;
    /* font-weight: bold; */
    margin-top: 8px;
  }
`;

const Capital = styled.span`
  font-size: 14px;
  /* color: #ff6600; */
  color: green;
  font-weight: bold;
  margin-left: 10px;
`;

const Icon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background: linear-gradient(to top right, #ff6600, #ffcc66);
`;
