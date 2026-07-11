import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Destinations from "../components/Destinations";
import AboutSriLanka from "../components/AboutSriLanka";
import FinalCta from "../components/FinalCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Destinations />
      <AboutSriLanka />
      <FinalCta />
    </main>
  );
}
