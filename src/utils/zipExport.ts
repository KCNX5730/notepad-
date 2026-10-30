import JSZip from 'jszip';
import { ProjectFile } from '../types';

export async function exportProjectAsZip(files: ProjectFile[], projectName = 'notepad-html-studio-project') {
  const zip = new JSZip();
  
  files.forEach(f => {
    const cleanPath = f.path.startsWith('/') ? f.path.slice(1) : f.path;
    zip.file(cleanPath, f.content);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importFilesFromZipOrFile(file: File): Promise<ProjectFile[]> {
  if (file.name.endsWith('.zip')) {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);
    const newFiles: ProjectFile[] = [];

    let count = 1;
    for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
      if (!zipEntry.dir) {
        const text = await zipEntry.async('string');
        const fileName = relativePath.split('/').pop() || relativePath;
        let type: 'html' | 'css' | 'js' = 'html';
        if (fileName.endsWith('.css')) type = 'css';
        else if (fileName.endsWith('.js')) type = 'js';

        newFiles.push({
          id: `imported-${Date.now()}-${count++}`,
          name: fileName,
          path: `/${relativePath}`,
          type,
          content: text,
          gitStatus: 'unmodified',
          originalContent: text,
        });
      }
    }
    return newFiles;
  } else {
    // Single file import (HTML, CSS, JS)
    const text = await file.text();
    let type: 'html' | 'css' | 'js' = 'html';
    if (file.name.endsWith('.css')) type = 'css';
    else if (file.name.endsWith('.js')) type = 'js';

    return [
      {
        id: `imported-${Date.now()}`,
        name: file.name,
        path: `/${file.name}`,
        type,
        content: text,
        gitStatus: 'unmodified',
        originalContent: text,
      },
    ];
  }
}
