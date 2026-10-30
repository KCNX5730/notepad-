/**
 * Lightweight and robust Emmet expansion engine for HTML
 * Supports:
 * - ! or html:5 (Boilerplate)
 * - tag, .class, #id, tag.class#id
 * - Nested (div>ul>li)
 * - Siblings (h1+p+button)
 * - Multipliers (li*3, div*2)
 * - Text contents (p{Hello World})
 * - Attributes (a[href="#" target="_blank"])
 * - Numbering ($ in text or attributes)
 */

const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

interface EmmetNode {
  tag: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  text?: string;
  repeat: number;
  children: EmmetNode[];
}

export function isEmmetAbbreviation(str: string): boolean {
  const trimmed = str.trim();
  if (trimmed === '!' || trimmed === 'html:5') return true;
  // Must contain emmet operators like >, +, *, ., #, [, or standard tag abbreviations
  return /^([a-zA-Z0-9_\-#.[\]+*>{}$="':]+)$/.test(trimmed) &&
    (trimmed.includes('>') || trimmed.includes('+') || trimmed.includes('*') ||
     trimmed.includes('.') || trimmed.includes('#') || trimmed.includes('[') ||
     trimmed.includes('{') || trimmed.startsWith('link:') || trimmed.startsWith('input:'));
}

export function expandEmmet(abbreviation: string, indentSize = 2): string | null {
  const input = abbreviation.trim();

  // HTML5 Boilerplate
  if (input === '!' || input === 'html:5') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;
  }

  // Common quick shortcuts
  if (input === 'link:css') return '<link rel="stylesheet" href="style.css">';
  if (input === 'script:src') return '<script src="app.js"></script>';
  if (input === 'input:text') return '<input type="text" name="" id="">';
  if (input === 'input:submit') return '<input type="submit" value="Submit">';
  if (input === 'input:button') return '<input type="button" value="Button">';
  if (input === 'input:password') return '<input type="password" name="" id="">';
  if (input === 'input:checkbox') return '<input type="checkbox" name="" id="">';
  if (input === 'input:radio') return '<input type="radio" name="" id="">';
  if (input === 'a:link') return '<a href="http://"></a>';
  if (input === 'a:mail') return '<a href="mailto:"></a>';

  try {
    const nodes = parseEmmetExpression(input);
    if (!nodes || nodes.length === 0) return null;
    return renderNodes(nodes, 0, indentSize);
  } catch (err) {
    return null;
  }
}

function parseEmmetExpression(expr: string): EmmetNode[] {
  // Split on top-level '+' for siblings
  const parts = splitTopLevel(expr, '+');
  const result: EmmetNode[] = [];

  for (const part of parts) {
    // Check for child operator '>'
    const childParts = splitTopLevel(part, '>');
    if (childParts.length > 1) {
      let rootNode = parseSingleNode(childParts[0]);
      let currentParent = rootNode;
      for (let i = 1; i < childParts.length; i++) {
        const nextNodes = parseEmmetExpression(childParts.slice(i).join('>'));
        currentParent.children.push(...nextNodes);
        break;
      }
      result.push(rootNode);
    } else {
      result.push(parseSingleNode(part));
    }
  }

  return result;
}

function splitTopLevel(str: string, delimiter: string): string[] {
  const parts: string[] = [];
  let bracketDepth = 0;
  let braceDepth = 0;
  let parenDepth = 0;
  let current = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '[') bracketDepth++;
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === '{') braceDepth++;
    else if (char === '}') braceDepth = Math.max(0, braceDepth - 1);
    else if (char === '(') parenDepth++;
    else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);

    if (char === delimiter && bracketDepth === 0 && braceDepth === 0 && parenDepth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function parseSingleNode(token: string): EmmetNode {
  let tag = 'div';
  let id: string | undefined;
  const classes: string[] = [];
  const attributes: Record<string, string> = {};
  let text: string | undefined;
  let repeat = 1;

  // Check repeat *N
  let nodeStr = token;
  const repeatMatch = nodeStr.match(/\*(\d+)$/);
  if (repeatMatch) {
    repeat = Math.min(50, parseInt(repeatMatch[1], 10) || 1);
    nodeStr = nodeStr.slice(0, repeatMatch.index);
  }

  // Check text content {content}
  const textMatch = nodeStr.match(/\{([^}]*)\}/);
  if (textMatch) {
    text = textMatch[1];
    nodeStr = nodeStr.replace(/\{[^}]*\}/, '');
  }

  // Check attributes [a=b c="d"]
  const attrMatch = nodeStr.match(/\[([^\]]*)\]/);
  if (attrMatch) {
    const attrContent = attrMatch[1];
    const regex = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^ \]]+)))?/g;
    let m;
    while ((m = regex.exec(attrContent)) !== null) {
      const key = m[1];
      const val = m[2] ?? m[3] ?? m[4] ?? '';
      attributes[key] = val;
    }
    nodeStr = nodeStr.replace(/\[[^\]]*\]/, '');
  }

  // Tag name
  const mainPartMatch = nodeStr.match(/^([a-zA-Z0-9]+)/);
  if (mainPartMatch) {
    tag = mainPartMatch[1].toLowerCase();
    nodeStr = nodeStr.slice(tag.length);
  }

  // Classes & ID
  const parts = nodeStr.split(/([.#][a-zA-Z0-9_-]+)/).filter(Boolean);
  for (const part of parts) {
    if (part.startsWith('#')) {
      id = part.slice(1);
    } else if (part.startsWith('.')) {
      classes.push(part.slice(1));
    }
  }

  return {
    tag,
    id,
    classes,
    attributes,
    text,
    repeat,
    children: [],
  };
}

function renderNodes(nodes: EmmetNode[], depth: number, indentSize: number): string {
  const lines: string[] = [];
  const indent = ' '.repeat(depth * indentSize);

  for (const node of nodes) {
    for (let r = 1; r <= node.repeat; r++) {
      const replaceIndex = (str: string) => str.replace(/\$/g, String(r));

      const tag = node.tag;
      const isSelfClosing = SELF_CLOSING_TAGS.has(tag);

      let attrStr = '';
      if (node.id) attrStr += ` id="${replaceIndex(node.id)}"`;
      if (node.classes.length > 0) attrStr += ` class="${node.classes.map(replaceIndex).join(' ')}"`;
      for (const [k, v] of Object.entries(node.attributes)) {
        attrStr += ` ${k}="${replaceIndex(v)}"`;
      }

      if (isSelfClosing) {
        lines.push(`${indent}<${tag}${attrStr}>`);
      } else if (node.children.length === 0) {
        const textContent = node.text ? replaceIndex(node.text) : '';
        lines.push(`${indent}<${tag}${attrStr}>${textContent}</${tag}>`);
      } else {
        lines.push(`${indent}<${tag}${attrStr}>`);
        if (node.text) {
          lines.push(`${indent}${' '.repeat(indentSize)}${replaceIndex(node.text)}`);
        }
        lines.push(renderNodes(node.children, depth + 1, indentSize));
        lines.push(`${indent}</${tag}>`);
      }
    }
  }

  return lines.join('\n');
}
