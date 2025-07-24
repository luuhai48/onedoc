import type { Delta } from 'jsondiffpatch';
import { format } from 'jsondiffpatch/formatters/html';

export const JsonDiffPatch = ({ delta, left }: { delta: Delta; left?: Record<string, any> }) => {
  return (
    <div className="prose dark:prose-invert">
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <ok>
        dangerouslySetInnerHTML={{ __html: format(delta, left) as string }}
      />
    </div>
  );
};
