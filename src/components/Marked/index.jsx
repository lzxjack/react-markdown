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
