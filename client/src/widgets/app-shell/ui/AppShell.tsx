import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="flex h-full">
    <Sidebar />
    <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
  </div>
);
