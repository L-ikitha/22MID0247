"use client";
import { useEffect } from "react";
import { setLogEndpoint, Log } from "campus-logging-middleware";

let initialized = false;

export default function LoggerInit() {
  useEffect(() => {
    if (initialized) return;
    initialized = true;
    setLogEndpoint("/api/logs");
    Log("frontend", "info", "config", "Logger initialized with local proxy /api/logs");
  }, []);
  return null;
}