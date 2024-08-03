---
outline: [2,3]
---

# Mini-Markup

Some Vergil component APIs may receive (through props, function arguments, etc.) strings with line breaks (in template strings) and a minimal set of Markdown-like tags, referred to as *Mini-Markup*, which Vergil is able to parse in order to render custom text content accordingly.

Throughout the documentation, Mini-Markup support is indicated by the <Badge><pre>MiniMarkup</pre></Badge> badge.

Available Mini-Markup tags syntax is summarized in the following table.

| Syntax      | Effect |
| ----------- | ------ |
| `**<str>**` | `str` is displayed with bold font |
| `//<str>//` | `str` is displayed in italics |
| `[[<str>]]` | `str` is displayed inside an inline block |