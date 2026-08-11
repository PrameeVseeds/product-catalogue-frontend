import { safeExternalUrl } from "../../utils/safeExternalUrl";

export const MapSection = ({
  url,
  title,
}: {
  url?: string | null;
  title?: string | null;
}) => {
  const source = safeExternalUrl(url);
  if (!source) return null;
  return (
    <section className="mapSection" aria-labelledby="map-heading">
      <h2 id="map-heading">Find us</h2>
      <iframe
        src={source}
        title={`${title || "Company"} location map`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </section>
  );
};
