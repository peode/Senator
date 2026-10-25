import { MapPin, Phone, Clock } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { SocialIcon } from "@/components/SocialIcons";
import {
  Section,
  SectionHeading,
  SectionSubtitle,
} from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { socialLabels } from "@/data/socials";
import { phoneHref, useSettings } from "@/lib/content";

const ContactCard = ({ icon: Icon, title, children, href }) => {
  const content = (
    <Card className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-0 rounded-xl bg-surface px-5 py-[18px] ring-0">
      <Icon size={26} strokeWidth={1.5} className="row-span-2 text-brand" />
      <span className="text-sm text-slate-500">{title}</span>
      <span className="text-base font-bold whitespace-pre-line">{children}</span>
    </Card>
  );

  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
};

const Contacts = () => {
  const { phone, address, hours, socials } = useSettings();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const routeHref = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <>
      <PageBanner title="Контакти" />

      <Section>
        <SectionHeading title="ВІДДІЛ ПРОДАЖУ">
          <SectionSubtitle>{address}</SectionSubtitle>
        </SectionHeading>

        <div className="grid gap-[30px] lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)]">
          <div className="flex flex-col gap-3">
            <ContactCard icon={Phone} title="Телефон" href={phoneHref(phone)}>
              {phone}
            </ContactCard>
            <ContactCard icon={MapPin} title="Адреса">
              {address}
            </ContactCard>
            <ContactCard icon={Clock} title="Години роботи">
              {hours}
            </ContactCard>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                variant="gold"
                size="xl"
                className="w-full px-8 sm:w-auto"
                render={<a href={routeHref} target="_blank" rel="noreferrer" />}
                nativeButton={false}
              >
                Прокласти маршрут
              </Button>

              {Object.entries(socials).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={socialLabels[key]}
                  className="flex size-12 items-center justify-center rounded-full border border-neutral-300 transition-colors hover:border-brand hover:text-brand-dark"
                >
                  <SocialIcon name={key} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-2xl bg-slate-200 md:min-h-[420px]">
            <iframe
              title="Розташування ЖК Senator на карті"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block size-full min-h-[320px] border-0 md:min-h-[420px]"
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default Contacts;
