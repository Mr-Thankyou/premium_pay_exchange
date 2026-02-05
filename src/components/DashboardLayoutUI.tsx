"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaHandsHoldingCircle } from "react-icons/fa6";
import { FaRegListAlt } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import Image from "next/image";
import logo from "@/../public/images/logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { clearUser } from "@/lib/store/userSlice";
import { orbitron } from "@/app/fonts";

const links = [
  { href: "/dashboard", label: "Home", icon: <FaHome /> },
  { href: "/dashboard/deposit", label: "Deposit", icon: <FaDownload /> },
  {
    href: "/dashboard/withdraw",
    label: "Withdraw",
    icon: <FaArrowAltCircleUp />,
  },
  {
    href: "/dashboard/invest-plans",
    label: "Investment Plans",
    icon: <FaHandHoldingUsd />,
  },
  {
    href: "/dashboard/my-plans",
    label: "My Plans",
    icon: <FaHandsHoldingCircle />,
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: <FaRegListAlt />,
  },
];

// ==================== 🌤️Main Component ====================
export default function DashboardLayoutUI({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.user);

  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = async () => {
    await fetch("/api/auth/logout", { cache: "no-store" }); // clears cookie
    dispatch(clearUser());
    router.push("/login");
  };

  useEffect(() => {
    if (user === null) {
      logout();
      // router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    const close = (e: any) => {
      if (!e.target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  //sidebar mobile scroll lock - sidebar open, body cannot scroll
  useEffect(() => {
    if (!collapsed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [collapsed]);

  return (
    <Wrapper>
      <Container>
        <Sidebar $collapsed={collapsed}>
          <Link href="/">
            <Image src={logo} width={90} alt="logo" />
          </Link>
          <SideProfile>
            {/* <FaUserCircle size={90} color="#fff" /> */}
            {user?.profileImage ? (
              <ProfileImage src={user.profileImage} alt="Profile Image" />
            ) : (
              <ProfileIcon />
            )}
            <User>{user?.fullname || "Loading...."} </User>
            <p className="online">online</p>
            <BuyBTCBox>
              <p
                style={{
                  marginBottom: "10px",
                  color: "darkgreen",
                  fontWeight: "bold",
                }}
              >
                <FaCoins /> $
                {(user?.accountBalance ?? 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {(user?.gasBalance ?? 0) > 0 && (
                  <GasBalance>
                    GAS: $
                    {(user?.gasBalance ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </GasBalance>
                )}
              </p>
              <p>
                Click the link below, to buy Bitcoin and other cryptocurrency
                with ease!!
              </p>
              <Link href="https://www.moonpay.com/buy" target="_blank">
                <button>BUY BTC HERE</button>
              </Link>
            </BuyBTCBox>
            <Links>
              {user?.role === "admin" && (
                <LinkItem href="/admin">
                  <GrUserAdmin /> <p>Admin</p>
                </LinkItem>
              )}
              {links.map((link) => {
                return (
                  <LinkItem
                    href={link.href}
                    key={link.href}
                    $active={pathname === link.href}
                  >
                    {link.icon} <p>{link.label}</p>
                  </LinkItem>
                );
              })}
            </Links>
          </SideProfile>
        </Sidebar>
        <ContentWrapper>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              padding: "20px",
              borderBottom: "1px solid #696868",
            }}
          >
            <button
              onClick={() => setCollapsed((s) => !s)}
              style={{
                background: "transparent",
                color: "#fff",
                border: 0,
                fontSize: "25px",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              {collapsed ? "☰" : "×"}
            </button>

            <UserMenuWrapper
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="user-menu"
            >
              <FaUserCircle size={40} color="#fff" />
              <div
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {user?.fullname || "Loading...."}
              </div>

              {showUserMenu && (
                <UserDropdown onClick={(e) => e.stopPropagation()}>
                  <p className="greeting">Hi, {user?.fullname}!</p>

                  <Link href="/dashboard/profile">
                    <div className="menu-item">
                      <FaUserCircle size={18} /> My profile
                    </div>
                  </Link>

                  <div className="divider" />

                  <button className="menu-item logout" onClick={logout}>
                    <span>↪</span> Logout
                  </button>
                </UserDropdown>
              )}
            </UserMenuWrapper>
          </div>
          <Content>{children}</Content>
        </ContentWrapper>
        {!collapsed && (
          <Overlay $show={!collapsed} onClick={() => setCollapsed(true)} />
        )}
      </Container>
    </Wrapper>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Wrapper = styled.div`
  background: white;
  position: relative;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  gap: 30px;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;
    pointer-events: none;
    height: 430px;
    background-color: #232733;
    border-bottom-left-radius: 2.5rem;
  }
`;

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: 250px;
  display: ${(p) => (p.$collapsed ? "none" : "block")};
  padding-top: 40px;
  padding-bottom: 20px;
  margin-left: 50px;

  @media (max-width: 750px) {
    /* display: block; */
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 2000;
    height: 100dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    background: #1e2128;
    max-width: 280px;
    width: 55%;
    padding: 10px;
    margin-left: 0;
    transition: transform 0.3s ease-in-out;
    transform: ${(p) => (p.$collapsed ? "translateX(-100%)" : "translateX(0)")};
  }
`;

const Overlay = styled.div<{ $show: boolean }>`
  display: none;

  @media (max-width: 750px) {
    display: ${(p) => (p.$show ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 1500;
  }
`;

const SideProfile = styled.div`
  margin-top: 80px;
  text-align: center;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  padding-bottom: 20px;

  .online {
    color: #327534;
    font-weight: bold;
    font-size: 13.5px;
  }

  @media screen and (max-width: 600px) {
    margin-top: 20px;
  }
`;

const ProfileIcon = styled(FaUserCircle)`
  width: 90px;
  height: 90px;
  color: #fff;

  @media (max-width: 500px) {
    width: 70px;
    height: 70px;
  }
`;

const ProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
`;

const BuyBTCBox = styled.div`
  background: white;
  margin-top: 20px;
  padding: 15px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 600px) {
    border-radius: 18px;
  }

  button {
    background: orange;
    border: none;
    padding: 7px;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    margin-top: 10px;
    font-weight: bold;

    &:hover {
      background: #ff8f1f;
    }
  }
`;

const GasBalance = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 10px;
  color: #ff8f1f;
  font-family: ${orbitron.style.fontFamily};
`;

const User = styled.h3`
  color: white;
  margin-top: 10px;
`;

const Links = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 30px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 500px) {
    gap: 10px;
  }

  @media (max-width: 500px) {
    margin-bottom: 50px;
  }
`;

const LinkItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: column;
  padding: 25px 10px;
  border-radius: 12px;
  cursor: pointer;
  background: ${(props) => (props.$active ? "#232733" : "transparent")};

  @media (max-width: 500px) {
    padding: 20px 8px;
  }

  svg,
  p {
    transition: all 0.2s ease;
    color: ${(props) => (props.$active ? "#fff" : "#8492a6")};
    scale: ${(props) => (props.$active ? "1.1" : "1")};
  }

  &:hover {
    p,
    svg {
      color: ${(props) => (props.$active ? "#fff" : "#232733")};
      scale: ${(props) => (props.$active ? "1.1" : "1.1")};
    }
  }

  @media (max-width: 750px) {
    &:hover {
      p,
      svg {
        color: ${(props) => (props.$active ? "#fff" : "#8492a6")};
        scale: ${(props) => (props.$active ? "1.1" : "1.1")};
      }
    }
  }

  svg {
    font-size: 30px;
    /* color: #8492a6; */
  }

  p {
    font-size: 14px;
    /* color: #8492a6; */
    font-weight: bold;
  }
`;

const UserMenuWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  @media (max-width: 600px) {
    gap: 5px;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 115%;
  right: 0;
  width: 180px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 10;

  /* --- THE ARROW --- */
  &::before {
    content: "";
    position: absolute;
    top: -8px; /* moves it above the box */
    right: 25px; /* adjust left-right placement */
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white; /* arrow color */
  }

  .greeting {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
    color: #232733;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    font-size: 14px;
    color: #232733;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  .logout {
    color: red;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
  }

  .divider {
    height: 1px;
    background: #eee;
    margin: 8px 0;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  width: 100%;
  height: 100%;
`;
