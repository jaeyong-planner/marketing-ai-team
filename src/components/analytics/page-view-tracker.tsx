"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushDataLayer, trackServer } from "@/lib/analytics/events";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pushDataLayer("page_view", { page_path: pathname });
    void trackServer("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}