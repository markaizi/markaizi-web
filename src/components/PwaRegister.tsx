"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Sessizce yut — SW kaydı başarısız olsa da panel normal çalışmaya devam eder.
      });
    }
  }, []);
  return null;
}
