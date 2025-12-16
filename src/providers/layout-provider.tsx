import { useDocumentTitle } from "@refinedev/react-router";
import React, { createContext, useContext, useState } from "react";

interface LayoutContextProps {
  title: string;
  actions: React.ReactNode;
  contentTitle: React.ReactNode | null;
  setTitle: (title: string) => void;
  setActions: (actions: React.ReactNode) => void;
  setContentTitle: (node: React.ReactNode | null) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = useState("");
  const [actions, setActions] = useState<React.ReactNode>(null);
  const [contentTitle, setContentTitle] = useState<React.ReactNode | null>(
    null,
  );
  useDocumentTitle(title);

  return (
    <LayoutContext.Provider
      value={{
        title,
        actions,
        contentTitle,
        setTitle,
        setActions,
        setContentTitle,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within a LayoutProvider");
  return ctx;
};
