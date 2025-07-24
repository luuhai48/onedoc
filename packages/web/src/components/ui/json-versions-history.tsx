import type { SwaggerPatchResponse } from '@onedoc/shared';
import { format } from 'date-fns';
import { Card, CardContent } from './card';
import { JsonDiffPatch } from './json-diff-patch';
import { Separator } from './separator';
import 'jsondiffpatch/formatters/styles/html.css';
import { Button } from './button';

export const JsonVersionsHistory = ({
  versions,
  createdAt,
  hasMore,
  onLoadMore,
}: {
  versions: SwaggerPatchResponse[];
  createdAt?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
}) => {
  return (
    <section className="bg-background py-8">
      <div className="container">
        <div className="relative mx-auto max-w-4xl">
          <Separator orientation="vertical" className="bg-muted absolute left-2 top-4" />

          {versions.map((version) => (
            <div key={version._id} className="relative mb-10 pl-8">
              <div className="bg-foreground absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full" />
              <h4 className="rounded-xl py-2 text-xl tracking-tight xl:mb-4 xl:px-3">
                <span className="text-muted-foreground">Version: </span>
                <span className="font-bold">{version._id}</span>
              </h4>

              <h5 className="text-md -left-34 text-muted-foreground top-3 rounded-xl tracking-tight xl:absolute">
                {format(version.createdAt, 'MMM d, yyyy HH:mm')}
              </h5>

              <Card className="my-5 border-none shadow-none">
                <CardContent className="px-0 xl:px-2">
                  <JsonDiffPatch delta={version.patch} />
                </CardContent>
              </Card>
            </div>
          ))}

          {hasMore && (
            <div className="relative mb-10 pl-8">
              <div className="p-4 border border-dashed border-muted-foreground rounded-lg">
                <Button variant="secondary" size="sm" onClick={onLoadMore}>
                  Load More
                </Button>
              </div>
            </div>
          )}

          {createdAt && (
            <div className="relative mb-10 pl-8 mt-14">
              <div className="absolute -top-8 left-0 flex flex-col gap-2 justify-center items-center">
                <div className="bg-zinc-400 size-1.5 rounded-full" />
                <div className="bg-zinc-400 size-1.5 rounded-full" />
                <div className="bg-zinc-400 size-1.5 rounded-full" />
                <div className="bg-foreground size-4 rounded-full mt-2" />
              </div>
              <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">First Imported</h4>

              <h5 className="text-md -left-34 text-muted-foreground top-3 rounded-xl tracking-tight xl:absolute">
                {format(new Date(createdAt), 'MMM d, yyyy HH:mm')}
              </h5>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
