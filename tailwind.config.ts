import type { Config } from "tailwindcss";

/**
 * Tailwind v4 note:
 * Brand colors and fonts are now defined in globals.css via @theme {}.
 * This file is only needed for content path config and plugins.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;