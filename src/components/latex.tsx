"use client";

import React, { useRef, useEffect } from "react";
import katex from "katex";

interface LatexProps {
  latexString: string;
  displayMode?: boolean;
}

export const Latex: React.FC<LatexProps> = ({
  latexString,
  displayMode = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latexString, ref.current, {
          throwOnError: false,
          displayMode: displayMode, // For block equations, use true
        });
      } catch (error: unknown) {
        console.error("KaTeX rendering error:", error);
        if (ref.current) {
          ref.current.innerHTML = `<span className="text-destructive-foreground">Error: ${error || "Invalid LaTeX"}</span>`;
        }
      }
    }
  }, [latexString, displayMode]);

  return <div ref={ref} />;
};