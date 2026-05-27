import { SECTOR_CATEGORIES } from './sector-categories.const';
import type { SketchfabSearchParams } from '../../../Infrastructure/externals/sketchfab/sketchfab.handler';

export interface SearchModelsParams {
  keyword?: string;
  sector?: string;
  cursor?: string;
}

type SearchHandler = (params: SketchfabSearchParams, apiKey: string) => Promise<unknown>;

export async function searchModelsUseCase(
  params: SearchModelsParams,
  handler: SearchHandler,
  apiKey: string,
): Promise<unknown> {
  const categories = params.sector ? SECTOR_CATEGORIES[params.sector] : undefined;

  return handler(
    {
      keyword: params.keyword,
      categories,
      cursor: params.cursor,
    },
    apiKey,
  );
}
