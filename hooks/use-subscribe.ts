import { useState, useEffect } from 'react';
import {
  CMSContent,
  CMSContentType,
  Page,
  Post,
  CMSGetParam,
} from '@lib/cms/cms-types';
import { cmsFactory } from '@lib/cms/cms';

type Props = CMSGetParam & {
  initialData: CMSContent;
  contentType: CMSContentType;
  preview: boolean;
  id: string;
};

export function useContentSubscribe({
  initialData,
  contentType,
  slug,
  id,
  preview,
}: Props): Post | Page {
  const cms = cmsFactory({ preview });
  const [content, setContent] = useState(initialData);
  const [latestUpdate, setLatestUpdate] = useState(new Date());

  const handleUpdate = async (update: { result?: CMSContent }) => {
    if (!update.result) {
      setContent(initialData);
      setLatestUpdate(new Date());
      return;
    }
    const currentUpdate = new Date(update.result._updatedAt);
    if (currentUpdate > latestUpdate) {
      const res = await cms.getById({
        id,
        type: contentType,
      });

      setLatestUpdate(currentUpdate);
      setContent(res);
    }
  };

  useEffect(() => {
    if (preview) {
      const subscription = cms.subscribeToType(
        { type: contentType, slug, id },
        handleUpdate,
      );
      return function cleanUp() {
        subscription.unsubscribe();
      };
    }
  }, []);

  return content as Post | Page;
}
