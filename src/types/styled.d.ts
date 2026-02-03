import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      sidebar: string;
      text: string;
      white: string;
      primary: string;
      gray: string;
      border: string;
    };
  }
}
