# 项目说明

万岁山网页设计项目

## 目录结构与文件职责

```
d:\wss
├─ index.html
├─ package.json                #项目依赖、脚本命令与元数据
├─ package-lock.json           #依赖版本，尽量保证大家环境一致吧，我用的都是比较新的，直接pull下来吧
├─ vite.config.js              #Vite配置入口
├─ public/                     #静态资源目录，建议每个网页打包一下，全堆进来有点乱;
|                               代码里面引用的时候直接'/'开头就行，比如'/Loadingpage/xxxx'
│
├─ src/
│  ├─ main.js                  #应用入口创建Vue实例并注册路由
│  ├─ App.vue                  #顶层布局，只渲染<RouterView/>
│  ├─ router/
│  │  └─ index.js              #路由集中配置，目前写的是指向加载页
│  ├─ views/
│  │  └─ LoadingPage.vue       #加载页，后面添加新的页面也在这个目录写
│  ├─ assets/
│  │  ├─ base.css              #全局基础样式与颜色变量
│  │  └─ main.css              #全局自定义样式（字体、深色背景等）
│  └─ components/              #vue自带的组件，我给删了
└─ node_modules/               #依赖目录
```

## 协作说明

- **页面扩展**：在`src/views`新建页面，然后到`src/router/index.js`注册路由即可。
- **全局样式**：通用的样式放在`src/assets/main.css`和`src/assets/base.css`,子页面想另外定制再单独写，尽量别冲突。
- **资源文件**：需要静态引用的图片、视频放在`public/`下，也可以在组件里通过`import`引入。

闲着没事多写写readme，大家


## 建立新页面示例（AI跑的）

1. 在 `src/views` 下创建文件 `AboutPage.vue`：

   ```vue
   <template>
     <section class="about">
       <h1>关于我们</h1>
       <p>这里写团队或项目介绍。</p>
     </section>
   </template>

   <style scoped>
   .about {
     padding: 80px 48px;
     color: #f0f3f5;
   }
   </style>
   ```

2. 打开 `src/router/index.js`，在 `routes` 数组追加：

   ```js
   {
     path: '/about',
     name: 'About',
     component: () => import('../views/AboutPage.vue')
   }
   ```

   > 这里用 `() => import()` 做按需加载，访问到 `/about` 时才会拉取对应页面，首屏包更小。

3. 页面跳转方式：

   - 模板里 `<RouterLink to="/about">关于我们</RouterLink>`
   - 逻辑里 `router.push('/about')`

然后npm run dev就行


2025/10/26 Huyume
Exhibition是我写的占位用的第三页 后续可以直接拿这个ExhibitionPlaceholder.vue开发 路由已经挂载好了

