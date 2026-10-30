/**
 * High-performance HTML, CSS, and JS formatter / beautifier
 */

export function formatCode(source: string, type: string, indentSize = 2): string {
  if (!source) return '';
  switch (type) {
    case 'html':
      return formatHtml(source, indentSize);
    case 'css':
      return formatCss(source, indentSize);
    case 'js':
    case 'json':
      return formatJs(source, indentSize);
    default:
      return source;
  }
}

export function formatHtml(html: string, indentSize = 2): string {
  const indentStr = ' '.repeat(indentSize);
  let formatted = '';
  let indentLevel = 0;

  // Normalize spaces between tags
  const tokens = html
    .replace(/>\s*</g, '><')
    .replace(/(<!--[\s\S]*?-->)/g, '\n$1\n')
    .split(/(<[^>]+>)/g)
    .filter(t => t.trim().length > 0);

  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.startsWith('<!--')) {
      formatted += indentStr.repeat(indentLevel) + token + '\n';
      continue;
    }

    if (token.startsWith('</')) {
      // Closing tag
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += indentStr.repeat(indentLevel) + token + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!')) {
      // Opening tag or self-closing
      const tagNameMatch = token.match(/^<([a-zA-Z0-9_-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>') || voidElements.has(tagName);

      formatted += indentStr.repeat(indentLevel) + token + '\n';
      if (!isSelfClosing) {
        indentLevel++;
      }
    } else if (token.startsWith('<!')) {
      // Doctype
      formatted += indentStr.repeat(indentLevel) + token + '\n';
    } else {
      // Text node
      formatted += indentStr.repeat(indentLevel) + token + '\n';
    }
  }

  return formatted.trim();
}

export function formatCss(css: string, indentSize = 2): string {
  const indentStr = ' '.repeat(indentSize);
  let formatted = '';
  let indent = 0;

  // Clean comments and tokenize
  const cleaned = css.replace(/\s+/g, ' ').replace(/\{\s*/g, ' {\n').replace(/;\s*/g, ';\n').replace(/\}\s*/g, '\n}\n');
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.endsWith('}')) {
      indent = Math.max(0, indent - 1);
      formatted += indentStr.repeat(indent) + line + '\n\n';
    } else if (line.endsWith('{')) {
      formatted += indentStr.repeat(indent) + line + '\n';
      indent++;
    } else {
      formatted += indentStr.repeat(indent) + line + '\n';
    }
  }

  return formatted.trim();
}

export function formatJs(js: string, indentSize = 2): string {
  try {
    // If it's valid JSON
    const parsed = JSON.parse(js);
    return JSON.stringify(parsed, null, indentSize);
  } catch (e) {
    // Basic JS beautifier for braces and statements
    const indentStr = ' '.repeat(indentSize);
    const lines = js.split('\n');
    let indent = 0;
    const result: string[] = [];

    for (let rawLine of lines) {
      let line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith('}') || line.startsWith(']')) {
        indent = Math.max(0, indent - 1);
      }

      result.push(indentStr.repeat(indent) + line);

      if (line.endsWith('{') || line.endsWith('[')) {
        indent++;
      }
    }
    return result.join('\n');
  }
}
