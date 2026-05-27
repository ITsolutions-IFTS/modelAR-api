const SKETCHFAB_API = 'https://api.sketchfab.com/v3';

export interface SketchfabSearchParams {
  keyword?: string;
  categories?: string[];
  cursor?: string;
  count?: number;
}

export async function searchSketchfabModels(
  params: SketchfabSearchParams,
  apiKey: string,
): Promise<unknown> {
  const query = new URLSearchParams();
  if (params.keyword) query.append('q', params.keyword);
  if (params.categories?.length) query.append('categories', params.categories.join(','));
  if (params.cursor) query.append('cursor', params.cursor);
  query.append('count', String(params.count ?? 24));

  const res = await fetch(`${SKETCHFAB_API}/models?${query}`, {
    headers: { Authorization: `Token ${apiKey}` },
  });

  if (!res.ok) throw new Error(`Sketchfab API error: ${res.status}`);
  return res.json();
}

export async function getSketchfabModel(uid: string, apiKey: string): Promise<unknown> {
  const res = await fetch(`${SKETCHFAB_API}/models/${uid}`, {
    headers: { Authorization: `Token ${apiKey}` },
  });

  if (!res.ok) throw new Error(`Sketchfab model not found: ${res.status}`);
  return res.json();
}

export async function getSketchfabDownload(uid: string, apiKey: string): Promise<unknown> {
  const res = await fetch(`${SKETCHFAB_API}/models/${uid}/download`, {
    headers: { Authorization: `Token ${apiKey}` },
  });

  if (!res.ok) throw new Error(`Sketchfab download not available: ${res.status}`);
  return res.json();
}
