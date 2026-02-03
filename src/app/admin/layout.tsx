"use client";

import styled from "styled-components";
import Link from "next/link";
import StyledComponentsThemeProvider from "@/components/StyledComponentsThemeProvider";
import { useRouter } from "next/navigation";

// ==================== 🌻Main Component ====================
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <StyledComponentsThemeProvider>
      <Container>
        <Sidebar>
          <Logo>Admin</Logo>

          <NavGroup>
            <NavItem href="/admin">Dashboard</NavItem>
            <NavItem href="/admin/users">Users</NavItem>
            <NavItem href="/admin/coin-address">Coin Addresses</NavItem>
            <NavItem href="/admin/stats">Platform Stats</NavItem>
          </NavGroup>

          <Button onClick={() => router.push("/dashboard")}>
            ↩️Back to App
          </Button>
        </Sidebar>

        <ContentArea>
          <TopBar>
            <TopTitle>Admin Panel</TopTitle>
          </TopBar>

          <InnerContent>{children}</InnerContent>
        </ContentArea>
      </Container>
    </StyledComponentsThemeProvider>
  );
}

//
// ==================== 🌸STYLED COMPONENTS ====================
//

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

const Sidebar = styled.aside`
  width: 240px;
  background: ${({ theme }) => theme.colors.sidebar};
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const NavGroup = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavItem = styled(Link)`
  color: #ddd;
  text-decoration: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 12px;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-self: flex-start;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 18px 25px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TopTitle = styled.h1`
  margin: 0;
  font-size: 20px;
`;

const InnerContent = styled.div`
  padding: 30px;
  overflow-y: auto;
`;
