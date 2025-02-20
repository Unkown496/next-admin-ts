import { ShowPropertyProps, useTranslation } from 'adminjs';
import { Text, Label, FormGroup } from '@adminjs/design-system';

import { FC, useEffect, useState } from 'react';
import { FileField } from '../adminFiles';
import { getRecordImagePath, isEmptyObject } from './file';
import ImagePreview from './ImagePreview';

export type CustomPropertyProps = {
  custom: {
    file: FileField;
    pathBase: string;
    pathKey: string;
    fileResourceName: string;
  };
};

interface Props extends ShowPropertyProps {
  property: Omit<ShowPropertyProps['property'], 'custom'> & CustomPropertyProps;
}

const ImageShowPreview: FC<Props> = ({
  record,
  property: {
    resourceId,
    custom: { file, pathBase, pathKey },
  },
}) => {
  const [fileURL, setFileURL] = useState('');

  const { translateLabel } = useTranslation();

  useEffect(() => {
    if (!record.populated[file.field]) return;
    if (isEmptyObject(record.populated)) return;

    setFileURL(getRecordImagePath(record, file.field, pathKey, pathBase));
  }, [record]);

  return (
    <FormGroup>
      <Label>{translateLabel(file.field, resourceId)}</Label>

      {!!fileURL ? (
        <ImagePreview src={fileURL} />
      ) : (
        <Text>{translateLabel('NoFiles')}</Text>
      )}
    </FormGroup>
  );
};

export default ImageShowPreview;
