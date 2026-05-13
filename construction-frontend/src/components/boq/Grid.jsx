import { ReactNode } from "react";

export default function Grid({ children, cols = 2, className = "" }) {
  const gridCols = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols[cols]} ${className}`}>
      {children}
    </div>
  );
}
