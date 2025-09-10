/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        marqueeLeft: "marqueeLeft 30s linear infinite",
        marqueeRight: "marqueeRight 30s linear infinite",
        spinOrbit: "spinOrbit 20s linear infinite",
       
      },
      keyframes: {
        marqueeLeft: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeRight: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(100%)" },
        },
        spinOrbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        
      },
      backgroundSize: {
        "300": "300% 300%",
      },
      colors: {
        darkBlue: "#090A47",
        teal: "#20AEB2",
      },
    },
  },
  plugins: [],
};
