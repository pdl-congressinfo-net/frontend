type MapperFn = (dto: any) => any;

const registry: Record<string, Record<string, MapperFn>> = {};

export function registerMapper(
  feature: string,
  mapper: Record<string, MapperFn>,
) {
  registry[feature] = mapper;
}

export function getMapper(feature: string, resource: string): MapperFn | null {
  return registry[feature]?.[resource] ?? null;
}
