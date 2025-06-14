const n=`/* light */\r
.markdown-body {\r
  color-scheme: light;\r
  -ms-text-size-adjust: 100%;\r
  -webkit-text-size-adjust: 100%;\r
  margin: 0;\r
  color: #1f2328;\r
  background-color: #ffffff;\r
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";\r
  font-size: 16px;\r
  line-height: 1.5;\r
  word-wrap: break-word;\r
  scroll-behavior: auto !important;\r
}\r
\r
.markdown-body .octicon {\r
  display: inline-block;\r
  fill: currentColor;\r
  vertical-align: text-bottom;\r
}\r
\r
.markdown-body h1:hover .anchor .octicon-link:before,\r
.markdown-body h2:hover .anchor .octicon-link:before,\r
.markdown-body h3:hover .anchor .octicon-link:before,\r
.markdown-body h4:hover .anchor .octicon-link:before,\r
.markdown-body h5:hover .anchor .octicon-link:before,\r
.markdown-body h6:hover .anchor .octicon-link:before {\r
  width: 16px;\r
  height: 16px;\r
  content: ' ';\r
  display: inline-block;\r
  background-color: currentColor;\r
  -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");\r
  mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");\r
}\r
\r
.markdown-body details,\r
.markdown-body figcaption,\r
.markdown-body figure {\r
  display: block;\r
}\r
\r
.markdown-body summary {\r
  display: list-item;\r
}\r
\r
.markdown-body [hidden] {\r
  display: none !important;\r
}\r
\r
.markdown-body a {\r
  background-color: transparent;\r
  color: #0969da;\r
  text-decoration: none;\r
}\r
\r
.markdown-body abbr[title] {\r
  border-bottom: none;\r
  -webkit-text-decoration: underline dotted;\r
  text-decoration: underline dotted;\r
}\r
\r
.markdown-body b,\r
.markdown-body strong {\r
  font-weight: 600;\r
}\r
\r
.markdown-body dfn {\r
  font-style: italic;\r
}\r
\r
.markdown-body h1 {\r
  margin: .67em 0;\r
  font-weight: 600;\r
  padding-bottom: .3em;\r
  font-size: 2em;\r
  border-bottom: 1px solid #d1d9e0b3;\r
}\r
\r
.markdown-body mark {\r
  background-color: #fff8c5;\r
  color: #1f2328;\r
}\r
\r
.markdown-body small {\r
  font-size: 90%;\r
}\r
\r
.markdown-body sub,\r
.markdown-body sup {\r
  font-size: 75%;\r
  line-height: 0;\r
  position: relative;\r
  vertical-align: baseline;\r
}\r
\r
.markdown-body sub {\r
  bottom: -0.25em;\r
}\r
\r
.markdown-body sup {\r
  top: -0.5em;\r
}\r
\r
.markdown-body img {\r
  border-style: none;\r
  max-width: 100%;\r
  box-sizing: content-box;\r
}\r
\r
.markdown-body code,\r
.markdown-body kbd,\r
.markdown-body pre,\r
.markdown-body samp {\r
  font-family: monospace;\r
  font-size: 1em;\r
}\r
\r
.markdown-body figure {\r
  margin: 1em 2.5rem;\r
}\r
\r
.markdown-body hr {\r
  box-sizing: content-box;\r
  overflow: hidden;\r
  background: transparent;\r
  border-bottom: 1px solid #d1d9e0b3;\r
  height: .25em;\r
  padding: 0;\r
  margin: 1.5rem 0;\r
  background-color: #d1d9e0;\r
  border: 0;\r
}\r
\r
.markdown-body input {\r
  font: inherit;\r
  margin: 0;\r
  overflow: visible;\r
  font-family: inherit;\r
  font-size: inherit;\r
  line-height: inherit;\r
}\r
\r
.markdown-body [type=button],\r
.markdown-body [type=reset],\r
.markdown-body [type=submit] {\r
  -webkit-appearance: button;\r
  appearance: button;\r
}\r
\r
.markdown-body [type=checkbox],\r
.markdown-body [type=radio] {\r
  box-sizing: border-box;\r
  padding: 0;\r
}\r
\r
.markdown-body [type=number]::-webkit-inner-spin-button,\r
.markdown-body [type=number]::-webkit-outer-spin-button {\r
  height: auto;\r
}\r
\r
.markdown-body [type=search]::-webkit-search-cancel-button,\r
.markdown-body [type=search]::-webkit-search-decoration {\r
  -webkit-appearance: none;\r
  appearance: none;\r
}\r
\r
.markdown-body ::-webkit-input-placeholder {\r
  color: inherit;\r
  opacity: .54;\r
}\r
\r
.markdown-body ::-webkit-file-upload-button {\r
  -webkit-appearance: button;\r
  appearance: button;\r
  font: inherit;\r
}\r
\r
.markdown-body a:hover {\r
  text-decoration: underline;\r
}\r
\r
.markdown-body ::placeholder {\r
  color: #59636e;\r
  opacity: 1;\r
}\r
\r
.markdown-body hr::before {\r
  display: table;\r
  content: "";\r
}\r
\r
.markdown-body hr::after {\r
  display: table;\r
  clear: both;\r
  content: "";\r
}\r
\r
.markdown-body table {\r
  border-spacing: 0;\r
  border-collapse: collapse;\r
  display: block;\r
  width: max-content;\r
  max-width: 100%;\r
  overflow: auto;\r
}\r
\r
.markdown-body td,\r
.markdown-body th {\r
  padding: 0;\r
}\r
\r
.markdown-body details summary {\r
  cursor: pointer;\r
}\r
\r
.markdown-body a:focus,\r
.markdown-body [role=button]:focus,\r
.markdown-body input[type=radio]:focus,\r
.markdown-body input[type=checkbox]:focus {\r
  outline: 2px solid #0969da;\r
  outline-offset: -2px;\r
  box-shadow: none;\r
}\r
\r
.markdown-body a:focus:not(:focus-visible),\r
.markdown-body [role=button]:focus:not(:focus-visible),\r
.markdown-body input[type=radio]:focus:not(:focus-visible),\r
.markdown-body input[type=checkbox]:focus:not(:focus-visible) {\r
  outline: solid 1px transparent;\r
}\r
\r
.markdown-body a:focus-visible,\r
.markdown-body [role=button]:focus-visible,\r
.markdown-body input[type=radio]:focus-visible,\r
.markdown-body input[type=checkbox]:focus-visible {\r
  outline: 2px solid #0969da;\r
  outline-offset: -2px;\r
  box-shadow: none;\r
}\r
\r
.markdown-body a:not([class]):focus,\r
.markdown-body a:not([class]):focus-visible,\r
.markdown-body input[type=radio]:focus,\r
.markdown-body input[type=radio]:focus-visible,\r
.markdown-body input[type=checkbox]:focus,\r
.markdown-body input[type=checkbox]:focus-visible {\r
  outline-offset: 0;\r
}\r
\r
.markdown-body kbd {\r
  display: inline-block;\r
  padding: 0.25rem;\r
  font: 11px ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;\r
  line-height: 10px;\r
  color: #1f2328;\r
  vertical-align: middle;\r
  background-color: #f6f8fa;\r
  border: solid 1px #d1d9e0b3;\r
  border-bottom-color: #d1d9e0b3;\r
  border-radius: 6px;\r
  box-shadow: inset 0 -1px 0 #d1d9e0b3;\r
}\r
\r
.markdown-body h1,\r
.markdown-body h2,\r
.markdown-body h3,\r
.markdown-body h4,\r
.markdown-body h5,\r
.markdown-body h6 {\r
  margin-top: 1.5rem;\r
  margin-bottom: 1rem;\r
  font-weight: 600;\r
  line-height: 1.25;\r
}\r
\r
.markdown-body h2 {\r
  font-weight: 600;\r
  padding-bottom: .3em;\r
  font-size: 1.5em;\r
  border-bottom: 1px solid #d1d9e0b3;\r
}\r
\r
.markdown-body h3 {\r
  font-weight: 600;\r
  font-size: 1.25em;\r
}\r
\r
.markdown-body h4 {\r
  font-weight: 600;\r
  font-size: 1em;\r
}\r
\r
.markdown-body h5 {\r
  font-weight: 600;\r
  font-size: .875em;\r
}\r
\r
.markdown-body h6 {\r
  font-weight: 600;\r
  font-size: .85em;\r
  color: #59636e;\r
}\r
\r
.markdown-body p {\r
  margin-top: 0;\r
  margin-bottom: 10px;\r
}\r
\r
.markdown-body blockquote {\r
  margin: 0;\r
  padding: 0 1em;\r
  color: #59636e;\r
  border-left: .25em solid #d1d9e0;\r
}\r
\r
.markdown-body ul,\r
.markdown-body ol {\r
  margin-top: 0;\r
  margin-bottom: 0;\r
  padding-left: 2em;\r
}\r
\r
.markdown-body ol ol,\r
.markdown-body ul ol {\r
  list-style-type: lower-roman;\r
}\r
\r
.markdown-body ul ul ol,\r
.markdown-body ul ol ol,\r
.markdown-body ol ul ol,\r
.markdown-body ol ol ol {\r
  list-style-type: lower-alpha;\r
}\r
\r
.markdown-body dd {\r
  margin-left: 0;\r
}\r
\r
.markdown-body tt,\r
.markdown-body code,\r
.markdown-body samp {\r
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;\r
  font-size: 12px;\r
}\r
\r
.markdown-body pre {\r
  margin-top: 0;\r
  margin-bottom: 0;\r
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;\r
  font-size: 12px;\r
  word-wrap: normal;\r
}\r
\r
.markdown-body .octicon {\r
  display: inline-block;\r
  overflow: visible !important;\r
  vertical-align: text-bottom;\r
  fill: currentColor;\r
}\r
\r
.markdown-body input::-webkit-outer-spin-button,\r
.markdown-body input::-webkit-inner-spin-button {\r
  margin: 0;\r
  -webkit-appearance: none;\r
  appearance: none;\r
}\r
\r
.markdown-body .mr-2 {\r
  margin-right: 0.5rem !important;\r
}\r
\r
.markdown-body::before {\r
  display: table;\r
  content: "";\r
}\r
\r
.markdown-body::after {\r
  display: table;\r
  clear: both;\r
  content: "";\r
}\r
\r
.markdown-body>*:first-child {\r
  margin-top: 0 !important;\r
}\r
\r
.markdown-body>*:last-child {\r
  margin-bottom: 0 !important;\r
}\r
\r
.markdown-body a:not([href]) {\r
  color: inherit;\r
  text-decoration: none;\r
}\r
\r
.markdown-body .absent {\r
  color: #d1242f;\r
}\r
\r
.markdown-body .anchor {\r
  float: left;\r
  padding-right: 0.25rem;\r
  margin-left: -20px;\r
  line-height: 1;\r
}\r
\r
.markdown-body .anchor:focus {\r
  outline: none;\r
}\r
\r
.markdown-body p,\r
.markdown-body blockquote,\r
.markdown-body ul,\r
.markdown-body ol,\r
.markdown-body dl,\r
.markdown-body table,\r
.markdown-body pre,\r
.markdown-body details {\r
  margin-top: 0;\r
  margin-bottom: 1rem;\r
}\r
\r
.markdown-body blockquote>:first-child {\r
  margin-top: 0;\r
}\r
\r
.markdown-body blockquote>:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.markdown-body h1 .octicon-link,\r
.markdown-body h2 .octicon-link,\r
.markdown-body h3 .octicon-link,\r
.markdown-body h4 .octicon-link,\r
.markdown-body h5 .octicon-link,\r
.markdown-body h6 .octicon-link {\r
  color: #1f2328;\r
  vertical-align: middle;\r
  visibility: hidden;\r
}\r
\r
.markdown-body h1:hover .anchor,\r
.markdown-body h2:hover .anchor,\r
.markdown-body h3:hover .anchor,\r
.markdown-body h4:hover .anchor,\r
.markdown-body h5:hover .anchor,\r
.markdown-body h6:hover .anchor {\r
  text-decoration: none;\r
}\r
\r
.markdown-body h1:hover .anchor .octicon-link,\r
.markdown-body h2:hover .anchor .octicon-link,\r
.markdown-body h3:hover .anchor .octicon-link,\r
.markdown-body h4:hover .anchor .octicon-link,\r
.markdown-body h5:hover .anchor .octicon-link,\r
.markdown-body h6:hover .anchor .octicon-link {\r
  visibility: visible;\r
}\r
\r
.markdown-body h1 tt,\r
.markdown-body h1 code,\r
.markdown-body h2 tt,\r
.markdown-body h2 code,\r
.markdown-body h3 tt,\r
.markdown-body h3 code,\r
.markdown-body h4 tt,\r
.markdown-body h4 code,\r
.markdown-body h5 tt,\r
.markdown-body h5 code,\r
.markdown-body h6 tt,\r
.markdown-body h6 code {\r
  padding: 0 .2em;\r
  font-size: inherit;\r
}\r
\r
.markdown-body summary h1,\r
.markdown-body summary h2,\r
.markdown-body summary h3,\r
.markdown-body summary h4,\r
.markdown-body summary h5,\r
.markdown-body summary h6 {\r
  display: inline-block;\r
}\r
\r
.markdown-body summary h1 .anchor,\r
.markdown-body summary h2 .anchor,\r
.markdown-body summary h3 .anchor,\r
.markdown-body summary h4 .anchor,\r
.markdown-body summary h5 .anchor,\r
.markdown-body summary h6 .anchor {\r
  margin-left: -40px;\r
}\r
\r
.markdown-body summary h1,\r
.markdown-body summary h2 {\r
  padding-bottom: 0;\r
  border-bottom: 0;\r
}\r
\r
.markdown-body ul.no-list,\r
.markdown-body ol.no-list {\r
  padding: 0;\r
  list-style-type: none;\r
}\r
\r
.markdown-body ol[type="a s"] {\r
  list-style-type: lower-alpha;\r
}\r
\r
.markdown-body ol[type="A s"] {\r
  list-style-type: upper-alpha;\r
}\r
\r
.markdown-body ol[type="i s"] {\r
  list-style-type: lower-roman;\r
}\r
\r
.markdown-body ol[type="I s"] {\r
  list-style-type: upper-roman;\r
}\r
\r
.markdown-body ol[type="1"] {\r
  list-style-type: decimal;\r
}\r
\r
.markdown-body div>ol:not([type]) {\r
  list-style-type: decimal;\r
}\r
\r
.markdown-body ul ul,\r
.markdown-body ul ol,\r
.markdown-body ol ol,\r
.markdown-body ol ul {\r
  margin-top: 0;\r
  margin-bottom: 0;\r
}\r
\r
.markdown-body li>p {\r
  margin-top: 1rem;\r
}\r
\r
.markdown-body li+li {\r
  margin-top: .25em;\r
}\r
\r
.markdown-body dl {\r
  padding: 0;\r
}\r
\r
.markdown-body dl dt {\r
  padding: 0;\r
  margin-top: 1rem;\r
  font-size: 1em;\r
  font-style: italic;\r
  font-weight: 600;\r
}\r
\r
.markdown-body dl dd {\r
  padding: 0 1rem;\r
  margin-bottom: 1rem;\r
}\r
\r
.markdown-body table th {\r
  font-weight: 600;\r
}\r
\r
.markdown-body table th,\r
.markdown-body table td {\r
  padding: 6px 13px;\r
  border: 1px solid #d1d9e0;\r
}\r
\r
.markdown-body table td>:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.markdown-body table tr {\r
  background-color: #ffffff;\r
  border-top: 1px solid #d1d9e0b3;\r
}\r
\r
.markdown-body table tr:nth-child(2n) {\r
  background-color: #f6f8fa;\r
}\r
\r
.markdown-body table img {\r
  background-color: transparent;\r
}\r
\r
.markdown-body img[align=right] {\r
  padding-left: 20px;\r
}\r
\r
.markdown-body img[align=left] {\r
  padding-right: 20px;\r
}\r
\r
.markdown-body .emoji {\r
  max-width: none;\r
  vertical-align: text-top;\r
  background-color: transparent;\r
}\r
\r
.markdown-body span.frame {\r
  display: block;\r
  overflow: hidden;\r
}\r
\r
.markdown-body span.frame>span {\r
  display: block;\r
  float: left;\r
  width: auto;\r
  padding: 7px;\r
  margin: 13px 0 0;\r
  overflow: hidden;\r
  border: 1px solid #d1d9e0;\r
}\r
\r
.markdown-body span.frame span img {\r
  display: block;\r
  float: left;\r
}\r
\r
.markdown-body span.frame span span {\r
  display: block;\r
  padding: 5px 0 0;\r
  clear: both;\r
  color: #1f2328;\r
}\r
\r
.markdown-body span.align-center {\r
  display: block;\r
  overflow: hidden;\r
  clear: both;\r
}\r
\r
.markdown-body span.align-center>span {\r
  display: block;\r
  margin: 13px auto 0;\r
  overflow: hidden;\r
  text-align: center;\r
}\r
\r
.markdown-body span.align-center span img {\r
  margin: 0 auto;\r
  text-align: center;\r
}\r
\r
.markdown-body span.align-right {\r
  display: block;\r
  overflow: hidden;\r
  clear: both;\r
}\r
\r
.markdown-body span.align-right>span {\r
  display: block;\r
  margin: 13px 0 0;\r
  overflow: hidden;\r
  text-align: right;\r
}\r
\r
.markdown-body span.align-right span img {\r
  margin: 0;\r
  text-align: right;\r
}\r
\r
.markdown-body span.float-left {\r
  display: block;\r
  float: left;\r
  margin-right: 13px;\r
  overflow: hidden;\r
}\r
\r
.markdown-body span.float-left span {\r
  margin: 13px 0 0;\r
}\r
\r
.markdown-body span.float-right {\r
  display: block;\r
  float: right;\r
  margin-left: 13px;\r
  overflow: hidden;\r
}\r
\r
.markdown-body span.float-right>span {\r
  display: block;\r
  margin: 13px auto 0;\r
  overflow: hidden;\r
  text-align: right;\r
}\r
\r
.markdown-body code,\r
.markdown-body tt {\r
  padding: .2em .4em;\r
  margin: 0;\r
  font-size: 85%;\r
  white-space: break-spaces;\r
  background-color: #818b981f;\r
  border-radius: 6px;\r
}\r
\r
.markdown-body code br,\r
.markdown-body tt br {\r
  display: none;\r
}\r
\r
.markdown-body del code {\r
  text-decoration: inherit;\r
}\r
\r
.markdown-body samp {\r
  font-size: 85%;\r
}\r
\r
.markdown-body pre code {\r
  font-size: 100%;\r
}\r
\r
.markdown-body pre>code {\r
  padding: 0;\r
  margin: 0;\r
  word-break: normal;\r
  white-space: pre;\r
  background: transparent;\r
  border: 0;\r
}\r
\r
.markdown-body .highlight {\r
  margin-bottom: 1rem;\r
}\r
\r
.markdown-body .highlight pre {\r
  margin-bottom: 0;\r
  word-break: normal;\r
}\r
\r
.markdown-body .highlight pre,\r
.markdown-body pre {\r
  padding: 1rem;\r
  overflow: auto;\r
  font-size: 85%;\r
  line-height: 1.45;\r
  color: #1f2328;\r
  background-color: #f6f8fa;\r
  border-radius: 6px;\r
}\r
\r
.markdown-body pre code,\r
.markdown-body pre tt {\r
  display: inline;\r
  max-width: auto;\r
  padding: 0;\r
  margin: 0;\r
  overflow: visible;\r
  line-height: inherit;\r
  word-wrap: normal;\r
  background-color: transparent;\r
  border: 0;\r
}\r
\r
.markdown-body .csv-data td,\r
.markdown-body .csv-data th {\r
  padding: 5px;\r
  overflow: hidden;\r
  font-size: 12px;\r
  line-height: 1;\r
  text-align: left;\r
  white-space: nowrap;\r
}\r
\r
.markdown-body .csv-data .blob-num {\r
  padding: 10px 0.5rem 9px;\r
  text-align: right;\r
  background: #ffffff;\r
  border: 0;\r
}\r
\r
.markdown-body .csv-data tr {\r
  border-top: 0;\r
}\r
\r
.markdown-body .csv-data th {\r
  font-weight: 600;\r
  background: #f6f8fa;\r
  border-top: 0;\r
}\r
\r
.markdown-body [data-footnote-ref]::before {\r
  content: "[";\r
}\r
\r
.markdown-body [data-footnote-ref]::after {\r
  content: "]";\r
}\r
\r
.markdown-body .footnotes {\r
  font-size: 12px;\r
  color: #59636e;\r
  border-top: 1px solid #d1d9e0;\r
}\r
\r
.markdown-body .footnotes ol {\r
  padding-left: 1rem;\r
}\r
\r
.markdown-body .footnotes ol ul {\r
  display: inline-block;\r
  padding-left: 1rem;\r
  margin-top: 1rem;\r
}\r
\r
.markdown-body .footnotes li {\r
  position: relative;\r
}\r
\r
.markdown-body .footnotes li:target::before {\r
  position: absolute;\r
  top: calc(0.5rem*-1);\r
  right: calc(0.5rem*-1);\r
  bottom: calc(0.5rem*-1);\r
  left: calc(1.5rem*-1);\r
  pointer-events: none;\r
  content: "";\r
  border: 2px solid #0969da;\r
  border-radius: 6px;\r
}\r
\r
.markdown-body .footnotes li:target {\r
  color: #1f2328;\r
}\r
\r
.markdown-body .footnotes .data-footnote-backref g-emoji {\r
  font-family: monospace;\r
}\r
\r
.markdown-body .pl-c {\r
  color: #59636e;\r
}\r
\r
.markdown-body .pl-c1,\r
.markdown-body .pl-s .pl-v {\r
  color: #0550ae;\r
}\r
\r
.markdown-body .pl-e,\r
.markdown-body .pl-en {\r
  color: #6639ba;\r
}\r
\r
.markdown-body .pl-smi,\r
.markdown-body .pl-s .pl-s1 {\r
  color: #1f2328;\r
}\r
\r
.markdown-body .pl-ent {\r
  color: #0550ae;\r
}\r
\r
.markdown-body .pl-k {\r
  color: #cf222e;\r
}\r
\r
.markdown-body .pl-s,\r
.markdown-body .pl-pds,\r
.markdown-body .pl-s .pl-pse .pl-s1,\r
.markdown-body .pl-sr,\r
.markdown-body .pl-sr .pl-cce,\r
.markdown-body .pl-sr .pl-sre,\r
.markdown-body .pl-sr .pl-sra {\r
  color: #0a3069;\r
}\r
\r
.markdown-body .pl-v,\r
.markdown-body .pl-smw {\r
  color: #953800;\r
}\r
\r
.markdown-body .pl-bu {\r
  color: #82071e;\r
}\r
\r
.markdown-body .pl-ii {\r
  color: #f6f8fa;\r
  background-color: #82071e;\r
}\r
\r
.markdown-body .pl-c2 {\r
  color: #f6f8fa;\r
  background-color: #cf222e;\r
}\r
\r
.markdown-body .pl-sr .pl-cce {\r
  font-weight: bold;\r
  color: #116329;\r
}\r
\r
.markdown-body .pl-ml {\r
  color: #3b2300;\r
}\r
\r
.markdown-body .pl-mh,\r
.markdown-body .pl-mh .pl-en,\r
.markdown-body .pl-ms {\r
  font-weight: bold;\r
  color: #0550ae;\r
}\r
\r
.markdown-body .pl-mi {\r
  font-style: italic;\r
  color: #1f2328;\r
}\r
\r
.markdown-body .pl-mb {\r
  font-weight: bold;\r
  color: #1f2328;\r
}\r
\r
.markdown-body .pl-md {\r
  color: #82071e;\r
  background-color: #ffebe9;\r
}\r
\r
.markdown-body .pl-mi1 {\r
  color: #116329;\r
  background-color: #dafbe1;\r
}\r
\r
.markdown-body .pl-mc {\r
  color: #953800;\r
  background-color: #ffd8b5;\r
}\r
\r
.markdown-body .pl-mi2 {\r
  color: #d1d9e0;\r
  background-color: #0550ae;\r
}\r
\r
.markdown-body .pl-mdr {\r
  font-weight: bold;\r
  color: #8250df;\r
}\r
\r
.markdown-body .pl-ba {\r
  color: #59636e;\r
}\r
\r
.markdown-body .pl-sg {\r
  color: #818b98;\r
}\r
\r
.markdown-body .pl-corl {\r
  text-decoration: underline;\r
  color: #0a3069;\r
}\r
\r
.markdown-body [role=button]:focus:not(:focus-visible),\r
.markdown-body [role=tabpanel][tabindex="0"]:focus:not(:focus-visible),\r
.markdown-body button:focus:not(:focus-visible),\r
.markdown-body summary:focus:not(:focus-visible),\r
.markdown-body a:focus:not(:focus-visible) {\r
  outline: none;\r
  box-shadow: none;\r
}\r
\r
.markdown-body [tabindex="0"]:focus:not(:focus-visible),\r
.markdown-body details-dialog:focus:not(:focus-visible) {\r
  outline: none;\r
}\r
\r
.markdown-body g-emoji {\r
  display: inline-block;\r
  min-width: 1ch;\r
  font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";\r
  font-size: 1em;\r
  font-style: normal !important;\r
  font-weight: 400;\r
  line-height: 1;\r
  vertical-align: -0.075em;\r
}\r
\r
.markdown-body g-emoji img {\r
  width: 1em;\r
  height: 1em;\r
}\r
\r
.markdown-body .task-list-item {\r
  list-style-type: none;\r
}\r
\r
.markdown-body .task-list-item label {\r
  font-weight: 400;\r
}\r
\r
.markdown-body .task-list-item.enabled label {\r
  cursor: pointer;\r
}\r
\r
.markdown-body .task-list-item+.task-list-item {\r
  margin-top: 0.25rem;\r
}\r
\r
.markdown-body .task-list-item .handle {\r
  display: none;\r
}\r
\r
.markdown-body .task-list-item-checkbox {\r
  margin: 0 .2em .25em -1.4em;\r
  vertical-align: middle;\r
}\r
\r
.markdown-body ul:dir(rtl) .task-list-item-checkbox {\r
  margin: 0 -1.6em .25em .2em;\r
}\r
\r
.markdown-body ol:dir(rtl) .task-list-item-checkbox {\r
  margin: 0 -1.6em .25em .2em;\r
}\r
\r
.markdown-body .contains-task-list:hover .task-list-item-convert-container,\r
.markdown-body .contains-task-list:focus-within .task-list-item-convert-container {\r
  display: block;\r
  width: auto;\r
  height: 24px;\r
  overflow: visible;\r
  clip: auto;\r
}\r
\r
.markdown-body ::-webkit-calendar-picker-indicator {\r
  filter: invert(50%);\r
}\r
\r
.markdown-body .markdown-alert {\r
  padding: 0.5rem 1rem;\r
  margin-bottom: 1rem;\r
  color: inherit;\r
  border-left: .25em solid #d1d9e0;\r
}\r
\r
.markdown-body .markdown-alert>:first-child {\r
  margin-top: 0;\r
}\r
\r
.markdown-body .markdown-alert>:last-child {\r
  margin-bottom: 0;\r
}\r
\r
.markdown-body .markdown-alert .markdown-alert-title {\r
  display: flex;\r
  font-weight: 500;\r
  align-items: center;\r
  line-height: 1;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-note {\r
  border-left-color: #0969da;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-note .markdown-alert-title {\r
  color: #0969da;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-important {\r
  border-left-color: #8250df;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-important .markdown-alert-title {\r
  color: #8250df;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-warning {\r
  border-left-color: #9a6700;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-warning .markdown-alert-title {\r
  color: #9a6700;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-tip {\r
  border-left-color: #1a7f37;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-tip .markdown-alert-title {\r
  color: #1a7f37;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-caution {\r
  border-left-color: #cf222e;\r
}\r
\r
.markdown-body .markdown-alert.markdown-alert-caution .markdown-alert-title {\r
  color: #d1242f;\r
}\r
\r
.markdown-body>*:first-child>.heading-element:first-child {\r
  margin-top: 0 !important;\r
}`;export{n as default};
