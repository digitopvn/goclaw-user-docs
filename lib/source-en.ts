import { docsEn } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const sourceEn = loader({
  baseUrl: '/en/docs',
  source: docsEn.toFumadocsSource(),
});
