"use client";

import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import styled from "styled-components";

// ==================== 🌿 Main Component ====================
export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <Brand>
          <h2>Premium Pay Exchange</h2>
          <p>Your trusted partner in crypto & forex trading.</p>
        </Brand>

        <Column>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#">Markets</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Trading Tools</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </Column>

        <Column>
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Risk Disclaimer</a>
            </li>
          </ul>
        </Column>

        <Column>
          <h4>Follow Us</h4>
          <SocialIcons>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter color="#1DA1F2" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook color="#1877F2" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram color="#C13584" />
            </a>
          </SocialIcons>
        </Column>
      </FooterContainer>

      <FooterBottom>
        © 2025 Premium Pay Exchange. All rights reserved.
      </FooterBottom>
    </FooterWrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const FooterWrapper = styled.footer`
  background: #0d0f18;
  color: #ffffff;
  padding: 40px 20px;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 30px;
`;

const Brand = styled.div`
  h2 {
    margin-bottom: 10px;
    color: #4ea7ff;
  }
  p {
    color: #d0d5dd;
    font-size: 14px;
  }
`;

const Column = styled.div`
  h4 {
    margin-bottom: 12px;
    font-size: 16px;
    color: #cbd5e1;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 6px 0;
    }
  }

  a {
    text-decoration: none;
    color: #e2e8f0;
    transition: 0.3s;

    &:hover {
      color: #4ea7ff;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;

  a {
    font-size: 20px;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 40px;
  border-top: 1px solid #1f2537;
  padding-top: 15px;
  font-size: 14px;
  color: #94a3b8;
`;
