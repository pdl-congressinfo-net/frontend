import type { CrudSorting } from "@refinedev/core";
import { camelToSnakeCase } from "../../../utils/helpers";

export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    sorters.map((item) => {
      // Convert camelCase field names to snake_case for backend compatibility
      _sort.push(camelToSnakeCase(item.field));
      _order.push(item.order);
    });

    return {
      _sort,
      _order,
    };
  }

  return;
};
