import { motion } from "framer-motion";
import { ReactNode } from "react";

export function StickySidebar({ 
  children, 
  sidebar 
}: { 
  children: ReactNode, 
  sidebar: ReactNode 
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-16 relative items-start">
      <div className="flex-1 w-full flex flex-col gap-12">
        {children}
      </div>
      <div className="flex-1 w-full lg:sticky lg:top-32">
        {sidebar}
      </div>
    </div>
  );
}
