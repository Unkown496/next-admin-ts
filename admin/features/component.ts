import { ComponentLoader } from "adminjs";
import { join, resolve } from "path";

export const inAdminComponents = (...paths: string[]) =>
  resolve(process.cwd(), "./admin/components", ...paths);

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
};
