import {About} from '@/components/About';
import {AIWorkflow} from '@/components/AIWorkflow';
import {Categories} from '@/components/Categories';
import {Contact} from '@/components/Contact';
import {Footer} from '@/components/Footer';
import {Hero} from '@/components/Hero';
import {Navbar} from '@/components/Navbar';
import {PortfolioGrid} from '@/components/PortfolioGrid';
import {Testimonials} from '@/components/Testimonials';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <Navbar />
      <Hero />
      <About />
      <PortfolioGrid />
      <Categories />
      <AIWorkflow />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
