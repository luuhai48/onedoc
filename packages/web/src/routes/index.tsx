import { createFileRoute } from '@tanstack/react-router';
import 'swagger-ui-react/swagger-ui.css';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo } from 'react';
import SwaggerUI from 'swagger-ui-react';
import { getListSwaggerUrls } from '@/api/swagger';
import { Combobox } from '@/components/ui/combobox';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useQueryState('url', parseAsString.withDefault('').withOptions({ history: 'push' }));

  const { data, isLoading, error } = useQuery({
    queryKey: ['swagger-urls'],
    queryFn: getListSwaggerUrls,
  });

  const options = useMemo(() => {
    return data?.map((url) => ({ value: url._id, label: url.name })) || [];
  }, [data]);

  const selectedOption = useMemo(() => {
    return data?.find((url) => url._id === value);
  }, [data, value]);

  useEffect(() => {
    if (data?.length && !value?.trim()?.length) {
      setValue(data[0]._id);
    }
  }, [data, setValue, value]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <h1 className="text-2xl font-bold">No endpoints found</h1>
        <p className="text-sm text-gray-500">Please add some endpoints to your project</p>
      </div>
    );
  }

  return (
    <section className="w-full relative">
      <div className="sticky top-0 z-50 px-8 flex items-center gap-4 bg-white shadow py-2">
        <p className="text-sm text-gray-600 font-medium">Select a Swagger JSON URL</p>

        <Combobox options={options} value={value} onChange={setValue} />
      </div>

      {selectedOption ? <SwaggerUI url={selectedOption.url} displayRequestDuration persistAuthorization /> : null}
    </section>
  );
}
