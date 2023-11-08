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
    },
  },
  plugins: [require("flowbite/plugin")], 
};
