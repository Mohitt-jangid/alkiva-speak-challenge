import React from 'react';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import ConceptSection from './sections/ConceptSection';
import HowItWorksSection from './sections/HowItWorksSection';
import MissionSection from './sections/MissionSection';
import PhilosophySection from './sections/PhilosophySection';
import Footer from './sections/Footer';

/**
 * App — Root layout. Single-page scroll experience.
 */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ConceptSection />
        <HowItWorksSection />
        <MissionSection />
        <PhilosophySection />
      </main>
      <Footer />
    </>
  );
}
