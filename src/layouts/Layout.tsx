import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ChatwootWidget } from "@/components/ChatwootWidget";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
