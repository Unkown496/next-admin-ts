import { ShowPropertyProps } from 'adminjs';
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
    custom: { file, pathBase, pathKey },
  },
}) => {
  const [fileURL, setFileURL] = useState('');

  useEffect(() => {
    if (!record.populated[file.field]) return;
    if (isEmptyObject(record.populated)) return;

    setFileURL(getRecordImagePath(record, file.field, pathKey, pathBase));
  }, [record]);

  return (
    <FormGroup>
      <Label>{file.name}</Label>

      {!!fileURL ? <ImagePreview src={fileURL} /> : <Text>No image</Text>}
    </FormGroup>
  );
};

export default ImageShowPreview;
