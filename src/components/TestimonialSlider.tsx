"use client";

import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

interface Testimonial {
  photo: string;
  name: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    photo: "/images/olivia.jpg",
    name: "Olivia Charmaine Yates",
    text: "This website is so great. Now I have my own business. I'm really happy. I will keep trading under your website",
  },
  {
    photo: "/images/lulian.jpg",
    name: "Lulian Rusu",
    text: "All you just need to do is invest and let them do their work after making withdrawal you pay their for a job well done. They has never made loss on part so please y'all can reach out to this platform",
  },
  {
    photo: "/images/tha.jpg",
    name: "ThÃ¸rstÃ©n Stefan",
    text: "I'm still shocked. I never believed I can ever make profit from trading after all the lost but never gave up",
  },
  {
    photo: "/images/christin.jpg",
    name: "Christin Shuster",
    text: "Wow, what a surprise, did I just got my withdrawal? Is this real or a joke, I can't believe this. that I just gotten my withdrawal thank you, thank you, thank you very much is amazing after many times of trade without nothing to show I was told that this is feed with scammers but now I know that some are real",
  },
  {
    photo: "/images/paula.jpg",
    name: "Paula Wilson",
    text: "You all are the best, and am looking forward to trade with this platform all again. Feel free to tell others of your investment and withdrawals don't be the only one benefiting from my platform. Thank you all for the feedback",
  },
  {
    photo: "/images/patricia.jpg",
    name: "Patricia Feghhi-Levine",
    text: "Just a quick thanks for your website!! You are a worthwhile mentor. I think there are thousands who truly appreciate what you are doing!",
  },
  {
    photo: "/images/boris.jpg",
    name: "Boris Johnson",
    text: "I am a living witness to this company, for some years now I have been receiving my investment and my profit, this is one of the best company to invest on cryptocurrencies",
  },
  {
    photo: "/images/jack.jpg",
    name: "Jack Ma",
    text: "Holding a Bitcoin today is like owning a Facebook, Amazon, or Apple stock positions in the early 2000's. Blockchain technology has a lot more on offer if you could just adopt it. I will always advise people to invest in this company.",
  },
  {
    photo: "/images/david.png",
    name: "David O. Sacks",
    text: "Bitcoin is up 60% on the year while the almighty GOLD is down by 11%, and yet still hate investing in BTC for the long run? Math doesn't lie, the media does",
  },
  {
    photo: "/images/jim.jpg",
    name: "Jim Cramer",
    text: "Anything the government hates or ban, invest in it and spend time to understand it better. That could be your missing piece. Bitcoin is a perfect example of such! I am always grateful to this amazing company for being the best.",
  },
  {
    photo: "/images/elon.png",
    name: "Elon Musk",
    text: "In the next 5-10 years, digital assets (predominantly Bitcoin and few Alts) will prove to be a strong alternative currency of the world, if not entirely dethrone fiat currency. this is one of the Forex trading company.",
  },
  {
    photo: "/images/dayan.jpg",
    name: "Dayan Du Dosson",
    text: "Great platform to invest your money. I advice you use this",
  },
];

// ==================== 🍀Main Component ====================
const TestimonialsSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    appendDots: (dots: React.ReactNode) => (
      <DotsContainer>{dots}</DotsContainer>
    ),
  };

  return (
    <div style={{ background: "#1f232e" }}>
      <SliderWrapper>
        <h1>WHAT INVESTORS SAY</h1>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <Slide key={index}>
              <Photo src={t.photo} alt={t.name} />
              <Text>{t.text}</Text>
              <Name>{t.name}</Name>
              <Rating>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color="#FFD700" />
                ))}
              </Rating>
            </Slide>
          ))}
        </Slider>
      </SliderWrapper>
    </div>
  );
};

export default TestimonialsSlider;

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const SliderWrapper = styled.div`
  color: white;
  width: 87%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 750px) {
  }

  .slick-prev,
  .slick-next {
    z-index: 1;
    width: 40px;
    height: 40px;
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 40px;
    color: #817f7f;
  }
`;

const Slide = styled.div`
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 15px;
  height: 420px;

  @media (max-width: 600px) {
    padding: 35px 15px;
  }
`;

const Photo = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const Text = styled.p`
  font-size: 1.1rem;
  max-width: 650px;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Rating = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`;

const DotsContainer = styled.ul`
  bottom: 0;
  margin: 20px 0;
  li {
    margin: 0 5px;
    button {
      &:before {
        font-size: 12px;
        color: #888;
      }
    }
    &.slick-active button:before {
      color: #b7b5b5;
    }
  }
`;
