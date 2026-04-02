import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  live?: boolean;
  delay?: number;
  glow?: boolean;
}

export function Panel({ title, children, className = "", live, delay = 0, glow }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className={`panel ${glow ? "panel-glow" : ""} ${className}`}
    >
      <div className="panel-header">
        {live && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-glow-pulse" />}
        <span>{title}</span>
      </div>
      <div className="panel-body">{children}</div>
    </motion.div>
  );
}
