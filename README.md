# 在线文档

[在线预览](https://huodoushigemi.github.io/online-doc)

一个开源的在线文档服务，具备基本的文档编辑功能

## 使用

只需一行代码即可接入到你的项目中

```js
const content = `<p>我是富文本</p>`

// 打开在线文档窗口，返回编辑后的内容
const content2 = await import('https://huodoushigemi.github.io/online-doc/function.js').then(e => e.openDoc({ content }))
```

## 特征

- [x] 开源免费，本地部署
- [x] 免安装依赖，一行代码接入现有项目
- [x] 支持多种格式导出 `docx` `pdf` `html` `md` `png` `svg`
- [ ] AI 智能辅助
- [ ] 多人实时编辑
