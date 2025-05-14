// src/components/SocialMeta.jsx
import { Helmet } from "react-helmet";

export const SocialMeta = ({ title, description, image, url }) => {
  const fullUrl = `${window.location.origin}${url}`;
  const defaultImage = `${window.location.origin}/logo-social.png`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};