import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface DynamicImportOptions {
  ssr?: boolean;
  loading?: () => React.ReactElement;
  retries?: number;
  retryDelay?: number;
}

export function createSafeDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
) {
  const { ssr = false, loading, retries = 3, retryDelay = 1000 } = options;

  return dynamic(
    () => {
      return new Promise<T>((resolve, reject) => {
        let attempts = 0;

        const attemptImport = async () => {
          try {
            const module = await importFn();
            resolve(module.default);
          } catch (error) {
            attempts++;
            
            // Check if it's a chunk loading error
            if (
              (error as any)?.name === 'ChunkLoadError' ||
              (error as any)?.message?.includes('Loading chunk') ||
              (error as any)?.message?.includes('Failed to fetch')
            ) {
              if (attempts < retries) {
                console.warn(`Chunk loading failed, retrying... (${attempts}/${retries})`);
                setTimeout(attemptImport, retryDelay);
                return;
              }
            }
            
            reject(error);
          }
        };

        attemptImport();
      });
    },
    {
      ssr,
      loading,
    }
  );
}

// Predefined safe dynamic imports for common components
export const SafeCustomEditor = createSafeDynamicImport(
  () => import('@/components/editor/custom-editor'),
  { ssr: false }
);

export const SafeViewEditor = createSafeDynamicImport(
  () => import('@/components/editor/view-editor'),
  { ssr: false }
);

export const SafeReactApexChart = createSafeDynamicImport(
  () => import('react-apexcharts'),
  { ssr: false }
); 