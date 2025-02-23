import { ComponentLoader } from "adminjs";
import { join, resolve } from "path";

export const inAdminComponents = (...paths: string[]) =>
  resolve(process.cwd(), "./admin/components", ...paths);

const createComponent = (componentName: string, componentPath?: string) =>
  componentLoader.add(
    componentName,
    inAdminComponents(componentPath ?? componentName)
  );

export const componentLoader = new ComponentLoader();

export const Components = {
  ImageShowPreview: componentLoader.add(
    "ImageShowPreview",
    inAdminComponents("ImageShowPreview")
  ),
  ImageEditPreview: componentLoader.add(
    "ImageEditPreview",
    inAdminComponents("ImageEditPreview")
  ),
  ImageListPreview: componentLoader.add(
    "ImageListPreview",
    inAdminComponents("ImageListPreview")
  ),
  ImageFilterPreview: createComponent("ImageFilterPreview"),
};
