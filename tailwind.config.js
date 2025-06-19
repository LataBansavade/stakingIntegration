/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      colors:{
        bgPrimary : "var(--bg-primary)",
        bgSecondary : "var(--bg-secondary)",
        bgPurple : "var(--bg-purple)",

        textPrimary : "var(--text-primary)",
        textSecondary : "var(--text-secondary)",
        


      },
      fontFamily: {
        SpaceGrotesk : ["Space Grotesk", "sans-serif"],
        Lexend : ["Lexend", "sans-serif"],

      },
      screens: {
        "xxs": "320px",
        "xs": "350px",
        "s": "375px",
        "mobile": "480px",
        "sm": "640px",
        "md": "768px",
        "mdl": "900px",
        "l": "992px",
        "lg": "1024px",
        "xl": "1280px",
        "xll": "1329px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
      scrollSnapType: {
        x: 'x mandatory',
      },
      scrollSnapAlign: {
        start: 'start',
      },
    },
    variants: {
      extend: {
        scrollSnapType: ['responsive'],
        scrollSnapAlign: ['responsive'],
      },
    },
  },
  
  plugins: [],
}