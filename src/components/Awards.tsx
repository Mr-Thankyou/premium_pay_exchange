"use client";

import Image from "next/image";
import styled from "styled-components";

interface Award {
  photo: string;
  title: string;
  description: string;
}
const awards: Award[] = [
  {
    photo: "/images/award_13.png",
    title: "Century International Quality Gold ERA Award",
    description:
      "The prestigious award was given to Bridge Way Markets in recognition of our outstanding commitment to Quality and Excellence, particularly in the realm of Customer Satisfaction.",
  },
  {
    photo: "/images/award_10.png",
    title: "Most innovative binary option platform",
    description:
      "As Steve Jobs once said,innovation distinguishes between leaders and followers. Our innovative approach makes our product shine—and the evidence is in this beautiful accolade.",
  },
  {
    photo: "/images/award_5.png",
    title: "Most Reliable Binary Options Broker",
    description:
      "Our first priority is the security of our client's funds. This was recognized by the experts at MasterForex-V, who awarded Bridge Way Markets the title of Most Trusted Binary Options Broker.",
  },
  {
    photo: "/images/award_14.png",
    title: "The intelligent trading app for binary options",
    description:
      "The Mobile Star Awards is the largest annual mobile innovations and software awards program in the world. In 2016, the organization honored the Bridge Way Markets trading app as the best in its category, praising its efficiency and impeccable design.",
  },
  {
    photo: "/images/award_6.png",
    title: "World's Leading Binary Options Broker",
    description:
      "Global Brands Magazine, Britain’s reputable brand observer, awarded Bridge Way Markets along with a number of outstanding European brands — an achievement worth working for.",
  },
  {
    photo: "/images/award_8.png",
    title: "Fastest growing binary option brand",
    description:
      "Our platform can be accessed from various devices such as Phones, Tablets & Pc.",
  },
];

// ==================== 🌠Main Component ====================
export default function Awards() {
  return (
    <AwardsSection>
      <h1>OUR AWARD PLATFORM</h1>
      <AwardsWrapper>
        {awards.map((adv, i) => {
          return (
            <Item key={i}>
              <Image src={adv.photo} alt={adv.title} width={80} height={150} />
              <div>
                <h2>{adv.title}</h2>
                <p>{adv.description}</p>
              </div>
            </Item>
          );
        })}
      </AwardsWrapper>
    </AwardsSection>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const AwardsSection = styled.section`
  padding: 100px 50px;
  background: #1f232e;

  h1 {
    color: white;
    text-align: center;
    margin-bottom: 45px;
  }
`;

const AwardsWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  display: grid;
  gap: 50px;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
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
