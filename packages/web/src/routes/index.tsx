import { createFileRoute } from '@tanstack/react-router';
import 'swagger-ui-react/swagger-ui.css';
import { useQuery } from '@tanstack/react-query';
import SwaggerUI from 'swagger-ui-react';
import { getListSwaggerEndpoints } from '@/api/swagger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['swagger-endpoints'],
    queryFn: getListSwaggerEndpoints,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section className="flex justify-center p-4 md:p-8 w-full relative">
      <Tabs defaultValue={data?.[0]} className="w-full">
        <TabsList className="sticky top-0 z-10 w-full bg-gray-200">
          {data?.map((endpoint) => (
            <TabsTrigger key={endpoint} value={endpoint}>
              {endpoint}
            </TabsTrigger>
          ))}
        </TabsList>
        {data?.map((endpoint) => (
          <TabsContent key={endpoint} value={endpoint}>
            <SwaggerUI url={endpoint} displayRequestDuration persistAuthorization />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
