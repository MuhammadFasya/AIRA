// ESM PostCSS config: import plugins and export default so it works when
// project uses "type": "module" in package.json.
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwind(), autoprefixer()],
};
