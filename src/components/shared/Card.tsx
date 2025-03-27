
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  glass?: boolean;
}

const Card = ({ 
  className, 
  children, 
  onClick, 
  hoverable = false,
  glass = false
}: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-300",
        hoverable && "hover:translate-y-[-4px] hover:shadow-lg",
        glass ? "glass" : "bg-card shadow-sm border border-border",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
