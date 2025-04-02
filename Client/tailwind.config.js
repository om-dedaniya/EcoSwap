/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "#2A7F62", // Green color for headings
        secondary: "#FF7F50", // Orange accent color
        lightGreen: "#C8E6C9", // Light green background
        softWhite: "rgba(255, 255, 255, 0.3)", // Glassmorphism effect
      },
      boxShadow: {
        glass: "0 10px 25px rgba(0, 0, 0, 0.15)",
        glassHover: "0 15px 40px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "10px",
        md: "15px",
      },
      keyframes: {
        floating: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(15px)" },
        },
      },
      animation: {
        floating: "floating 6s infinite alternate ease-in-out",
      },
    },
  },
  plugins: [],
};
