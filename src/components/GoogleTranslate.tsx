"use client";
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    // init function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div style={{ marginBottom: "5px" }}>
      <div id="google_translate_element"></div>
    </div>
  );
}
