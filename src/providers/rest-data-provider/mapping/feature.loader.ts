import { registerMapper } from "./mapper.registry";

const modules = import.meta.glob("../../../features/**/**.mapper.ts", {
  eager: true,
});

Object.entries(modules).forEach(([path, mod]: any) => {
  const feature = path.split("/").slice(-2)[0]; // folder name == parentmodule
  registerMapper(feature, mod.default);
});
