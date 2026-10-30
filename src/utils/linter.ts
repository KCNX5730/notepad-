import { Problem, ProjectFile, OutlineItem } from '../types';

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
]);

const DEPRECATED_TAGS: Record<string, string> = {
  font: 'Use CSS font-family or color instead of <font>',
  center: 'Use CSS text-align: center or flexbox instead of <center>',
  marquee: '<marquee> is obsolete; use CSS animations instead',
  blink: '<blink> is obsolete and non-standard',
  strike: 'Use <s> or CSS text-decoration: line-through instead',
  big: 'Use CSS font-size instead of <big>',
  tt: 'Use <code> or CSS font-family: monospace instead of <tt>',
};

export function lintFile(file: ProjectFile): Problem[] {
  const problems: Problem[] = [];
  const lines = file.content.split('\n');

  if (file.type === 'html') {
    lintHtml(file, lines, problems);
  } else if (file.type === 'css') {
    lintCss(file, lines, problems);
  } else if (file.type === 'js') {
    lintJs(file, lines, problems);
  }

  return problems;
}

function lintHtml(file: ProjectFile, lines: string[], problems: Problem[]) {
  const tagStack: { tag: string; line: number; col: number }[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineText = lines[lineIndex];

    // Check deprecated tags
    for (const [depTag, msg] of Object.entries(DEPRECATED_TAGS)) {
      const regex = new RegExp(`<${depTag}\\b`, 'i');
      const match = regex.exec(lineText);
      if (match) {
        problems.push({
          id: `dep-${lineIndex}-${match.index}`,
          fileId: file.id,
          fileName: file.name,
          line: lineIndex + 1,
          col: match.index + 1,
          severity: 'warning',
          message: msg,
          source: 'html-parser',
        });
      }
    }

    // Check img without alt attribute
    const imgMatch = lineText.match(/<img\b([^>]*)>/gi);
    if (imgMatch) {
      for (const imgTag of imgMatch) {
        if (!imgTag.includes('alt=')) {
          problems.push({
            id: `img-alt-${lineIndex}`,
            fileId: file.id,
            fileName: file.name,
            line: lineIndex + 1,
            col: lineText.indexOf(imgTag) + 1,
            severity: 'info',
            message: 'Accessibility: <img> tag is missing an "alt" attribute',
            source: 'html-parser',
          });
        }
      }
    }

    // Parse opening and closing tags on this line
    const tagRegex = /<\/?([a-zA-Z0-9_-]+)(?:[^>]*?)(\/?)>/g;
    let match;

    while ((match = tagRegex.exec(lineText)) !== null) {
      const fullTag = match[0];
      const tagName = match[1].toLowerCase();
      const isClosing = fullTag.startsWith('</');
      const isSelfClosing = fullTag.endsWith('/>') || VOID_ELEMENTS.has(tagName);

      if (tagName.startsWith('!') || tagName === 'doctype') continue;

      if (isClosing) {
        if (VOID_ELEMENTS.has(tagName)) {
          problems.push({
            id: `void-close-${lineIndex}-${match.index}`,
            fileId: file.id,
            fileName: file.name,
            line: lineIndex + 1,
            col: match.index + 1,
            severity: 'warning',
            message: `Void tag <${tagName}> should not have a closing tag </${tagName}>`,
            source: 'html-parser',
          });
        } else if (tagStack.length === 0) {
          problems.push({
            id: `unexpected-close-${lineIndex}-${match.index}`,
            fileId: file.id,
            fileName: file.name,
            line: lineIndex + 1,
            col: match.index + 1,
            severity: 'error',
            message: `Unexpected closing tag </${tagName}> without matching opening tag`,
            source: 'html-parser',
          });
        } else {
          const lastTag = tagStack[tagStack.length - 1];
          if (lastTag.tag === tagName) {
            tagStack.pop();
          } else {
            problems.push({
              id: `mismatched-tag-${lineIndex}-${match.index}`,
              fileId: file.id,
              fileName: file.name,
              line: lineIndex + 1,
              col: match.index + 1,
              severity: 'error',
              message: `Mismatched tag: expected </${lastTag.tag}> (from line ${lastTag.line}) but found </${tagName}>`,
              source: 'html-parser',
            });
            // Try to find if lastTag exists further down or pop it
            tagStack.pop();
          }
        }
      } else if (!isSelfClosing) {
        tagStack.push({
          tag: tagName,
          line: lineIndex + 1,
          col: match.index + 1,
        });
      }
    }
  }

  // Any remaining unclosed tags
  for (const unclosed of tagStack) {
    // html, head, body often unclosed in snippets, but warn anyway
    problems.push({
      id: `unclosed-${unclosed.line}-${unclosed.col}`,
      fileId: file.id,
      fileName: file.name,
      line: unclosed.line,
      col: unclosed.col,
      severity: 'warning',
      message: `Unclosed tag: <${unclosed.tag}> opened at line ${unclosed.line} has no matching </${unclosed.tag}>`,
      source: 'html-parser',
    });
  }
}

function lintCss(file: ProjectFile, lines: string[], problems: Problem[]) {
  let openBraces = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('/*')) continue;

    for (const char of line) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
    }

    if (openBraces < 0) {
      problems.push({
        id: `css-brace-extra-${i}`,
        fileId: file.id,
        fileName: file.name,
        line: i + 1,
        col: line.indexOf('}') + 1,
        severity: 'error',
        message: 'Unmatched closing brace "}" in CSS',
        source: 'css-lint',
      });
      openBraces = 0;
    }

    // Check missing semicolon inside a rule declaration
    if (openBraces > 0 && line.includes(':') && !line.includes('{') && !line.endsWith(';') && !line.endsWith('{') && !line.endsWith(',')) {
      problems.push({
        id: `css-semi-${i}`,
        fileId: file.id,
        fileName: file.name,
        line: i + 1,
        col: line.length,
        severity: 'warning',
        message: 'Declaration may be missing a trailing semicolon ";"',
        source: 'css-lint',
      });
    }
  }

  if (openBraces > 0) {
    problems.push({
      id: `css-brace-unclosed`,
      fileId: file.id,
      fileName: file.name,
      line: lines.length,
      col: 1,
      severity: 'error',
      message: `Unclosed CSS rule: missing ${openBraces} closing brace "}"`,
      source: 'css-lint',
    });
  }
}

function lintJs(file: ProjectFile, lines: string[], problems: Problem[]) {
  try {
    // Quick syntax validation check
    new Function(file.content);
  } catch (err: any) {
    const errorMsg = err.message || 'JavaScript syntax error';
    // Try extracting line number from error
    let errorLine = 1;
    const lineMatch = err.stack?.match(/:(\d+):(\d+)/);
    if (lineMatch) {
      errorLine = parseInt(lineMatch[1], 10) || 1;
    }
    problems.push({
      id: `js-syntax-err`,
      fileId: file.id,
      fileName: file.name,
      line: Math.min(lines.length, errorLine),
      col: 1,
      severity: 'error',
      message: errorMsg,
      source: 'js-syntax',
    });
  }
}

export function parseOutline(htmlContent: string): OutlineItem[] {
  const items: OutlineItem[] = [];
  const lines = htmlContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings H1-H6
    const headingMatch = line.match(/<(h[1-6])\b[^>]*>(.*?)<\/\1>/i);
    if (headingMatch) {
      const tag = headingMatch[1].toUpperCase();
      const text = headingMatch[2].replace(/<[^>]+>/g, '').trim() || tag;
      items.push({
        id: `outline-h-${i}`,
        label: `${tag}: ${text}`,
        type: 'heading',
        line: i + 1,
        level: parseInt(tag.charAt(1), 10),
      });
      continue;
    }

    // IDs
    const idMatch = line.match(/<([a-zA-Z0-9_-]+)[^>]*\bid=["']([^"']+)["']/i);
    if (idMatch) {
      items.push({
        id: `outline-id-${i}`,
        label: `<${idMatch[1]}> #${idMatch[2]}`,
        type: 'id',
        line: i + 1,
      });
      continue;
    }

    // Major semantic tags: section, main, header, footer, nav, article, aside, form
    const semanticMatch = line.match(/<(section|main|header|footer|nav|article|aside|form|canvas|table)\b/i);
    if (semanticMatch) {
      items.push({
        id: `outline-tag-${i}`,
        label: `<${semanticMatch[1]}>`,
        type: 'tag',
        line: i + 1,
      });
    }
  }

  return items;
}
