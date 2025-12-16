import type { CrudSorting } from "@refinedev/core";
import { camelToSnakeCase } from "../../../utils/helpers";

export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    // Support multiple sorters
    // Convert each sorter to snake_case and collect fields and orders
    const sortFields: string[] = [];
    const sortOrders: string[] = [];

    sorters.forEach((sorter) => {
      const snakeField = camelToSnakeCase(sorter.field);
      sortFields.push(snakeField);
      sortOrders.push(sorter.order.toUpperCase()); // Convert to uppercase (ASC/DESC)
    });

    return {
      _sort: sortFields.join(","), // e.g., "first_name,last_name"
      _order: sortOrders.join(","), // e.g., "DESC,ASC"
    };
  }

  return;
};
