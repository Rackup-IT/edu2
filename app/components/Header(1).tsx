"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

interface HeaderProps {
  forceSticky?: boolean;
  logoUrl?: string;
  companyName?: string;
}

export default function Header({ forceSticky = false, logoUrl, companyName }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  const [isScrolledState, setIsScrolledState] = useState(false);
  const isScrolled = forceSticky || !isHomePage || isScrolledState;

  useEffect(() => {
    if (forceSticky) {
      return;
    }

    const handleScroll = () => {
      // Toggle at 100vh (approaching second section)
      // Using window.innerHeight gives us a responsive "full hero height" threshold
      if (window.scrollY > window.innerHeight - 100) {
        setIsScrolledState(true);
      } else {
        setIsScrolledState(false);
      }
    };

    // Check on mount to handle reload position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceSticky]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <Navbar logoUrl={logoUrl} companyName={companyName} />
    </div>
  );
}
