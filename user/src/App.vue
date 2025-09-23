<script setup>
	import { is_login } from "./utils/tools";

	onShow(() => {
		is_login()
	})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-plus/index.scss";

	.content {
		width: 100vw;
		box-sizing: border-box;
		/* 利用新增的 env() 和 constant() 特性，自动计算底部安全距离 */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	page {
		width: 100%;
		height: 100%;
		background: #f7f7f7;
	}

	.box {
		/* 成功状态的背景色 */
		color: #fff;
		/* 字体颜色 */
		border-radius: 10px;
		/* 圆角 */
		padding: 5px 10px;
		/* 内边距 */
		text-align: center;
		/* 文本居中 */
		font-size: 13px;
		/* 字体大小 */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		/* 添加阴影效果 */
		width: 85rpx;
	}

	.success-box {
		background-color: #4caf50;
	}

	.warning-box {
		background-color: #ff9800;
	}

	.danger-box {
		background-color: #f44336;
	}

	.primary-box {
		background-color: #2196f3;
	}
</style>
