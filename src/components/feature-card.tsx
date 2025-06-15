"use client";

import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ArrowRight, LucideProps } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

export function FeatureCard({ icon: Icon, title, description, href, delay = 0 }: {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  description: string;
  href: string;
  delay?: number;
}) {
  const [ref, isIntersecting] = useIntersectionObserver(0.1);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (isIntersecting && !hasAnimated) {
      const timer = setTimeout(() => setHasAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, hasAnimated, delay]);
  
  return (
    <div ref={ref}>
      <Card className={`group hover:shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 sm:min-h-[350px] md:min-h-[336px] ${
        hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 md:w-8 h-6 md:h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="mb-4 text-base md:text-lg">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline" size="sm" className="group-hover:border-primary group-hover:text-primary transition-colors">
            <Link href={href} className="flex items-center gap-2 font-quotes">
              Explore <ArrowRight className="w-3 md:w-4 h-3 md:h-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}