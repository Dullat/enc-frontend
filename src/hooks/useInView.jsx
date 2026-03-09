import { useState, useEffect } from "react";

const useInView = (ref, threshold = 1) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= threshold),
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
};

export default useInView;
