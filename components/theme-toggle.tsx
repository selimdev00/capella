"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard against a theme-dependent hydration mismatch
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const dark = mounted && isDark;

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) doc.startViewTransition(() => setTheme(next));
    else setTheme(next);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
