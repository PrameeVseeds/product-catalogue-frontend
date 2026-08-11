import type { ContactDetails } from "../../interfaces/site.interface";

const phoneHref = (phone: string) => phone.replace(/[^+\d]/g, "");

export const ContactInfo = ({ details }: { details: ContactDetails }) => {
  const hasDetails =
    details.companyName ||
    details.address ||
    details.phonePrimary ||
    details.phoneSecondary ||
    details.fax ||
    details.generalEmail ||
    details.workingHours;
  if (!hasDetails) return null;
  return (
    <section className="contactInfo" aria-labelledby="contact-details-heading">
      <h2 id="contact-details-heading">Contact details</h2>
      <dl>
        {details.companyName && (
          <div>
            <dt>Company</dt>
            <dd>{details.companyName}</dd>
          </div>
        )}
        {details.address && (
          <div>
            <dt>Address</dt>
            <dd>{details.address}</dd>
          </div>
        )}
        {details.phonePrimary && (
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${phoneHref(details.phonePrimary)}`}>
                {details.phonePrimary}
              </a>
            </dd>
          </div>
        )}
        {details.phoneSecondary && (
          <div>
            <dt>Secondary phone</dt>
            <dd>
              <a href={`tel:${phoneHref(details.phoneSecondary)}`}>
                {details.phoneSecondary}
              </a>
            </dd>
          </div>
        )}
        {details.fax && (
          <div>
            <dt>Fax</dt>
            <dd>{details.fax}</dd>
          </div>
        )}
        {details.generalEmail && (
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${details.generalEmail}`}>
                {details.generalEmail}
              </a>
            </dd>
          </div>
        )}
        {details.workingHours && (
          <div>
            <dt>Working hours</dt>
            <dd className="preserveText">{details.workingHours}</dd>
          </div>
        )}
      </dl>
    </section>
  );
};
