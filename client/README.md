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



```javascript
const cookieOptions = {
    maxAge,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
}
```

##### 说明：

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





---

### 联合类型



```typescript
// NOTE: 可判别联合，根据 isGroup 属性区分 contacts 的类型
type Props =
  | { isGroup: true; contacts: GroupChatInfo[] }
  | { isGroup?: false; contacts: AuthUserInfo[] }
```

##### 说明：

这里的竖线是 TypeScript 的联合类型运算符 `|`，不是 JavaScript 的逻辑或 `||`。之所以看到两条，是因为把联合类型的两个分支分行书写，每行前面各写一个 `|`，更易读。

这是典型的**可判别联合类型**，用布尔字面量属性`isGroup`作为判别字段。

- 当 `isGroup` 为 `true` 时，`contacts` 一定是 `GroupChatInfo[]`。
- 当 `isGroup` 为 `false` 或未传时（因为是可选 `?`），`contacts` 一定是 `AuthUserInfo[]`。

- 可选让你在“个人联系人列表”的场景下可以不传 `isGroup`，默认走非群组分支；若传则必须为 `false`。

> 判别联合的核心用途是为“多变体数据”建模，并让 TypeScript在分支中进行类型收窄；但它不止于收窄，还能做穷尽性检查、表达不可能状态为不可能。

**可判别联合类型**属于联合类型的一种使用模式，本质上是“带标签的联合类型”。其他还有：

- 原始联合：`string | number | boolean`
- 字面量联合：`'online' | 'offline' | 'busy'`（常用来做状态/枚举）
- 可空联合；`T | null | undefined`（可选值/空值）
- 对象/接口联合：`{a: number} | {b: string}`（需先收窄再访问属性）
- 可判别联合：带标签字段的对象联合，如`{type: 'group', ...} | {type: 'user', ...}`
- 函数类型联合：`((x:string) => void) | ((x: number) => void)`（通常不能直接调用，需先收窄）
- 数组/元祖联合：
  - `string[] | number[]`与`(string | number)[]`不同
  - 元祖联合：`[number, string] | [string, number]`
- 枚举字面量联合：`Enum.A | Enum.B`或仅枚举成员的字面量类型
- 键名联合：`keyof T`得到属性名的联合，常配合`Record<K,V>`
- 泛型中的联合：`Array<T | U>` vs `Array<T> | Array<U>`行为不同
- 条件类型与联合的分发：`T extends X ? A : B`会对联合的每个成员分发判断

收窄手段：

- `typeof`、`instanceof`、`in`检查
- 字面量比较：`if(x.type === 'group')`
- 用户自定义类型保护：`function isGroup(x: Props): x is GroupProps{...}`









