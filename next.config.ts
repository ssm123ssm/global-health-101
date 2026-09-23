import type { NextConfig } from "next";

// Fully static — no server, no auth, nothing to run at runtime.
// Served from https://ssm123ssm.github.io/global-health-101/, a subpath, so
// production builds need basePath/assetPrefix. `next dev` stays at root.
const basePath = process.env.NODE_ENV === "production" ? "/global-health-101" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
