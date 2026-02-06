import { motion } from "framer-motion";

export function GeometricPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 pattern-islamic" />
      
      {/* Decorative circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 w-80 h-80 border border-primary/5 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -right-40 w-96 h-96 border border-accent/5 rounded-full"
      />
      
      {/* Subtle glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-accent/3 rounded-full blur-[80px]" />
    </div>
  );
}
