import theme from "@nuxt/content-theme-docs";

export default theme({
  docs: {
    primaryColor: "#2d3c7d"
  },
  loading: { color: "#00CD81" },
  generate: {
    fallback: "404.html", // for Netlify
    routes: ["/"] // give the first url to start crawling
  },
  router: {
    base: "/share/"
  },
  i18n: {
    locales: () => [
      {
        code: "en",
        iso: "en-US",
        file: "en-US.js",
        name: "English"
      }
    ],
    defaultLocale: "en"
  },
  content: {
    liveEdit: false
  },
  buildModules: [],
  build: {
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]]
    }
  }
});
