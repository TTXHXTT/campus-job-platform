import uni from '@dcloudio/vite-plugin-uni'
import ViteImages from 'vite-plugin-vue-images'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
	plugins: [
		uni(),
		ViteImages({ dirs: ['src/static'] }),
		AutoImport({
			imports: ['vue', 'uni-app'],
		})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			"@components": fileURLToPath(new URL("./src/components", import.meta.url)),
			"@static": fileURLToPath(new URL("./src/static", import.meta.url)),
		}
	},
	// build打包构建配置
	build: {
		// 打包输出的文件夹名称
		outDir: 'dist',
		// 静态资源文件保存的文件夹名称
		assetsDir: 'assets',
		// 是否启用css代码拆分
		cssCodeSplit: false,
		// 打包构建后是否生成 source map 文件。
		sourcemap: false,
		// 关闭文件计算
		reportCompressedSize: false,
		// 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
		assetsInlineLimit: 0,
		// 分包
		rollupOptions: {
			output: {
				// manualChunks(id) {
				//     if (id.includes('node_modules')) {
				//         return 'vendor'
				//     }
				// },
				assetFileNames(assetInfo) {
					if (assetInfo.name.endsWith('.css')) {
						return 'css/[name].[hash].css'
					}
					if (assetInfo.name.endsWith('.js')) {
						return 'js/[name].[hash].js'
					}
					if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].some(ext => assetInfo.name.endsWith(ext))) {
						return 'images/[name].[hash].[ext]'
					}
					return '[ext]/[name].[hash].[ext]'
				}
			}
		}
	}
})
