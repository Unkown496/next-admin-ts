import { resolve } from "path";

export const inLocales = (...paths: string[]) => resolve("./locales", ...paths);

export const inApp = (...paths: string[]) => resolve("./src/app", ...paths);

export const inAdmin = (...paths: string[]) => resolve("./admin", ...paths);
