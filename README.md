# 1. 实现效果

最近在用React写一个博客管理系统，有一个功能是添加新文章。在新建文章的页面，我希望做到像CSDN这样，左边是编辑区（markdown格式），右边是预览区。实时更新，编辑文本的同时，在预览区就能看到效果。

就自己动手实现了一个这样的组件，**markdown实时预览编辑器**！

具体效果如下：

![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20210705181127.gif)

# 2. 实现过程

使用React实现，做成单独的一个组件。

首先HTML结构如下：

```html
<header>基于React的markdown实时编辑器</header>
<div className="marked">
    {/* 编辑区 */}
    <div className="input-region markdownStyle"></div>
    {/* 预览区 */}
    <div className="show-region markdownStyle"></div>
</div>
```

稍微写一点样式，让编辑区和预览区左右布局。

定义一个`hook`，存储输入的内容：

```javascript
const [text, setText] = useState('');
```

左边编辑区，让一个`div`可编辑，给其加上`contentEditable`属性，并让值为`plaintext-only`，表示编辑区域只能输入**纯文本**。

```html
<div className="input-region markdownStyle" contentEditable="plaintext-only"></div>
```

> 为什么不用`textarea`：
>
> `div`高度可自适应，可以拿到纯文本。

当左边编辑区内容改变时，将输入的纯文本存入到`state`，给编辑区的`div`加上`onInput`属性，通过事件对象拿到纯文本：

```html
<div
    className="input-region markdownStyle"
    contentEditable="plaintext-only"
    onInput={e => {
        setText(e.target.innerText);
    }}
></div>
```

要渲染成`markdown`格式的内容，就需要插件来渲染，这里使用`marked`，代码高亮也有需求，使用`highlight.js`：

```powershell
yarn add marked highlight.js
```

```javascript
import marked from 'marked';
import hljs from 'highlight.js';
```

配置`marked`和`highlight`：

```javascript
useEffect(() => {
    // 配置highlight
    hljs.configure({
        tabReplace: '',
        classPrefix: 'hljs-',
        languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
    });
    // 配置marked
    marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: code => hljs.highlightAuto(code).value,
        gfm: true, //默认为true。 允许 Git Hub标准的markdown.
        tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
        breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
    });
}, []);
```

引入`github`风格的代码高亮主题，但我自己又稍作了修改：

```javascript
import './github-dark.css';
```

在预览区，使用React的标签属性dangerouslySetInnerHTMl来显示内容：

```html
<div
    className="show-region markdownStyle"
    dangerouslySetInnerHTML={{
        __html: marked(text).replace(/<pre>/g, "<pre id='hljs'>"),
    }}
></div>
```

调用`marked`将文本渲染成`markdown`格式的内容。后面加`replace`是因为，我发现渲染过后不显示**代码框背景色**，就在`<pre>`标签加上了`id`，然后自己写了CSS，让其显示代码框背景。

整个组件写好之后，最终的代码：

```javascript
import { useState, useEffect } from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
import './github-dark.css';
import './index.css';

const Marked = () => {
    const [text, setText] = useState('');
    useEffect(() => {
        // 配置highlight
        hljs.configure({
            tabReplace: '',
            classPrefix: 'hljs-',
            languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
        });
        // 配置marked
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: code => hljs.highlightAuto(code).value,
            gfm: true, //默认为true。 允许 Git Hub标准的markdown.
            tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
            breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
        });
    }, []);
    return (
        <>
            <header>基于React的markdown实时编辑器</header>
            <div className="marked">
                <div
                    className="input-region markdownStyle"
                    contentEditable="plaintext-only"
                    // suppressContentEditableWarning
                    onInput={e => {
                        setText(e.target.innerText);
                    }}
                ></div>
                <div
                    className="show-region markdownStyle"
                    dangerouslySetInnerHTML={{
                        __html: marked(text).replace(/<pre>/g, "<pre id='hljs'>"),
                    }}
                ></div>
            </div>
        </>
    );
};

export default Marked;
```

# 3. 源代码

其他代码，如**代码高亮主题文件**、**样式文件**，包括整个源代码，都放到了<a href="https://github.com/lzxjack/react-markdown" target="_blank">[Github]</a>上，需要自取。

如果对你有帮助，帮忙点个小心心❤️~

