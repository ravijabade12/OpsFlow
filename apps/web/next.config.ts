import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@opsflow/shared"],
  // Helps Vercel monorepo builds that install from the workspace root.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
