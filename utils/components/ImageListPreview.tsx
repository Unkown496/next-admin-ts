import { FC, useEffect, useState } from 'react';

import ImagePreview from './ImagePreview';
import {
  useResource,
  useTranslation,
  type PropertyJSON,
  type RecordInListProps,
} from 'adminjs';
import { Box, Link, Text } from '@adminjs/design-system';
import { CustomPropertyProps } from './ImageShowPreview';
import { getRecordImagePath, isEmptyObject } from './file';

interface Props extends RecordInListProps {
  property: Omit<PropertyJSON, 'custom'> & CustomPropertyProps;
}

const ImageListPreview: FC<Props> = ({
  record,
  property: {
    resourceId,
    custom: { file, pathBase, pathKey, fileResourceName },
  },
}) => {
  const [fileURL, setFileURL] = useState(''),
    [fileEditHref, setFileEidtHref] = useState('');

  const fileResource = useResource(fileResourceName);

  const { translateLabel } = useTranslation();

  useEffect(() => {
    if (!fileResource) return;
    if (!record.populated[file.field]) return;
    if (isEmptyObject(record.populated)) return;

    setFileEidtHref(
      `${fileResource.href}/records/${record.populated[file.field]?.id}/edit`,
    );

    setFileURL(getRecordImagePath(record, file.field, pathKey, pathBase));
  }, [record, fileResource]);

  return (
    <Box flex flexDirection="column" style={{ gap: '1rem' }}>
      {!!fileURL ? (
        <>
          <ImagePreview src={fileURL} />
          <Link href={fileEditHref}>{record.populated[file.field]?.id}</Link>
        </>
      ) : (
        <Text>{translateLabel('NoFiles')}</Text>
      )}
    </Box>
  );
};

export default ImageListPreview;
