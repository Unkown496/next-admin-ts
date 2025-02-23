import {
  ApiClient,
  FilterPropertyProps,
  useResource,
  useTranslation,
} from "adminjs";
import { FC, useEffect, useState } from "react";
import { CustomProps } from "./file";
import { CustomPropertyProps } from "./ImageShowPreview";
import { FormGroup, Label, Select } from "@adminjs/design-system";

interface Props extends CustomProps<FilterPropertyProps, CustomPropertyProps> {}

const api = new ApiClient();

const ImageFilterPreview: FC<Props> = ({
  onChange,
  record,
  property: { custom, resourceId, isRequired = false },
}) => {
  const { file: fileKey, pathBase, pathKey, fileResourceName } = custom;
  const fileResource = useResource(fileResourceName);

  const { translateLabel } = useTranslation();

  const [apiFiles, setApiFiles] = useState<
      Array<{
        id: number;
        imagePreviewURL: string;
      }>
    >([]),
    [selectApiFile, setSelectApiFile] = useState("");

  const [valueSelectFile, setValueSelectFile] = useState<null | {
    value: number;
    label: number;
  }>(null);

  useEffect(() => {
    const getApiFiles = async () => {
      const searchFileRecords = await api.searchRecords({
        resourceId: fileResourceName,
        query: "",
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

  const handleSelectFile = () => {};

  return (
    <FormGroup>
      <Label required={isRequired}>
        {translateLabel(fileKey.field, resourceId)}
      </Label>

      <Select
        name={fileKey.field}
        required={isRequired}
        onChange={handleSelectFile}
        placeholder={translateLabel("SelectFile")}
        options={apiFiles.map(apiFile => ({
          value: apiFile.id,
          label: apiFile.id,
        }))}
        value={valueSelectFile}
      />
    </FormGroup>
  );
};

export default ImageFilterPreview;
