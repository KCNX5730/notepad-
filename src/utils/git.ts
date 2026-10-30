import { GitBranch, GitCommit, ProjectFile } from '../types';

export function calculateChangedLines(currentContent: string, originalContent?: string): {
  added: Set<number>;
  modified: Set<number>;
} {
  const added = new Set<number>();
  const modified = new Set<number>();

  if (originalContent === undefined) return { added, modified };

  const currentLines = currentContent.split('\n');
  const originalLines = originalContent.split('\n');

  for (let i = 0; i < currentLines.length; i++) {
    const lineNum = i + 1;
    if (i >= originalLines.length) {
      added.add(lineNum);
    } else if (currentLines[i] !== originalLines[i]) {
      modified.add(lineNum);
    }
  }

  return { added, modified };
}

export function commitChanges(
  branches: GitBranch[],
  activeBranchName: string,
  message: string,
  files: ProjectFile[]
): { updatedBranches: GitBranch[]; newCommit: GitCommit } {
  const snapshot: Record<string, string> = {};
  files.forEach(f => {
    snapshot[f.path] = f.content;
  });

  const hash = Math.random().toString(16).substring(2, 9);
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const newCommit: GitCommit = {
    id: `commit-${Date.now()}`,
    hash,
    message: message.trim() || `Update files (${timestamp})`,
    timestamp,
    author: 'You (Local)',
    files: snapshot,
  };

  const updatedBranches = branches.map(b => {
    if (b.name === activeBranchName) {
      return {
        ...b,
        commits: [newCommit, ...b.commits],
      };
    }
    return b;
  });

  return { updatedBranches, newCommit };
}
