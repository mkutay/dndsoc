"use client";

import { useState } from "react";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";

import { cn } from "@/utils/styling";
import { D20Dice } from "./d20-3d";

interface D20Props {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onRoll?: (result: number) => void;
  disabled?: boolean;
  variant?: "2d" | "3d";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-24 h-24"
};

export function D20({ className, size = "md", onRoll, disabled = false, variant = "2d" }: D20Props) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const rollDice = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    setShowResult(false);
    setResult(null);
    
    // Generate result immediately but delay showing it for animation
    const newResult = Math.floor(Math.random() * 20) + 1;
    
    // Animation duration
    setTimeout(() => {
      setResult(newResult);
      setIsRolling(false);
      setShowResult(true);
      onRoll?.(newResult);
      
      // Hide result after 3 seconds
      setTimeout(() => {
        setShowResult(false);
      }, 3000);
    }, 1000);
  };

  const getCriticalClass = (roll: number) => {
    if (roll === 20) return "text-green-500 animate-pulse-glow";
    if (roll === 1) return "text-red-500 animate-pulse";
    return "text-primary";
  };

  // For 3D variant, dynamically import the 3D component
  if (variant === "3d") {
    return <D20Dice className={className} size={size} onRoll={onRoll} disabled={disabled} />;
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        onClick={rollDice}
        disabled={disabled || isRolling}
        className={cn(
          "relative transition-all duration-200 hover:scale-110 active:scale-95",
          "focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          isRolling && "animate-spin cursor-not-allowed",
          className
        )}
        title="Click to roll D20"
      >
        <GiDiceTwentyFacesTwenty 
          className={cn(
            sizeClasses[size],
            "text-primary transition-colors duration-200",
            "hover:text-primary/80",
            isRolling && "animate-spin"
          )}
        />
        
        {/* Rolling indicator */}
        {isRolling && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
        )}
      </button>
      
      {/* Result display */}
      {showResult && result && (
        <div 
          className={cn(
            "absolute -top-8 left-1/2 transform -translate-x-1/2",
            "px-2 py-1 rounded-full bg-background border-2 border-primary",
            "font-bold text-lg animate-fade-in-up shadow-lg",
            getCriticalClass(result)
          )}
        >
          {result}
        </div>
      )}
      
      {/* Critical hit/miss indicators */}
      {showResult && result === 20 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-600 animate-fade-in-up whitespace-nowrap">
          Critical Success!
        </div>
      )}
      
      {showResult && result === 1 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-red-600 animate-fade-in-up whitespace-nowrap">
          Critical Failure!
        </div>
      )}
    </div>
  );
}
