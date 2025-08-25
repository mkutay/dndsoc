"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/styling";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"} suppressHydrationWarning>
          <Sun
            key="light"
            size={ICON_SIZE}
            className={cn("text-muted-foreground", theme !== "light" ? "hidden" : "flex")}
            suppressHydrationWarning
            id="theme-light-button"
          />
          <Moon
            key="dark"
            size={ICON_SIZE}
            className={cn("text-muted-foreground", theme !== "dark" ? "hidden" : "flex")}
            suppressHydrationWarning
            id="theme-dark-button"
          />
          <Laptop
            key="system"
            size={ICON_SIZE}
            className={cn("text-muted-foreground", theme !== "system" ? "hidden" : "flex")}
            suppressHydrationWarning
            id="theme-system-button"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={theme} onValueChange={(e) => setTheme(e)}>
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" /> <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" /> <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" /> <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
