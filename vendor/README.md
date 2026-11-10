# Bundled C++ interpreter

`jscpp.js` is the unmodified JSCPP browser distribution from
[felixhao28/JSCPP](https://github.com/felixhao28/JSCPP), gh-pages commit
`76e3534f04abf9c2547aa73ddca275e8935bed38`.

SHA-256: `e73047b962bd8fa92faf493873b38990b63df876e67dc0a7dfc7c0fc046e7fdd`.

The original MIT license is in `JSCPP-LICENSE`. No Codédex artwork, logos,
course text, or code is included. All island and character drawings are original SVG.

The distribution implements its own worker protocol. The app sends
`[1, 'run', code, stdin, {}]`, collects `stdio.write` messages, and terminates
the worker after completion, excessive output, error, or a 10-second deadline.
The app does not inject source into an HTML document or evaluate it as JavaScript.
