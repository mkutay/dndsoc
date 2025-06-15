"use client";

import { useEffect, useState } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function AnimatedDice() {
  const [currentDice, setCurrentDice] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDice((prev) => (prev + 1) % diceIcons.length);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  const DiceIcon = diceIcons[currentDice];
  
  return (
    <DiceIcon 
      className="w-8 h-8 text-primary transition-all duration-300 transform hover:scale-110" 
    />
  );
}