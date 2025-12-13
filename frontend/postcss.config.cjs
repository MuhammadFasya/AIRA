// CommonJS PostCSS config so `require()` works even when package.json has "type": "module"
module.exports = {
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
