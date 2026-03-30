import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1020",
        mist: "#EFF6FF",
        cyan: "#06B6D4",
        coral: "#FB7185",
        sun: "#FACC15"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(8, 15, 43, 0.14)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(250, 204, 21, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(6, 182, 212, 0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(251, 113, 133, 0.18), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
