const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env = {}) => {
  const browser = env.browser;
  if (!["chrome", "firefox"].includes(browser)) {
    throw new Error("Specify --env browser=chrome or --env browser=firefox");
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
          { from: "LICENSE", to: "LICENSE", toType: "file" },
          { from: "NOTICE.md", to: "NOTICE.md" },
        ],
      }),
    ],
  };
};
