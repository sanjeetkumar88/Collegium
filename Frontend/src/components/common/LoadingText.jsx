import { motion } from 'framer-motion';

const letters = [
  { char: 'l', delay: 0.1 },
  { char: 'o', delay: 0.25 },
  { char: 'a', delay: 0.4 },
  { char: 'd', delay: 0.55 },
  { char: 'i', delay: 0.7 },
  { char: 'n', delay: 0.85 },
  { char: 'g', delay: 1.0 },
];

export default function LoadingText() {
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className="flex gap-2 text-[30px] font-bold font-sans">
        {letters.map(({ char, delay }, index) => (
          <motion.span
            key={index}
            className="min-w-[40px] flex justify-center items-center rounded bg-[#dbd5f3] text-[#aa41fe]"
            initial={{ y: 0, rotate: 0, scale: 1 }}
            animate={{
              y: [-2, -22, 0],
              rotate: [0, -13, 3, 0],
              scale: [1, 1.1, 1],
              color: ['#aa41fe', '#6a45ed', '#aa41fe'],
            }}
            transition={{
              delay,
              duration: 1,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
