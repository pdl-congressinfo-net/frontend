const registry: Record<string, Record<string, Function>> = {};

export function registerMapper(
  feature: string,
  mapper: Record<string, Function>,
) {
  console.log("✅ Registered mapper for feature:", feature);
  registry[feature] = mapper;
}

export function getMapper(feature: string, entity: string) {
  return registry[feature]?.[entity] ?? null;
}
