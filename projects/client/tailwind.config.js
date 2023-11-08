module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "Grey-1": "#40403F",
        "Grey-4": "#F0F0F0",
      },
      fontFamily: {
        sagoe: ["Sagoe UI", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")], 
};
