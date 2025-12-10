import { registerMapper } from "./mapper.registry";

/**
 * Automatically loads all feature mappers
 */
const modules = import.meta.glob("../../../features/**/**.mapper.ts", {
  eager: true,
});

Object.entries(modules).forEach(([path, mod]: any) => {
  const featureName = path.split("/").slice(-2, -1)[0];
  const mapper = mod.default;

  if (mapper) {
    registerMapper(featureName, mapper);
  } else {
    console.warn(`⚠️ No default export in ${path}`);
  }
});
