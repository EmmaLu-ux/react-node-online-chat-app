# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

### Cookie







`sameSite`：

- 含义：限制浏览器在“跨站”请求中是否携带该 Cookie，用于防 CSRF 与跟踪控制。

- 可选值：
  - `lax`：默认值。仅在“同站”请求携带；以及顶级 GET 导航（如点击链接进入站点）会带。跨站 XHR/fetch 不带
  - `strict`：只在同站请求携带；从其它站点跳转/表单/XHR 都不带，最安全但影响最大
  - `none`：允许跨站请求携带，但必须同时设置 Secure（只能在 HTTPS 传输），否则浏览器直接拒绝该 Cookie

> 如果本地**开发模式**，访问地址一般是：`http://localhost:<port>`，按“schemeful same-site”规则属于“同站”（端口差异不影响 same-site 判断），所以用 `sameSite: "lax"`即可，XHR 会携带 Cookie。
>
> 如果生产模式，前后端不同站点（如前端在`app.example.com`，后端在`api.example.net`），属于跨站，请求要带 Cookie 就必须用 `sameSite: "none"`且`secure: true`（HTTPS）。
>
> Safari 浏览器更严格，`sameSite: none`时若不是 HTTPS 或没配置`secure`，会直接拒绝保存 Cookie，导致接口返回 401。

> [!TIP]
>
> 配置建议：
>
> - 开发模式（HTTP、本机 localhost）：`httpOnly: true, sameSite: "lax", secure: false`
> - 生产模式（HTTPS、跨站需要携带 Cookie）：`httpOnly: true, sameSite: "none", secure: true`







