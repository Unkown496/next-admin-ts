import { getModelByName } from "@adminjs/prisma";
import { ResourceWithOptions } from "adminjs";

import { loadFeature } from "admin";
import orm from "orm";

export const Admin: ResourceWithOptions = {
  resource: {
    model: getModelByName("Admin"),
    client: orm,
  },
  options: {
    navigation: {
      name: "",
      icon: "User",
    },
  },
  features: [
    loadFeature({
      fileResourceName: "File",
      fileFields: [{ field: "avatar", name: "Аватарка" }],
      loadOptions: {
        filePath: "/public/files/",
        fileKey: "s3Key",
      },
    }),
  ],
};
