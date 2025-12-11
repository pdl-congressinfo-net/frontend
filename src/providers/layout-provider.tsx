import { useDocumentTitle } from "@refinedev/react-router";
import React, { createContext, useContext, useState } from "react";

interface LayoutContextProps {
  title: string;
  actions: React.ReactNode;
  setTitle: (title: string) => void;
  setActions: (actions: React.ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState<React.ReactNode>(null);
  useDocumentTitle(title);

  return (
    <LayoutContext.Provider value={{ title, actions, setTitle, setActions }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within a LayoutProvider");
  return ctx;
};
