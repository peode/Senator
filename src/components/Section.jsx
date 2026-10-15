import { cn } from "cn";

const Section = ({ className, children, ...props }) => (
  <section
    className={cn(
      "bg-white px-[5%] py-[50px] text-neutral-950 md:px-[4%] md:py-[70px] lg:px-[6.5%] lg:py-[90px]",
      className
    )}
    {...props}
  >
    <div className="mx-auto max-w-[1600px]">{children}</div>
  </section>
);

const SectionHeading = ({ title, children }) => (
  <div className="mb-8 flex flex-col items-start gap-3 md:mb-[50px] md:flex-row md:items-center md:justify-between md:gap-8">
    <div className="flex items-center gap-4 md:gap-7">
      <span className="block h-1 w-9 shrink-0 rounded-full bg-brand md:h-1.5 md:w-[67px]" />
      <h2 className="text-[clamp(24px,3vw,44px)] leading-[1.15] font-extrabold tracking-wide">
        {title}
      </h2>
    </div>

    {children}
  </div>
);

const SectionSubtitle = ({ children }) => (
  <p className="text-[15px] font-medium text-slate-600 md:text-right md:text-[clamp(15px,1.3vw,20px)]">
    {children}
  </p>
);

export { Section, SectionHeading, SectionSubtitle };
