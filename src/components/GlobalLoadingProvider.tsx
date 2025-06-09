"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

export default function GlobalLoadingProvider() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <LoadingOverlay /> : null;
} 