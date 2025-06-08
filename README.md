# 在线文档

一个开源的在线文档服务，具备基本的文档编辑功能，只需一行代码即可接入到你的项目中

```js
const content = `<p>我是富文本</p>`

// 打开在线文档窗口，返回编辑后的内容
const content2 = await import('xxxxx').then(e => e.openDoc({ content }))
```

## 特征

- [x] 开源免费，本地部署
- [x] 一行代码接入现有项目
- [ ] 支持多种格式导出 `docx` `pdf` `html` `md` `png` `svg`
- [ ] 多人实时编辑
- [ ] AI 智能辅助