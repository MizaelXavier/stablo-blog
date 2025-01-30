import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { urlForImage } from "@/lib/sanity/image";
import Navbar from "@/components/navbar";
import NavbarAlt from "@/components/navbaralt";
import { cx } from "@/utils/all";
import { defaultSEOConfig } from "@/lib/seo.config";
import Footer from "@/components/footer";
// import PopupWidget from "../components/popupWidget";

export default function Layout(props) {
  const { children } = props;
  const ogimage = urlForImage(props?.openGraphImage) ?? "/img/og-default.jpg";
  
  // Merge default SEO config with page-specific props
  const seoConfig = {
    ...defaultSEOConfig,
    title: props.title,
    description: props.description || defaultSEOConfig.description,
    canonical: props.url || defaultSEOConfig.canonical,
    openGraph: {
      ...defaultSEOConfig.openGraph,
      url: props.url || defaultSEOConfig.openGraph.url,
      title: props.title || defaultSEOConfig.defaultTitle,
      description: props.description || defaultSEOConfig.description,
      images: [
        {
          url: ogimage,
          width: 800,
          height: 600,
          alt: props.title || defaultSEOConfig.defaultTitle
        }
      ],
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://cdn.sanity.io/" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io//" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="pt-BR" />
        <link rel="alternate" hrefLang="pt-BR" href={seoConfig.canonical} />
      </Head>
      <NextSeo {...seoConfig} />

      <div
        className={cx(
          props?.fontStyle,
          "antialiased text-gray-800 dark:bg-black dark:text-gray-400"
        )}>
        {props.alternate ? (
          <NavbarAlt {...props} />
        ) : (
          <Navbar {...props} />
        )}

        <div>{children}</div>

        <Footer {...props} />
      </div>
    </>
  );
}
