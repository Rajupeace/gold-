import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "Evergreen Elegance | Timeless Shine, Forever Yours";
    const defaultDescription = "Discover timeless elegance at Evergreen Elegance. High-quality rose gold, diamond, and silver jewelry handcrafted for luxury and sophistication.";
    
    return (
        <Helmet>
            <title>{title ? `${title} | Evergreen Elegance` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || "evergreen elegance, rose gold jewelry, luxury rings, certified diamonds, timeless shine"} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
