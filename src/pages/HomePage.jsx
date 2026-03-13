import Hero from "../components/Hero.jsx";
import TeaserSection from "../components/TeaserSection.jsx";
import FeaturesSection from "../components/FeaturesSection.jsx";

const HomePage = () => {
  return (
    <div className="h-dvh overflow-y-scroll w-full snap-y snap-mandatory scroll-container scroll-container">
      <Hero />
      <TeaserSection />
      <FeaturesSection />
    </div>
  );
};

export default HomePage;
