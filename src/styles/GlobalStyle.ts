"use client";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *,
    *::before,
    *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    }

    html {
    height: 100%;
    font-size: 16px;
    }

    body{
    height: 100dvh;
    /* backface-visibility: hidden; */
    /* font-family: Arial, Helvetica, sans-serif; */
    font-family: var(--font-open-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #232733;
    /* background-color: #040505;
    background-image: url('/images/backgrnd.jpg');
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    overflow: hidden; */
    } 


    a {
    color: inherit;
    text-decoration: none;
    }

    canvas {
        position: fixed !important;
        top: 0;
        left: 0;
        z-index: 0;
    }

    main {
    position: relative;
    z-index: 1;
    }


    /* * {
        border: 1px solid red;
    } */
`;
