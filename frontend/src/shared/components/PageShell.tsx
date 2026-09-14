import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  children: ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto min-h-[calc(100svh-64px)] w-full max-w-3xl px-4 py-8"
    >
      <h1 className="font-display mb-6 text-3xl font-semibold text-[var(--color-dark-charcoal)]">
        {title}
      </h1>
      {children}
    </motion.main>
  );
}
