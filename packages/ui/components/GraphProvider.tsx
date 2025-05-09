import React, { createContext, ReactNode, useContext, useState } from "react";

type DailyRepArray = number[] & { length: 7 };
type Props = {
  children: ReactNode;
};
type GraphContextType = {
  dailyReps: DailyRepArray;
  setDailyReps: React.Dispatch<React.SetStateAction<DailyRepArray>>;
};

const GraphContext = createContext<GraphContextType | null>(null);

export function useGraphContext() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within GraphProvider");
  }
  return context;
}

export const GraphProvider = ({ children }: Props) => {
  const [dailyReps, setDailyReps] = useState<DailyRepArray>([
    8, 10, 0, 11, 15, 10, 3,
  ]);

  return (
    <GraphContext.Provider value={{ dailyReps, setDailyReps }}>
      {children}
    </GraphContext.Provider>
  );
};
