import { FC, useEffect, useState } from 'react';

import ImagePreview from './ImagePreview';
import { EditPropertyProps, ApiClient } from 'adminjs';
import { Label, Box, Select, FormGroup } from '@adminjs/design-system';
import { useResource } from 'adminjs';

import { CustomPropertyProps } from './ImageShowPreview';
import { getRecordImagePath, isEmptyObject } from './file';

interface Props extends EditPropertyProps {
  property: Omit<EditPropertyProps['property'], 'custom'> & CustomPropertyProps;
}

const api = new ApiClient();

const ImageEditPreview: FC<Props> = ({
  record,
  onChange,
  property: { custom },
}) => {
  const { file: fileKey, pathBase, pathKey, fileResourceName } = custom;

  const fileResource = useResource(fileResourceName);

  const [apiFiles, setApiFiles] = useState<
      Array<{
        id: number;
        imagePreviewURL: string;
      }>
    >([]),
    [selectApiFile, setSelectApiFile] = useState('');

  const [valueSelectFile, setValueSelectFile] = useState<null | {
    value: number;
    label: number;
  }>(null);

  useEffect(() => {
    if (!record.populated[fileKey.field]) return;
    if (isEmptyObject(record.populated)) return;

    const idOfFile = record.params[fileKey.field];

    setSelectApiFile(
      getRecordImagePath(record, fileKey.field, pathKey, pathBase),
    );
    setValueSelectFile({ value: idOfFile, label: idOfFile });
  }, []);

  useEffect(() => {
    const getApiFiles = async () => {
      const searchFileRecords = await api.searchRecords({
        resourceId: fileResourceName,
        query: '',
      });

      if (searchFileRecords.length === 0) return;

      const formedFiles = searchFileRecords.map(recordFile => {
        return {
          id: +recordFile.id,
          imagePreviewURL: `${pathBase}${recordFile.params[pathKey]}`,
        };
      });

      setApiFiles(formedFiles);
    };

    getApiFiles();
  }, [fileResource]);

  const handleSetFile = (data: { value: number; label: number }) => {
    if (data === null) {
      setValueSelectFile(null);
      setSelectApiFile('');

      onChange(fileKey.field, null);

      return;
    }

    setValueSelectFile(data);

    const imagePreview = apiFiles.find(apiFile => apiFile.id === data.value);

    onChange(fileKey.field, data.value);

    if (!imagePreview) return;

    setSelectApiFile(imagePreview.imagePreviewURL);

    return;
  };

  return (
    <FormGroup>
      <Label>{fileKey.name}</Label>

      <Box flex flexDirection="row" style={{ gap: '1rem' }}>
        {apiFiles.length > 0 && (
          <Box flexGrow={1}>
            <Select
              name={fileKey.field}
              onChange={handleSetFile}
              options={apiFiles.map(apiFile => ({
                value: apiFile.id,
                label: apiFile.id,
              }))}
              value={valueSelectFile}
            />
          </Box>
        )}

        {!!selectApiFile && (
          <Box flexGrow={0}>
            <ImagePreview src={selectApiFile} />
          </Box>
        )}
      </Box>
    </FormGroup>
  );
};

export default ImageEditPreview;
