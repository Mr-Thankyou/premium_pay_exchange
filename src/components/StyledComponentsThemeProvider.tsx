"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";

export default function StyledComponentsThemeProvider({ children }: any) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
