import { setRequestLocale } from 'next-intl/server';
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Contents from "./_components/Contents";
import About from "./_components/About";
import Officers from "./_components/Officers";
import Contact from "./_components/Contact";
import Footer from "./_components/Footer";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#f7fdf9]">
      <Header />
      <Hero />
      <div className="section-divider"></div>
      <About />
      <div className="section-divider"></div>
      <Officers />
      <div className="section-divider"></div>
      <Contents />
      <div className="section-divider"></div>
      <Contact />
      <Footer />
    </div>
  );
}
