import { defineUserConfig } from "@vuepress/cli";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { getDirname, path } from "@vuepress/utils";
import { addViteOptimizeDepsInclude } from "vuepress-shared/node";
import type { UserConfig } from "@vuepress/cli";

const __dirname = getDirname(import.meta.url);

const IS_GITEE = "GITEE" in process.env;
const IS_NETLIFY = "NETLIFY" in process.env;
const IS_GITHUB = !IS_GITEE && !IS_NETLIFY;

export interface ConfigOptions {
  name: string;
  base?: string;
  indexName?: string | false;
}

export const config = (
  { name, base = name.replace(/\d+$/, ""), indexName }: ConfigOptions,
  { alias = {}, plugins = [], ...config }: UserConfig
): UserConfig => {
  const docsBase = IS_NETLIFY
    ? "/"
    : base
    ? <`/${string}/`>`/v2/${base}/`
    : "/v2/";
  const docsearchIndexName =
    indexName === false ? false : `vuepress-theme-hope-${indexName || name}`;

  return defineUserConfig({
    base: docsBase,

    dest: "./dist",

    markdown: {
      code: {
        lineNumbers: 10,
      },
    },

    plugins: [
      ...(docsearchIndexName
        ? [
            docsearchPlugin({
              appId: "VXIEHELDL1",
              apiKey: "595796f71b6ba14326719682c3738c0c",
              indexName: docsearchIndexName,
              locales: {
                "/zh/": {
                  placeholder: "搜索文档",
                  translations: {
                    button: {
                      buttonText: "搜索文档",
                      buttonAriaLabel: "搜索文档",
                    },
                    modal: {
                      searchBox: {
                        resetButtonTitle: "清除查询条件",
                        resetButtonAriaLabel: "清除查询条件",
                        cancelButtonText: "取消",
                        cancelButtonAriaLabel: "取消",
                      },
                      startScreen: {
                        recentSearchesTitle: "搜索历史",
                        noRecentSearchesText: "没有搜索历史",
                        saveRecentSearchButtonTitle: "保存至搜索历史",
                        removeRecentSearchButtonTitle: "从搜索历史中移除",
                        favoriteSearchesTitle: "收藏",
                        removeFavoriteSearchButtonTitle: "从收藏中移除",
                      },
                      errorScreen: {
                        titleText: "无法获取结果",
                        helpText: "你可能需要检查你的网络连接",
                      },
                      footer: {
                        selectText: "选择",
                        navigateText: "切换",
                        closeText: "关闭",
                        searchByText: "搜索提供者",
                      },
                      noResultsScreen: {
                        noResultsText: "无法找到相关结果",
                        suggestedQueryText: "你可以尝试查询",
                        reportMissingResultsText: "你认为该查询应该有结果？",
                        reportMissingResultsLinkText: "点击反馈",
                      },
                    },
                  },
                },
              },
            }),
          ]
        : []),

      ...plugins,
    ],

    alias: {
      "@NetlifyBadge": path.resolve(__dirname, "./components/NetlifyBadge.js"),
      "@theme-hope/components/HomeHero": path.resolve(
        __dirname,
        "./components/HopeHero.js"
      ),
      ...alias,
    },

    define: () => ({ IS_GITEE, IS_GITHUB, IS_NETLIFY }),

    extendsBundlerOptions: (config: unknown, app): void => {
      addViteOptimizeDepsInclude({ app, config }, [
        "three",
        "three/examples/jsm/controls/OrbitControls",
        "three/examples/jsm/loaders/STLLoader",
      ]);
    },

    shouldPrefetch: false,

    clientConfigFile: path.resolve(__dirname, "./client.js"),

    ...config,
  });
};
