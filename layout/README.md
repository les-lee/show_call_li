# 布局相关

- 思路清奇的取消状态,可用于点击空白关闭弹框或隐藏侧边栏.

来源:**(vuepress 默认主题)**

```html
<div
  class="sidebar-mask"
  @click="toggleSidebar(false)"
></div>
```

```css
.sidebar-mask {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
}
```

- 