import { createHash } from 'crypto';
import { clone, type Delta, diff, unpatch } from 'jsondiffpatch';

export function generateContentHash(content: Record<string, any>): string {
  const contentString = JSON.stringify(content);
  return createHash('sha256').update(contentString).digest('hex');
}

export function generatePatch(oldContent: Record<string, any>, newContent: Record<string, any>) {
  return diff(oldContent, newContent);
}

export function undoPatch(content: Record<string, any>, patch: Delta): Record<string, any> {
  const cloned = clone(content);
  unpatch(cloned, patch);
  return cloned as Record<string, any>;
}
