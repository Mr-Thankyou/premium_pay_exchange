"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function Smartsupp() {
  useEffect(() => {
    (window as any)._smartsupp = (window as any)._smartsupp || {};
    (window as any)._smartsupp.key = "b54273a13ecbdde40b0a171ac286a51771eaf8b3";

    // console.log("Smartsupp init ran");
  }, []);

  return (
    <>
      <Script
        src="https://www.smartsuppchat.com/loader.js"
        strategy="afterInteractive"
        // onLoad={() => console.log("Smartsupp script loaded")}
        // onError={() => console.log("Smartsupp script failed")}
      />
    </>
  );
}

// <!-- Smartsupp Live Chat script -->
// <script type="text/javascript">
// var _smartsupp = _smartsupp || {};
// _smartsupp.key = 'b54273a13ecbdde40b0a171ac286a51771eaf8b3';
// window.smartsupp||(function(d) {
//   var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
//   s=d.getElementsByTagName('script')[0];c=d.createElement('script');
//   c.type='text/javascript';c.charset='utf-8';c.async=true;
//   c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
// })(document);
// </script>
// <noscript>Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a></noscript>
