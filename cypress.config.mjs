import { defineConfig } from "cypress";

export default defineConfig({
  retries: 1,
  e2e: {
    defaultBrowser: "electron",
    specPattern: "cypress/e2e/trevorhibblen.com"
  },
});
