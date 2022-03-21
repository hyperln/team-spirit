import { NextApiRequest, NextApiResponse } from 'next';

import { cmsFactory as cms } from '@lib/cms/cms';
import { CMSContentType, Page, Post } from '@lib/cms/cms-types';

const routes = {
  [CMSContentType.post]: (slug: string) => `/blog/${slug}`,
  [CMSContentType.page]: (slug: string) =>
    slug === 'index' ? '/' : `/${slug || ''}`,
};

function buildRoute(type: CMSContentType, slug: string): string {
  return routes[type]?.(slug);
}

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== cms({}).getSecret() || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const token = cms({}).getToken();

  // Fetch the headless CMS to check if the provided `slug` exists
  const contentType =
    req.query.type === CMSContentType.post
      ? CMSContentType.post
      : CMSContentType.page;
  const previewContent = (await cms({
    preview: true,
  }).query({
    type: contentType,
    slug: req.query.slug as string,
  })) as Page | Post;

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!previewContent) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(
    {
      token,
    },
    {
      maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
    },
  );
  const url = buildRoute(req.query.type as CMSContentType, previewContent.slug);
  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.writeHead(307, {
    Location: url,
  });
  return res.end();
}
