import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root: the home directory above this project has its own
  // lockfile, which Next would otherwise try to use.
  turbopack: { root: here },
  // `npm run export` writes a plain folder of HTML/CSS/JS to ./out that any
  // static host will serve. Left off during development so `next dev` keeps
  // all its normal behaviour.
  ...(process.env.STATIC_EXPORT
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        // Serving from a subpath (a GitHub Pages project site, say) needs both
        // this and NEXT_PUBLIC_BASE_PATH, which lib/asset.ts reads.
        ...(process.env.NEXT_PUBLIC_BASE_PATH
          ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH }
          : {}),
      }
    : {}),
  reactStrictMode: true,
  devIndicators: false,
};
export default nextConfig;
