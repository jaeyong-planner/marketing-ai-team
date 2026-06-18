import Script from "next/script";

type TrackingScriptsProps = {
  gtmId?: string;
  metaPixelId?: string;
};

export function TrackingScripts({ gtmId, metaPixelId }: TrackingScriptsProps) {
  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
          `}</Script>
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
        </>
      ) : null}
      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}');
          fbq('track', 'PageView');
        `}</Script>
      ) : null}
    </>
  );
}