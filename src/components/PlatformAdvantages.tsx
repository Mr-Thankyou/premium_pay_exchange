"use client";

import Image from "next/image";
import styled from "styled-components";
import TradingViewTicker from "./TradingViewTicker";

interface Advantage {
  photo: string;
  title: string;
  description: string;
}
const advantages: Advantage[] = [
  {
    photo: "/images/payment.png",
    title: "Payment Options",
    description: "We provide various withdrawal methods.",
  },
  {
    photo: "/images/security.png",
    title: "Strong Security",
    description:
      "With advanced security systems, we keep your account always protected.",
  },
  {
    photo: "/images/world.png",
    title: "World Coverage",
    description: "Our platform is used by bitcoin investors worldwide.",
  },
  {
    photo: "/images/team.png",
    title: "Experienced Team",
    description:
      "Our experienced team helps us build the best product and deliver first class service to our clients.",
  },
  {
    photo: "/images/report.png",
    title: "Advanced Reporting",
    description:
      "We provide reports for all investments done using our platform.",
  },
  {
    photo: "/images/platform.png",
    title: "Cross-Platform Trading",
    description:
      "Our platform can be accessed from various devices such as Phones, Tablets & Pc.",
  },
  {
    photo: "/images/support.png",
    title: "Expert Suport",
    description:
      "Our 24/7 support allows us to keep in touch with customers in all time zones and regions.",
  },
  {
    photo: "/images/exchange.png",
    title: "Instant Exchange",
    description:
      "Change your world today and make yourself a great tomorrow, invest with the little money you have and make a great profit at the end.",
  },
];

// ==================== 🌾Main Component ====================
export default function PlatformAdvantages() {
  return (
    <AdvantagesSection>
      <AdvantagesWrapper>
        {advantages.map((adv, i) => {
          return (
            <Item key={i}>
              <Image src={adv.photo} alt={adv.title} width={80} height={80} />
              <div>
                <h2>{adv.title}</h2>
                <p>{adv.description}</p>
              </div>
            </Item>
          );
        })}
      </AdvantagesWrapper>
      <TradingViewTicker />
    </AdvantagesSection>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const AdvantagesSection = styled.section`
  padding: 100px 10px;
  background: #1f232e;
`;

const AdvantagesWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  margin-bottom: 40px;
  display: grid;
  gap: 50px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  h2 {
    color: #8c92a0;
    margin-bottom: 10px;
  }

  p {
    color: white;
  }
`;
