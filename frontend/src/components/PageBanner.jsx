import courtyard from "@/assets/images/courtyard.png";

const PageBanner = ({ title, subtitle }) => (
  <div
    className="relative isolate flex flex-col items-center justify-center bg-ink bg-cover bg-center px-[5%] py-[50px] text-center text-white"
    style={{ backgroundImage: `url(${courtyard})` }}
  >
    <div className="absolute inset-0 -z-10 bg-ink/70" />
    <h1 className="text-[clamp(32px,4.5vw,64px)] leading-[1.1] font-extrabold">
      {title}
    </h1>
    {subtitle && (
      <p className="mt-3 max-w-[700px] text-[15px] text-white/80 md:text-lg">
        {subtitle}
      </p>
    )}
  </div>
);

export default PageBanner;
