import type { CrudFilters } from "@refinedev/core";
import { camelToSnakeCase } from "../../../utils/helpers";
import { mapOperator } from "./mapOperator";

export const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    filters.map((filter) => {
      if (filter.operator === "or" || filter.operator === "and") {
        throw new Error(
          `[@refinedev/simple-rest]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`,
        );
      }

      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          return;
        }

        // Convert camelCase field names to snake_case for backend compatibility
        const snakeField = camelToSnakeCase(field);
        const mappedOperator = mapOperator(operator);
        queryFilters[`${snakeField}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};
