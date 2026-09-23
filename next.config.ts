import type { NextConfig } from "next";

// Fully static — no server, no auth, nothing to run at runtime.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
