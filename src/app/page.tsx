import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import WhatsApp from "@/components/WhatsApp";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Portfolio />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <WhatsApp />
      <ScrollReveal />
    </>
  );
}
