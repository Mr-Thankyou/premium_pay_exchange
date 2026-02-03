import styled from "styled-components";

// ==================== 🌻Main Component ====================
export default function About() {
  return (
    <div style={{ background: "#1f232e" }}>
      <AboutSection>
        <Column>
          <h2>Most innovative binary option platform</h2>
          <p>
            Premium Pay Exchange is a company formed by a team of PROFESSIONAL
            TRADERS with EXPERTISE in one of the biggest financial markets of
            today, the CRYPTOCURRENCY/BINARY. Our focus is to provide our
            affiliates with daily and constant profits in these markets
          </p>
        </Column>
        <Column>
          <h2>QUICK LINKS</h2>
          <a href="">HOME</a>
          <a href="">TERMS & CONDITIONS</a>
          <a href="">LOGIN</a>
          <a href="">REGISTER</a>
        </Column>
        <Column>
          <h2>RISK WARNING</h2>
          <p>
            Premium Pay Exchange is one of the leading platforms in the United
            States offering binary options, Forex and spreads. Regulated by the
            CFTC and based in New York. It is also regulated by the IFSC of
            Belize, as well as the Cyprus Securities and Exchange Commission.
          </p>
        </Column>
        <Column>
          <h2>CONTACT US</h2>
          <div>
            <span>ADDRESS</span>:{" "}
            <p>7401 Paseo Padre Pkwy, Fremont, CA 94555, USA</p>
          </div>
          <div>
            <span>Email</span>: <a href="">support@premiumpayexchange.com</a>
          </div>
        </Column>
      </AboutSection>
    </div>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const AboutSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 0 auto;
  max-width: 1000px;
  padding: 40px 20px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  h2 {
    color: white;
  }

  p {
    color: #aaa9a9;
    line-height: 1.6;
  }

  a {
    color: #ff7913;
    border-left: 2px solid gray;
    padding: 10px;
    border-radius: 6px;
    display: inline-block;
    word-break: break-all;
  }

  div p {
    color: #ff7913;
  }

  span {
    color: white;
    font-weight: bold;
  }
`;
