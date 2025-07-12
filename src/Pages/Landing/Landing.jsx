import {
  ArrowRight,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "../../Components/ui/Button";
import LandingNavBar from "../../Components/Navbar/LandingNavBar";
import Title from "../../Components/Landing/Title";
import Feature from "../../Components/Landing/Feature/Feature";
import {
  features,
  footerFeatures,
  footerSupport,
  how_it_work,
  pricing,
  reviews,
} from "./data";
import How_it_work from "../../Components/Landing/How_it_work/How_it_work";
import Pricing from "../../Components/Landing/Pricing/Pricing";
import { Testimonials } from "../../Components/Landing/testimonials/Testimonials";

const Landing = () => {
  return (
    <div>
      {/* Fixed Navigation Bar */}
      <LandingNavBar />

      {/* Landing */}
      <section className="relative min-h-screen bg-[url('/landing.png')] bg-cover bg-no-repeat">
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-40 min-h-screen">
          <section
            id="home"
            className="text-center space-y-8 grid place-content-center min-h-screen p-5"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white">
              Smarter Farming
              <span className="block text-[#FCD34F]">Starts Here</span>
            </h1>
            <p className="text-xl font-medium text-[#F3F2E7] px-1 md:w-[70%] mx-auto">
              Monitor crops, predict yields, detect diseases, and automate
              irrigation – all from a single platform.
            </p>
            <Button
              link={"/signup"}
              className="bg-[#1E6930] h-[53px] px-10 text-lg mx-auto"
            >
              get started <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </section>
        </div>
      </section>

      {/* features */}
      <section
        id="features"
        className="bg-[#F9FAFB] space-y-14 py-10 px-5 md:px-10"
      >
        <Title
          title={"Everything You Need for"}
          greenTitle={"Smart Agriculture"}
          desc={
            "Our comprehensive platform combines AI-driven insights with practical farm monitoring and control tools to help you make better decisions and increase productivity."
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14 lg:w-[90%] mx-auto">
          {features.map((feature, index) => (
            <Feature
              key={index}
              title={feature.title}
              desc={feature.desc}
              icon={feature.icon}
            />
          ))}
        </div>
      </section>

      {/* how it Works */}
      <section id="how_it_works" className="space-y-14 py-10 px-5 md:px-10">
        <Title
          title={"How It"}
          greenTitle={"Works"}
          desc={
            "Get started with agrivision in four simple steps and transform your farming operations."
          }
        />
        <div className="lg:w-[90%] mx-auto space-y-20">
          <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-15 xl:space-x-20">
            <How_it_work
              icon={how_it_work[0].icon}
              title={how_it_work[0].title}
              desc={how_it_work[0].desc}
              step={1}
              steps={how_it_work[0].steps}
            />
            <img src="/how_it_work1.png" className="sm:w-3/4 lg:w-1/2 h-1/2" />
          </section>
          <section className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between lg:space-x-15 xl:space-x-20">
            <img src="/how_it_work2.png" className="sm:w-3/4 lg:w-1/2 h-1/2" />
            <How_it_work
              icon={how_it_work[1].icon}
              title={how_it_work[1].title}
              desc={how_it_work[1].desc}
              step={2}
              steps={how_it_work[1].steps}
            />
          </section>
          <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-15 xl:space-x-20">
            <How_it_work
              icon={how_it_work[2].icon}
              title={how_it_work[2].title}
              desc={how_it_work[2].desc}
              step={3}
              steps={how_it_work[2].steps}
            />
            <img src="/how_it_work3.png" className="sm:w-3/4 lg:w-1/2 h-1/2" />
          </section>
          <section className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between lg:space-x-15 xl:space-x-20">
            <img src="/how_it_work4.png" className="sm:w-3/4 lg:w-1/2 h-1/2" />
            <How_it_work
              icon={how_it_work[3].icon}
              title={how_it_work[3].title}
              desc={how_it_work[3].desc}
              step={4}
              steps={how_it_work[3].steps}
            />
          </section>
        </div>
      </section>

      {/* pricing */}
      <section
        id="pricing"
        className="bg-[#F9FAFB] space-y-14 py-10 px-5 md:px-10"
      >
        <Title
          title={"Choose Your"}
          greenTitle={"Perfect Plan"}
          desc={
            "Scale your agriculture operations with flexible pricing designed to grow with your farming needs."
          }
        />
        <div className="sm:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 items-center">
          {pricing.map((block, index) => (
            <Pricing
              key={index}
              title={block.title}
              price={block.price}
              desc={block.desc}
              availableFarmers={block.availableFarmers}
              features={block.features}
            />
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section id="testimonials" className="space-y-14 py-10 px-5 md:px-10">
        <Title
          title={"Trusted By"}
          greenTitle={"Farmers"}
          desc={
            "See how agrivision is helping farmers increase yields, reduce costs, and make smarter decisions."
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 lg:w-[90%] mx-auto">
          {reviews.map((rev, index) => (
            <Testimonials
              key={index}
              name={rev.name}
              review={rev.review}
              role={rev.role}
              loc={rev.loc}
            />
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[#E5E7EB] py-10 px-5">
        <div className="lg:w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <section className="space-y-3">
            <img src="/blackLogo.png" className="w-24 h-8" />
            <p className="text-sm font-medium text-[#4B5563] flex-1">
              We aim to be your primary partner in boosting your agricultural
              efficiency.
            </p>
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">features</h4>
            {footerFeatures.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium text-[#4B5563] block"
              >
                {link.title}
              </a>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">support</h4>
            {footerSupport.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium text-[#4B5563] block"
              >
                {link.title}
              </a>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-semibold capitalize">contact us</h4>
            <a
              href="/"
              className="text-sm font-medium text-[#4B5563] flex items-center"
            >
              <Phone className="text-[#4B5563] mr-2" size={15} />
              +20 155 555 5555
            </a>
            <a
              href=""
              className="text-sm font-medium text-[#4B5563] flex items-center"
            >
              <Mail className="text-[#4B5563] mr-2" size={15} />
              contact@agrivisionlabs.tech
            </a>

            <div className="flex items-center space-x-2">
              <Facebook className="text-[#4B5563]" size={20} />
              <Twitter className="text-[#4B5563]" size={20} />
              <Instagram className="text-[#4B5563]" size={20} />
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
