import { Heart } from "lucide-react";

const FloatingHearts = () => {
  const hearts = [
    { top: "10%", left: "5%", size: 12, delay: "0s", duration: "6s" },
    { top: "20%", right: "8%", size: 10, delay: "1s", duration: "7s" },
    { top: "35%", left: "3%", size: 8, delay: "2s", duration: "5s" },
    { top: "50%", right: "5%", size: 14, delay: "0.5s", duration: "8s" },
    { top: "65%", left: "7%", size: 10, delay: "1.5s", duration: "6s" },
    { top: "75%", right: "10%", size: 8, delay: "3s", duration: "7s" },
    { top: "85%", left: "4%", size: 12, delay: "2.5s", duration: "5s" },
    { top: "15%", left: "92%", size: 10, delay: "0.8s", duration: "6s" },
    { top: "45%", left: "95%", size: 8, delay: "1.8s", duration: "7s" },
    { top: "60%", left: "2%", size: 10, delay: "3.5s", duration: "5s" },
    { top: "30%", right: "3%", size: 12, delay: "2.2s", duration: "8s" },
    { top: "90%", right: "6%", size: 10, delay: "0.3s", duration: "6s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart, index) => (
        <div
          key={index}
          className="absolute animate-float-heart"
          style={{
            top: heart.top,
            left: heart.left,
            right: heart.right,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        >
          <Heart
            size={heart.size}
            className="text-rose/30 fill-rose/20"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
