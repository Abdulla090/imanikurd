import { memo } from "react";

// Use pure CSS animations instead of framer-motion's JS-driven infinite animations
// This avoids constant React re-renders and JS computation
export const GeometricPattern = memo(function GeometricPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 pattern-islamic" />

      {/* Decorative circles — CSS animations instead of framer-motion */}
      <div
        className="absolute -top-40 -left-40 w-80 h-80 border border-primary/5 rounded-full"
        style={{ animation: "spin 120s linear infinite" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 border border-accent/5 rounded-full"
        style={{ animation: "spin 150s linear infinite reverse" }}
      />

      {/* Subtle glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-accent/3 rounded-full blur-[80px]" />
    </div>
  );
});
