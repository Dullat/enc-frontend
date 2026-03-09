import Hero from "../components/Hero.jsx";
import TeaserSection from "../components/TeaserSection.jsx";
const HomePage = () => {
  return (
    <div className="h-dvh overflow-y-scroll w-full snap-y snap-mandatory scroll-container">
      <Hero />
      <TeaserSection />
    </div>
  );
};

export default HomePage;
