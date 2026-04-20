# 用手机打开原型（免本机 IP）

本仓库是纯静态页，无需构建。把文件丢到托管站即可得到一条 `https://` 链接，任意网络下的手机都能打开。

## 推荐：Netlify Drop

1. 打开 [https://app.netlify.com/drop](https://app.netlify.com/drop) 并登录（可用 GitHub / 邮箱）。
2. **上传方式二选一**：
   - 把整个 **`dora-prototype` 文件夹**拖进页面；或  
   - 只打包 **`index.html`、`styles.css`、`app.js`** 三个文件为 zip 后拖入。
3. 等待部署完成，复制生成的 **`https://xxxx.netlify.app`**（或类似域名），在手机浏览器打开即可。

## 需要一起上传的文件

| 文件 | 说明 |
|------|------|
| `index.html` | 入口页 |
| `styles.css` | 样式 |
| `app.js` | 交互逻辑 |

`.cursor/` 等开发用目录不必上传。

## 说明

- 页面里的 **iconfont**、**Figma MCP 图片链接** 依赖外网；手机需能访问公网。
- Figma 资源链接若日后失效，需在设计里重新导出或换成本地/稳定图床地址。
- 同类服务也可行：Vercel「Import」静态目录、Cloudflare Pages 拖拽上传等，思路相同。

## 本机预览（可选）

```bash
cd /Users/mac/Projects/dora-prototype && python3 -m http.server 8888 --bind 0.0.0.0
```

浏览器访问 `http://127.0.0.1:8888/`；局域网设备用本机 IP 替代 `127.0.0.1`（需同 Wi‑Fi、注意防火墙）。
