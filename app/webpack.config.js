const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env = {}) => {
  const browser = env.browser;
  if (!["chrome", "firefox", "safari"].includes(browser)) {
    throw new Error("Specify --env browser=chrome, firefox, or safari");
  }

  return {
    entry: {
      background: "./src/background.ts",
      content: "./src/content.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist", browser),
      filename: "[name].js",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".js"],
      fallback: {
        url: false,
        util: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: "public/icons", to: "icons" },
          { from: `public/manifest.${browser}.json`, to: "manifest.json" },
          {
            from: path.resolve(__dirname, "../LICENSE"),
            to: "LICENSE",
            toType: "file",
          },
          { from: path.resolve(__dirname, "../NOTICE.md"), to: "NOTICE.md" },
        ],
      }),
    ],
  };
};
