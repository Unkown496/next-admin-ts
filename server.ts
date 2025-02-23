import "dotenv/config";

import express from "express";

// express-helmet plugin
import helmet from "helmet";

import App from "./utils/app";
import { Models } from "@admin/app";

import { Admin, File } from "resources";
import { localProvider } from "@resources/file";

const useHelmet = () =>
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
  });

const useAdminFiles = () => express.static(localProvider.bucket);

const models: Models = [Admin, File];

const app = new App(models, {
  isProduction: process.env.NODE_ENV === "production",
  port: +process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || "secret",

  usePlugins(server) {
    server.use(useHelmet());
    server.use(localProvider.opts.baseUrl, useAdminFiles());
  },

  adminOptions: {
    branding: {
      companyName: "Admin",
      logo: false,
      withMadeWithLove: false,
    },
  },
});
