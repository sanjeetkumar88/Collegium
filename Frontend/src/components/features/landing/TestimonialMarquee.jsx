import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { useRef } from "react";

const testimonials = [
    {
      name: "Aarav Singh",
      quote: "Collegium helped me find teammates and launch my dream project!",
      role: "Student Developer",
      img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Aarav",
    },
    {
      name: "Riya Mehra",
      quote: "Amazing platform! I found clubs that matched my interests perfectly.",
      role: "Club Member",
      img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Riya",
    },
    {
      name: "Dev Sharma",
      quote: "Organizing events has never been easier, thanks to Collegium.",
      role: "Club Leader",
      img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Dev",
    },
    {
      name: "Ananya Joshi",
      quote: "The UI is super smooth and makes collaboration effortless!",
      role: "UI/UX Enthusiast",
      img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Ananya",
    },
  ];
  
  

const TestimonialMarquee = () => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const speed = 1.0; 

  const paused = useRef(false);

  useAnimationFrame(() => {
    if (!paused.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const totalWidth = containerRef.current.scrollWidth;
      const current = x.get();

      if (Math.abs(current) >= totalWidth / 2) {
        x.set(0); // reset to loop
      } else {
        x.set(current - speed);
      }
    }
  });

  return (
    <section className="relative py-16 overflow-hidden ">

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          What Our Users Say
        </h2>

        <div
          className="overflow-hidden relative w-full"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <motion.div
            className="flex gap-8 w-max"
            ref={containerRef}
            style={{ x }}
          >
            {[...testimonials, ...testimonials].map((item, idx) => (
              <div
                key={idx}
                className="min-w-[300px] max-w-sm bg-white shadow-md rounded-2xl p-6 border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <FaQuoteLeft className="text-indigo-500 text-xl mb-3" />
                  <p className="text-gray-700 italic mb-6">"{item.quote}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialMarquee;
