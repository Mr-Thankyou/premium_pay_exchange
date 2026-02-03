"use client";
import logo from "@/../public/images/logo.png";
import heroImage from "@/../public/images/desktop.png";
import Image from "next/image";
import styled from "styled-components";
import Ticker from "./Ticker";
import ParticleBackground from "./ParticlesBackground";
import Footer from "./Footer";
import TestimonialsSlider from "./TestimonialSlider";
import About from "./About";
import PlatformAdvantages from "./PlatformAdvantages";
import Awards from "./Awards";
import HowItWorks from "./HowItWorks";
import StatsBoxes from "./StatsBoxes";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { clearUser } from "@/lib/store/userSlice";

// ==================== 🌟 Main Component ====================
export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { cache: "no-store" }); // clears cookie
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <LandingPageWrapper>
      <ParticleBackground id="particles_background" />

      <LandingPage>
        <Nav>
          <NavItems>
            <Logo
              src={logo}
              alt="PPE Logo"
              width={100}
              //   height={100}
            />
            <Auth>
              {user ? (
                <AuthButton
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Account
                </AuthButton>
              ) : (
                <AuthButton
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  LOGIN
                </AuthButton>
              )}

              {user ? (
                <AuthButton onClick={handleLogout}>LOGOUT</AuthButton>
              ) : (
                <AuthButton
                  onClick={() => {
                    router.push("/verify");
                  }}
                >
                  SIGN UP
                </AuthButton>
              )}
            </Auth>
          </NavItems>
          <Ticker />
        </Nav>
        <HeroSection>
          <Header>
            <h1>
              Premium Pay Exchange is the easiest way to access smarter
              investments and earn real returns.
            </h1>
            <StatsBoxes />
          </Header>
          <ImageWrapper>
            <Image
              src={heroImage}
              alt="Hero Image"
              style={{
                objectFit: "contain",
                width: "100%",
              }}
            />
          </ImageWrapper>
        </HeroSection>
        <HowItWorks />
        <Awards />
        <PlatformAdvantages />
        <TestimonialsSlider />
        <About />
        <Footer />
      </LandingPage>
    </LandingPageWrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const LandingPageWrapper = styled.div``;

const LandingPage = styled.div`
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const Nav = styled.nav`
  background: #232733;
  padding: 30px 0;

  @media (max-width: 600px) {
    padding: 20px 0;
  }
`;

const NavItems = styled.div`
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 150px;
  margin-bottom: 30px;

  @media (max-width: 850px) {
    padding: 0 30px;
  }

  @media (max-width: 600px) {
    padding: 0 15px;
  }
`;

const Logo = styled(Image)``;

const Auth = styled.div``;

const AuthButton = styled.button`
  color: white;
  background: #f58634;
  padding: 10px;
  border-radius: 7px;
  font-weight: bold;
  border: none;
  margin-left: 5px;
  cursor: pointer;
`;

const HeroSection = styled.div`
  display: flex;
  gap: 50px;
  position: relative;
  color: white;
  width: 80%;
  margin: 0 auto;
  margin-top: 60px;

  @media (max-width: 1100px) {
    width: 90%;
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }

  @media (max-width: 650px) {
    gap: 70px;
  }

  h1 {
    text-align: right;
    font-size: 50px;
    /* line-height: 1.5; */
    letter-spacing: 2px;

    @media (max-width: 650px) {
      font-size: 46px;
    }
  }
`;

const Header = styled.div`
  width: calc(40% - 40px);

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const ImageWrapper = styled.div`
  width: 60%;

  @media (max-width: 900px) {
    width: 100%;
  }

  @media (max-width: 700px) {
    margin-bottom: 40px;
    img {
      height: auto;
    }
  }
`;
