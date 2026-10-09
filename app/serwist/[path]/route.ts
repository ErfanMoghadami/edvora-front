import { spawnSync } from "node:child_process";
import path from "node:path";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ??
  crypto.randomUUID();

const swSrc = path
  .resolve(process.cwd(), "sw.ts")
  .split(path.sep)
  .join("/");

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    swSrc,
    useNativeEsbuild: true,
    globIgnores: ["**/_global-error*", "**/_global-error"],
  });