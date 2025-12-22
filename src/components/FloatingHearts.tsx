import { Heart, Cake, Sparkles, PartyPopper, Gift, Gem } from "lucide-react";
import { LucideIcon } from "lucide-react";

type FloatingItem = {
  top: string;
  left?: string;
  right?: string;
  size: number;
  delay: string;
  duration: string;
  icon: LucideIcon;
  className: string;
};

const FloatingElements = () => {
  const items: FloatingItem[] = [
    { top: "10%", left: "5%", size: 12, delay: "0s", duration: "6s", icon: Heart, className: "text-rose/30 fill-rose/20" },
    { top: "20%", right: "8%", size: 14, delay: "1s", duration: "7s", icon: Cake, className: "text-rose/25" },
    { top: "35%", left: "3%", size: 10, delay: "2s", duration: "5s", icon: Sparkles, className: "text-gold/30" },
    { top: "50%", right: "5%", size: 14, delay: "0.5s", duration: "8s", icon: Heart, className: "text-rose/30 fill-rose/20" },
    { top: "65%", left: "7%", size: 12, delay: "1.5s", duration: "6s", icon: Gem, className: "text-sage/30" },
    { top: "75%", right: "10%", size: 10, delay: "3s", duration: "7s", icon: PartyPopper, className: "text-rose/25" },
    { top: "85%", left: "4%", size: 12, delay: "2.5s", duration: "5s", icon: Heart, className: "text-rose/30 fill-rose/20" },
    { top: "15%", left: "92%", size: 12, delay: "0.8s", duration: "6s", icon: Cake, className: "text-rose/25" },
    { top: "45%", left: "95%", size: 10, delay: "1.8s", duration: "7s", icon: Sparkles, className: "text-gold/30" },
    { top: "60%", left: "2%", size: 10, delay: "3.5s", duration: "5s", icon: Gift, className: "text-sage/25" },
    { top: "30%", right: "3%", size: 12, delay: "2.2s", duration: "8s", icon: Heart, className: "text-rose/30 fill-rose/20" },
    { top: "90%", right: "6%", size: 10, delay: "0.3s", duration: "6s", icon: Gem, className: "text-gold/25" },
    { top: "25%", left: "6%", size: 11, delay: "1.2s", duration: "6.5s", icon: PartyPopper, className: "text-rose/25" },
    { top: "55%", right: "7%", size: 13, delay: "2.8s", duration: "7.5s", icon: Cake, className: "text-rose/25" },
    { top: "80%", right: "4%", size: 10, delay: "0.6s", duration: "5.5s", icon: Sparkles, className: "text-gold/30" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="absolute animate-float-heart"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          >
            <Icon size={item.size} className={item.className} />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingElements;
