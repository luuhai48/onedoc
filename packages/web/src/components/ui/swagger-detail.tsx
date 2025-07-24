import type { SwaggerEndpointResponse, SwaggerPatchResponse } from '@onedoc/shared';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import { getSwaggerVersions } from '@/api/swagger';
import { JsonVersionsHistory } from './json-versions-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export const SwaggerDetail = ({ endpoint }: { endpoint: SwaggerEndpointResponse }) => {
  const [initEndpointId, setInitEndpointId] = useState(endpoint._id);

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsString.withDefault('swagger').withOptions({
      history: 'push',
    }),
  );

  const limit = 10;
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<SwaggerPatchResponse[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const { data: versionsData, isLoading: isLoadingVersions } = useQuery({
    queryKey: ['swagger-versions', [endpoint._id, { limit, page }, tab]],
    queryFn: () => getSwaggerVersions(endpoint._id, { limit, page }),
    enabled: tab === 'history',
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (versionsData && tab === 'history') {
      setAllData((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const newData = versionsData.data.filter((item) => !existingIds.has(item._id));
        return [...prev, ...newData];
      });
      setHasMore(versionsData.total > page * limit);
    }
  }, [versionsData, page, tab]);

  useEffect(() => {
    if (endpoint._id !== initEndpointId) {
      setInitEndpointId(endpoint._id);
      setPage(1);
      setAllData([]);
    }
  }, [endpoint, initEndpointId]);

  return (
    <section>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setAllData([]);
          setPage(1);
          setTab(value as 'swagger' | 'history');
        }}
        className="px-4 md:px-8 py-3"
      >
        <TabsList>
          <TabsTrigger value="swagger">Full Documentation</TabsTrigger>
          <TabsTrigger value="history">Changes History</TabsTrigger>
        </TabsList>

        <TabsContent value="swagger">
          <SwaggerUI url={endpoint.url} displayRequestDuration persistAuthorization />
        </TabsContent>

        <TabsContent value="history">
          <JsonVersionsHistory
            versions={allData}
            createdAt={endpoint.createdAt.toString()}
            hasMore={hasMore}
            onLoadMore={() => setPage(page + 1)}
          />

          {isLoadingVersions && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};
