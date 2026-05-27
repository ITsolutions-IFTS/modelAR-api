import { Request, Response } from 'express';
import { env } from '../config/env';
import {
  searchSketchfabModels,
  getSketchfabModel,
  getSketchfabDownload,
} from '../externals/sketchfab/sketchfab.handler';
import { searchModelsUseCase } from '../../Application/use-cases/sketchfab/search-models.use-case';
import { getModelUseCase } from '../../Application/use-cases/sketchfab/get-model.use-case';

export const SketchfabController = {
  async search(req: Request, res: Response): Promise<void> {
    const apiKey = env.SKETCHFAB_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'Sketchfab integration not configured: missing SKETCHFAB_API_KEY' });
      return;
    }

    const { keyword, sector, cursor } = req.query as Record<string, string | undefined>;

    try {
      const result = await searchModelsUseCase(
        { keyword, sector, cursor },
        searchSketchfabModels,
        apiKey,
      );
      res.json(result);
    } catch {
      res.status(502).json({ error: 'Sketchfab unavailable' });
    }
  },

  async getModel(req: Request, res: Response): Promise<void> {
    const apiKey = env.SKETCHFAB_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'Sketchfab integration not configured: missing SKETCHFAB_API_KEY' });
      return;
    }

    const { uid } = req.params;

    try {
      const result = await getModelUseCase(uid, getSketchfabModel, apiKey);
      res.json(result);
    } catch {
      res.status(502).json({ error: 'Sketchfab unavailable' });
    }
  },

  async getDownload(req: Request, res: Response): Promise<void> {
    const apiKey = env.SKETCHFAB_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'Sketchfab integration not configured: missing SKETCHFAB_API_KEY' });
      return;
    }

    const { uid } = req.params;

    try {
      const result = await getSketchfabDownload(uid, apiKey);
      res.json(result);
    } catch {
      res.status(404).json({ error: 'Download not available for this model' });
    }
  },
};
