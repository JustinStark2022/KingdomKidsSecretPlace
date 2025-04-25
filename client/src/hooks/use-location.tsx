import { useLocation as useWouterLocation } from "wouter";

/**
 * Custom wrapper around Wouter's useLocation.
 * Exposes the navigate function for clean programmatic routing.
 */
export function useLocation() {
  const [, navigate] = useWouterLocation();
  return navigate;
}
