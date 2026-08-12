// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/AIWorkspace/04Products/00Platform/base/ui/admin-ui/.yarn/__virtual__/vite-virtual-452f0edfa3/8/C:/Users/-/AppData/Local/Yarn/Berry/cache/vite-npm-6.4.1-67e9cf9ded-10c0.zip/node_modules/vite/dist/node/index.js";
import path2 from "path";

// vite/plugins/index.js
import vue from "file:///D:/AIWorkspace/04Products/00Platform/base/ui/admin-ui/.yarn/__virtual__/@vitejs-plugin-vue-virtual-6479c21349/8/C:/Users/-/AppData/Local/Yarn/Berry/cache/@vitejs-plugin-vue-npm-5.2.4-157bde6453-10c0.zip/node_modules/@vitejs/plugin-vue/dist/index.mjs";

// vite/plugins/auto-import.js
import autoImport from "file:///D:/AIWorkspace/04Products/00Platform/base/ui/admin-ui/.yarn/__virtual__/unplugin-auto-import-virtual-e86f9bd392/8/C:/Users/-/AppData/Local/Yarn/Berry/cache/unplugin-auto-import-npm-0.18.6-e5399339c4-10c0.zip/node_modules/unplugin-auto-import/dist/vite.js";
function createAutoImport() {
  return autoImport({
    imports: [
      "vue",
      "vue-router",
      "pinia"
    ],
    dts: false
  });
}

// vite/plugins/svg-icon.js
import { createSvgIconsPlugin } from "file:///D:/AIWorkspace/04Products/00Platform/base/ui/admin-ui/.yarn/__virtual__/vite-plugin-svg-icons-virtual-9a365bb9bc/8/C:/Users/-/AppData/Local/Yarn/Berry/cache/vite-plugin-svg-icons-npm-2.0.1-aaab905766-10c0.zip/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
function createSvgIcon(isBuild) {
  return createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
    symbolId: "icon-[dir]-[name]",
    svgoOptions: isBuild
  });
}

// vite/plugins/compression.js
import compression from "file:///D:/AIWorkspace/04Products/00Platform/base/ui/admin-ui/.yarn/__virtual__/vite-plugin-compression-virtual-37f574a74f/8/C:/Users/-/AppData/Local/Yarn/Berry/cache/vite-plugin-compression-npm-0.5.1-6054c7256e-10c0.zip/node_modules/vite-plugin-compression/dist/index.mjs";
function createCompression(env) {
  const { VITE_BUILD_COMPRESS } = env;
  const plugin = [];
  if (VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(",");
    if (compressList.includes("gzip")) {
      plugin.push(
        compression({
          ext: ".gz",
          deleteOriginFile: false
        })
      );
    }
    if (compressList.includes("brotli")) {
      plugin.push(
        compression({
          ext: ".br",
          algorithm: "brotliCompress",
          deleteOriginFile: false
        })
      );
    }
  }
  return plugin;
}

// vite/plugins/setup-extend.js
import setupExtend from "file:///C:/Users/-/AppData/Local/Yarn/Berry/cache/unplugin-vue-setup-extend-plus-npm-1.0.1-9a79cb9860-10c0.zip/node_modules/unplugin-vue-setup-extend-plus/dist/vite.js";
function createSetupExtend() {
  return setupExtend({});
}

// vite/plugins/index.js
function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()];
  vitePlugins.push(createAutoImport());
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(createSvgIcon(isBuild));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}

// vite.config.js
var __vite_injected_original_dirname = "D:\\AIWorkspace\\04Products\\00Platform\\base\\ui\\admin-ui";
var baseUrl = "http://localhost:8080";
var vite_config_default = defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === "production" ? "/" : "/",
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": path2.resolve(__vite_injected_original_dirname, "./"),
        // 设置别名
        "@": path2.resolve(__vite_injected_original_dirname, "./src")
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
    },
    // 打包配置
    build: {
      // https://vite.dev/config/build-options.html
      sourcemap: command === "build" ? false : "inline",
      outDir: "dist",
      assetsDir: "assets",
      chunkSizeWarningLimit: 2e3,
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    // vite 相关配置
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        "/dev-api": {
          target: baseUrl,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, "")
        },
        // springdoc proxy
        "^/v3/api-docs/(.*)": {
          target: baseUrl,
          changeOrigin: true
        }
      }
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAidml0ZS9wbHVnaW5zL2luZGV4LmpzIiwgInZpdGUvcGx1Z2lucy9hdXRvLWltcG9ydC5qcyIsICJ2aXRlL3BsdWdpbnMvc3ZnLWljb24uanMiLCAidml0ZS9wbHVnaW5zL2NvbXByZXNzaW9uLmpzIiwgInZpdGUvcGx1Z2lucy9zZXR1cC1leHRlbmQuanMiXSwKICAic291cmNlUm9vdCI6ICJEOlxcQUlXb3Jrc3BhY2VcXDA0UHJvZHVjdHNcXDAwUGxhdGZvcm1cXGJhc2VcXHVpXFxhZG1pbi11aVxcIiwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBSVdvcmtzcGFjZVxcXFwwNFByb2R1Y3RzXFxcXDAwUGxhdGZvcm1cXFxcYmFzZVxcXFx1aVxcXFxhZG1pbi11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQUlXb3Jrc3BhY2VcXFxcMDRQcm9kdWN0c1xcXFwwMFBsYXRmb3JtXFxcXGJhc2VcXFxcdWlcXFxcYWRtaW4tdWlcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FJV29ya3NwYWNlLzA0UHJvZHVjdHMvMDBQbGF0Zm9ybS9iYXNlL3VpL2FkbWluLXVpL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IGNyZWF0ZVZpdGVQbHVnaW5zIGZyb20gJy4vdml0ZS9wbHVnaW5zJ1xyXG5cclxuY29uc3QgYmFzZVVybCA9ICdodHRwOi8vbG9jYWxob3N0OjgwODAnIC8vIFx1NTQwRVx1N0FFRlx1NjNBNVx1NTNFM1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUsIGNvbW1hbmQgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcclxuICBjb25zdCB7IFZJVEVfQVBQX0VOViB9ID0gZW52XHJcbiAgcmV0dXJuIHtcclxuICAgIC8vIFx1OTBFOFx1N0Y3Mlx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTQ4Q1x1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NzY4NFVSTFx1MzAwMlxyXG4gICAgLy8gXHU5RUQ4XHU4QkE0XHU2MEM1XHU1MUI1XHU0RTBCXHVGRjBDdml0ZSBcdTRGMUFcdTUwNDdcdThCQkVcdTRGNjBcdTc2ODRcdTVFOTRcdTc1MjhcdTY2MkZcdTg4QUJcdTkwRThcdTdGNzJcdTU3MjhcdTRFMDBcdTRFMkFcdTU3REZcdTU0MERcdTc2ODRcdTY4MzlcdThERUZcdTVGODRcdTRFMEFcclxuICAgIC8vIFx1NEY4Qlx1NTk4MiBodHRwczovL3d3dy5ydW95aS52aXAvXHUzMDAyXHU1OTgyXHU2NzlDXHU1RTk0XHU3NTI4XHU4OEFCXHU5MEU4XHU3RjcyXHU1NzI4XHU0RTAwXHU0RTJBXHU1QjUwXHU4REVGXHU1Rjg0XHU0RTBBXHVGRjBDXHU0RjYwXHU1QzMxXHU5NzAwXHU4OTgxXHU3NTI4XHU4RkQ5XHU0RTJBXHU5MDA5XHU5ODc5XHU2MzA3XHU1QjlBXHU4RkQ5XHU0RTJBXHU1QjUwXHU4REVGXHU1Rjg0XHUzMDAyXHU0RjhCXHU1OTgyXHVGRjBDXHU1OTgyXHU2NzlDXHU0RjYwXHU3Njg0XHU1RTk0XHU3NTI4XHU4OEFCXHU5MEU4XHU3RjcyXHU1NzI4IGh0dHBzOi8vd3d3LnJ1b3lpLnZpcC9hZG1pbi9cdUZGMENcdTUyMTlcdThCQkVcdTdGNkUgYmFzZVVybCBcdTRFM0EgL2FkbWluL1x1MzAwMlxyXG4gICAgYmFzZTogVklURV9BUFBfRU5WID09PSAncHJvZHVjdGlvbicgPyAnLycgOiAnLycsXHJcbiAgICBwbHVnaW5zOiBjcmVhdGVWaXRlUGx1Z2lucyhlbnYsIGNvbW1hbmQgPT09ICdidWlsZCcpLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAvLyBodHRwczovL2NuLnZpdGVqcy5kZXYvY29uZmlnLyNyZXNvbHZlLWFsaWFzXHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU4REVGXHU1Rjg0XHJcbiAgICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcclxuICAgICAgICAvLyBcdThCQkVcdTdGNkVcdTUyMkJcdTU0MERcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIGh0dHBzOi8vY24udml0ZWpzLmRldi9jb25maWcvI3Jlc29sdmUtZXh0ZW5zaW9uc1xyXG4gICAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nLCAnLnZ1ZSddXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2MjUzXHU1MzA1XHU5MTREXHU3RjZFXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAvLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9idWlsZC1vcHRpb25zLmh0bWxcclxuICAgICAgc291cmNlbWFwOiBjb21tYW5kID09PSAnYnVpbGQnID8gZmFsc2UgOiAnaW5saW5lJyxcclxuICAgICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnc3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gdml0ZSBcdTc2RjhcdTUxNzNcdTkxNERcdTdGNkVcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA4MCxcclxuICAgICAgaG9zdDogdHJ1ZSxcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAvLyBodHRwczovL2NuLnZpdGVqcy5kZXYvY29uZmlnLyNzZXJ2ZXItcHJveHlcclxuICAgICAgICAnL2Rldi1hcGknOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGJhc2VVcmwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocCkgPT4gcC5yZXBsYWNlKC9eXFwvZGV2LWFwaS8sICcnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgIC8vIHNwcmluZ2RvYyBwcm94eVxyXG4gICAgICAgICAnXi92My9hcGktZG9jcy8oLiopJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBiYXNlVXJsLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwb3N0Y3NzOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBwb3N0Y3NzUGx1Z2luOiAnaW50ZXJuYWw6Y2hhcnNldC1yZW1vdmFsJyxcclxuICAgICAgICAgICAgQXRSdWxlOiB7XHJcbiAgICAgICAgICAgICAgY2hhcnNldDogKGF0UnVsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0UnVsZS5uYW1lID09PSAnY2hhcnNldCcpIHtcclxuICAgICAgICAgICAgICAgICAgYXRSdWxlLnJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFJV29ya3NwYWNlXFxcXDA0UHJvZHVjdHNcXFxcMDBQbGF0Zm9ybVxcXFxiYXNlXFxcXHVpXFxcXGFkbWluLXVpXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQUlXb3Jrc3BhY2VcXFxcMDRQcm9kdWN0c1xcXFwwMFBsYXRmb3JtXFxcXGJhc2VcXFxcdWlcXFxcYWRtaW4tdWlcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXGluZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BSVdvcmtzcGFjZS8wNFByb2R1Y3RzLzAwUGxhdGZvcm0vYmFzZS91aS9hZG1pbi11aS92aXRlL3BsdWdpbnMvaW5kZXguanNcIjtpbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuXHJcbmltcG9ydCBjcmVhdGVBdXRvSW1wb3J0IGZyb20gJy4vYXV0by1pbXBvcnQnXHJcbmltcG9ydCBjcmVhdGVTdmdJY29uIGZyb20gJy4vc3ZnLWljb24nXHJcbmltcG9ydCBjcmVhdGVDb21wcmVzc2lvbiBmcm9tICcuL2NvbXByZXNzaW9uJ1xyXG5pbXBvcnQgY3JlYXRlU2V0dXBFeHRlbmQgZnJvbSAnLi9zZXR1cC1leHRlbmQnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVWaXRlUGx1Z2lucyh2aXRlRW52LCBpc0J1aWxkID0gZmFsc2UpIHtcclxuICBjb25zdCB2aXRlUGx1Z2lucyA9IFt2dWUoKV1cclxuICB2aXRlUGx1Z2lucy5wdXNoKGNyZWF0ZUF1dG9JbXBvcnQoKSlcclxuICB2aXRlUGx1Z2lucy5wdXNoKGNyZWF0ZVNldHVwRXh0ZW5kKCkpXHJcbiAgdml0ZVBsdWdpbnMucHVzaChjcmVhdGVTdmdJY29uKGlzQnVpbGQpKVxyXG4gIGlzQnVpbGQgJiYgdml0ZVBsdWdpbnMucHVzaCguLi5jcmVhdGVDb21wcmVzc2lvbih2aXRlRW52KSlcclxuICByZXR1cm4gdml0ZVBsdWdpbnNcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFJV29ya3NwYWNlXFxcXDA0UHJvZHVjdHNcXFxcMDBQbGF0Zm9ybVxcXFxiYXNlXFxcXHVpXFxcXGFkbWluLXVpXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQUlXb3Jrc3BhY2VcXFxcMDRQcm9kdWN0c1xcXFwwMFBsYXRmb3JtXFxcXGJhc2VcXFxcdWlcXFxcYWRtaW4tdWlcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXGF1dG8taW1wb3J0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BSVdvcmtzcGFjZS8wNFByb2R1Y3RzLzAwUGxhdGZvcm0vYmFzZS91aS9hZG1pbi11aS92aXRlL3BsdWdpbnMvYXV0by1pbXBvcnQuanNcIjtpbXBvcnQgYXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQXV0b0ltcG9ydCgpIHtcclxuICByZXR1cm4gYXV0b0ltcG9ydCh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICd2dWUnLFxyXG4gICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICdwaW5pYSdcclxuICAgIF0sXHJcbiAgICBkdHM6IGZhbHNlXHJcbiAgfSlcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFJV29ya3NwYWNlXFxcXDA0UHJvZHVjdHNcXFxcMDBQbGF0Zm9ybVxcXFxiYXNlXFxcXHVpXFxcXGFkbWluLXVpXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQUlXb3Jrc3BhY2VcXFxcMDRQcm9kdWN0c1xcXFwwMFBsYXRmb3JtXFxcXGJhc2VcXFxcdWlcXFxcYWRtaW4tdWlcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXHN2Zy1pY29uLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BSVdvcmtzcGFjZS8wNFByb2R1Y3RzLzAwUGxhdGZvcm0vYmFzZS91aS9hZG1pbi11aS92aXRlL3BsdWdpbnMvc3ZnLWljb24uanNcIjtpbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVN2Z0ljb24oaXNCdWlsZCkge1xyXG4gIHJldHVybiBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucy9zdmcnKV0sXHJcbiAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJyxcclxuICAgIHN2Z29PcHRpb25zOiBpc0J1aWxkXHJcbiAgfSlcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFJV29ya3NwYWNlXFxcXDA0UHJvZHVjdHNcXFxcMDBQbGF0Zm9ybVxcXFxiYXNlXFxcXHVpXFxcXGFkbWluLXVpXFxcXHZpdGVcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQUlXb3Jrc3BhY2VcXFxcMDRQcm9kdWN0c1xcXFwwMFBsYXRmb3JtXFxcXGJhc2VcXFxcdWlcXFxcYWRtaW4tdWlcXFxcdml0ZVxcXFxwbHVnaW5zXFxcXGNvbXByZXNzaW9uLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BSVdvcmtzcGFjZS8wNFByb2R1Y3RzLzAwUGxhdGZvcm0vYmFzZS91aS9hZG1pbi11aS92aXRlL3BsdWdpbnMvY29tcHJlc3Npb24uanNcIjtpbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDb21wcmVzc2lvbihlbnYpIHtcclxuICBjb25zdCB7IFZJVEVfQlVJTERfQ09NUFJFU1MgfSA9IGVudlxyXG4gIGNvbnN0IHBsdWdpbiA9IFtdXHJcbiAgaWYgKFZJVEVfQlVJTERfQ09NUFJFU1MpIHtcclxuICAgIGNvbnN0IGNvbXByZXNzTGlzdCA9IFZJVEVfQlVJTERfQ09NUFJFU1Muc3BsaXQoJywnKVxyXG4gICAgaWYgKGNvbXByZXNzTGlzdC5pbmNsdWRlcygnZ3ppcCcpKSB7XHJcbiAgICAgIC8vIGh0dHA6Ly9kb2MucnVveWkudmlwL3J1b3lpLXZ1ZS9vdGhlci9mYXEuaHRtbCNcdTRGN0ZcdTc1MjhnemlwXHU4OUUzXHU1MzhCXHU3RjI5XHU5NzU5XHU2MDAxXHU2NTg3XHU0RUY2XHJcbiAgICAgIHBsdWdpbi5wdXNoKFxyXG4gICAgICAgIGNvbXByZXNzaW9uKHtcclxuICAgICAgICAgIGV4dDogJy5neicsXHJcbiAgICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGlmIChjb21wcmVzc0xpc3QuaW5jbHVkZXMoJ2Jyb3RsaScpKSB7XHJcbiAgICAgIHBsdWdpbi5wdXNoKFxyXG4gICAgICAgIGNvbXByZXNzaW9uKHtcclxuICAgICAgICAgIGV4dDogJy5icicsXHJcbiAgICAgICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXHJcbiAgICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHBsdWdpblxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcQUlXb3Jrc3BhY2VcXFxcMDRQcm9kdWN0c1xcXFwwMFBsYXRmb3JtXFxcXGJhc2VcXFxcdWlcXFxcYWRtaW4tdWlcXFxcdml0ZVxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxBSVdvcmtzcGFjZVxcXFwwNFByb2R1Y3RzXFxcXDAwUGxhdGZvcm1cXFxcYmFzZVxcXFx1aVxcXFxhZG1pbi11aVxcXFx2aXRlXFxcXHBsdWdpbnNcXFxcc2V0dXAtZXh0ZW5kLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BSVdvcmtzcGFjZS8wNFByb2R1Y3RzLzAwUGxhdGZvcm0vYmFzZS91aS9hZG1pbi11aS92aXRlL3BsdWdpbnMvc2V0dXAtZXh0ZW5kLmpzXCI7aW1wb3J0IHNldHVwRXh0ZW5kIGZyb20gJ3VucGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQtcGx1cy92aXRlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2V0dXBFeHRlbmQoKSB7XHJcbiAgcmV0dXJuIHNldHVwRXh0ZW5kKHt9KVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1YsU0FBUyxjQUFjLGVBQWU7QUFDclksT0FBT0EsV0FBVTs7O0FDRDZX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
