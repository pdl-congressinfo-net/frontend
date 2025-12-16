import type { CrudFilters, CrudSorting, DataProvider } from "@refinedev/core";
import type { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { ApiResponse } from "../../common/types/api";
import { getMapper } from "../rest-data-provider/mapping/mapper.registry";
import { axiosInstance, generateFilter, generateSort } from "./utils";

const removeEmptyFields = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export type GetListParams = {
  resource: string;
  pagination?: {
    currentPage?: number;
    pageSize?: number;
    mode?: "server" | "client";
  };
  filters?: CrudFilters;
  sorters?: CrudSorting;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypes;
    parentModule?: string;
  };
};

export type GetManyParams = {
  resource: string;
  ids: number[] | string[];
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypes;
    parentModule?: string;
  };
};

export type CreateParams = {
  resource: string;
  variables: Record<string, any>;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypesWithBody;
    parentModule?: string;
  };
};

export type UpdateParams = {
  resource: string;
  id: number | string;
  variables: Record<string, any>;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypesWithBody;
    parentModule?: string;
    relation_ids?: number[] | string[];
  };
};

export type GetOneParams = {
  resource: string;
  id: number | string;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypes;
    parentModule?: string;
  };
};

export type DeleteOneParams = {
  resource: string;
  id: number | string;
  variables?: Record<string, any>;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypesWithBody;
    parentModule?: string;
    relation_ids?: number[] | string[];
  };
};

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance,
): Omit<Required<DataProvider>, "createMany" | "updateMany" | "deleteMany"> =>
  ({
    getList: async ({
      resource,
      pagination,
      filters,
      sorters,
      meta,
    }: GetListParams) => {
      const {
        currentPage = 1,
        pageSize = 10,
        mode = "server",
      } = pagination ?? {};

      const { headers: headersFromMeta, method } = meta ?? {};
      let parentModule = meta?.parentModule;

      const requestMethod = (method as MethodTypes) ?? "get";

      const featureName = meta?.parentModule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentModule === resource) {
        parentModule = undefined;
      }

      const url = parentModule
        ? `${apiUrl}/${parentModule}/${resource}`
        : `${apiUrl}/${resource}`;

      const queryFilters = generateFilter(filters);

      const query: {
        _start?: number;
        _end?: number;
        _sort?: string;
        _order?: string;
      } = {};

      if (mode === "server") {
        query._start = (currentPage - 1) * pageSize;
        query._end = currentPage * pageSize;
      }

      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        query._sort = generatedSort._sort;
        query._order = generatedSort._order;
      }

      const combinedQuery = { ...query, ...queryFilters };
      const urlWithQuery = Object.keys(combinedQuery).length
        ? `${url}?${stringify(combinedQuery)}`
        : url;

      const { data, headers } = await httpClient[requestMethod](urlWithQuery, {
        headers: headersFromMeta,
      });

      const total = +headers["x-total-count"];

      const mappedData = mapper ? data.map((item: any) => mapper(item)) : data;

      return {
        data: mappedData,
        total: total,
      };
    },

    getMany: async ({ resource, ids, meta }: GetManyParams) => {
      const { headers, method } = meta ?? {};
      let parentModule = meta?.parentModule;

      const requestMethod = (method as MethodTypes) ?? "get";
      const featureName = meta?.parentModule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentModule === resource) {
        parentModule = undefined;
      }

      const url = parentModule
        ? `${apiUrl}/${parentModule}/${resource}?${stringify({ id: ids })}`
        : `${apiUrl}/${resource}?${stringify({ id: ids })}`;

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(url, {
        headers,
      });

      const mappedData = mapper
        ? data.data.map((item: any) => mapper(item))
        : data.data;

      return {
        data: mappedData,
      };
    },

    create: async ({ resource, variables, meta }: CreateParams) => {
      const { headers, method } = meta ?? {};
      const requestMethod = (method as MethodTypesWithBody) ?? "post";

      let parentModule = meta?.parentModule;

      const featureName = meta?.parentModule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentModule === resource) {
        parentModule = undefined;
      }

      const url = parentModule
        ? `${apiUrl}/${parentModule}/${resource}`
        : `${apiUrl}/${resource}`;

      const cleanedVariables = removeEmptyFields(variables);

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(
        url,
        cleanedVariables,
        {
          headers,
        },
      );

      const mappedData = mapper ? mapper(data.data) : data.data;

      return {
        data: mappedData,
      };
    },

    update: async ({ resource, id, variables, meta }: UpdateParams) => {
      const { headers, method, relation_ids } = meta ?? {};
      const requestMethod = (method as MethodTypesWithBody) ?? "patch";

      let parentModule = meta?.parentModule;

      const featureName = meta?.parentModule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentModule === resource) {
        parentModule = undefined;
      }

      const selector = id === "relation" ? `${relation_ids?.join("/")}` : id;

      const url = parentModule
        ? `${apiUrl}/${parentModule}/${resource}/${selector}`
        : `${apiUrl}/${resource}/${selector}`;

      const cleanedVariables = removeEmptyFields(variables);

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(
        url,
        cleanedVariables,
        {
          headers,
        },
      );

      const mappedData = mapper ? mapper(data.data) : data.data;

      return {
        data: mappedData,
      };
    },

    getOne: async ({ resource, id, meta }: GetOneParams) => {
      const { headers, method } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
      let parentModule = meta?.parentModule;

      const featureName = meta?.parentModule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentModule === resource) {
        parentModule = undefined;
      }

      const url = parentModule
        ? `${apiUrl}/${parentModule}/${resource}/${id}`
        : `${apiUrl}/${resource}/${id}`;

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(url, {
        headers,
      });

      const mappedData = mapper ? mapper(data.data) : data.data;

      return {
        data: mappedData,
      };
    },

    deleteOne: async ({ resource, id, variables, meta }: DeleteOneParams) => {
      const { headers, method, relation_ids } = meta ?? {};
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
      let parentModule = meta?.parentModule;

      const selector = id === "relation" ? `${relation_ids?.join("/")}` : id;

      if (parentModule === resource) {
        parentModule = undefined;
      }

      const url = parentModule
        ? `${apiUrl}/${parentModule}/${resource}/${selector}`
        : `${apiUrl}/${resource}/${selector}`;

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(url, {
        data: variables,
        headers,
      });

      return {
        data: data,
      };
    },

    getApiUrl: () => {
      return apiUrl;
    },

    custom: async ({
      url,
      method,
      filters,
      sorters,
      payload,
      query,
      headers,
    }: {
      url: string;
      method: MethodTypes | MethodTypesWithBody | string;
      filters?: CrudFilters;
      sorters?: CrudSorting;
      payload?: any;
      query?: Record<string, any>;
      headers?: Record<string, string>;
    }) => {
      let requestUrl = `${url}?`;

      if (sorters) {
        const generatedSort = generateSort(sorters);
        if (generatedSort) {
          const sortQuery = {
            _sort: generatedSort._sort,
            _order: generatedSort._order,
          };
          requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
        }
      }

      if (filters) {
        const filterQuery = generateFilter(filters);
        requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
      }

      if (query) {
        requestUrl = `${requestUrl}&${stringify(query)}`;
      }

      let axiosResponse;
      switch (method) {
        case "put":
        case "post":
        case "patch":
          axiosResponse = await httpClient[method](url, payload, {
            headers,
          });
          break;
        case "delete":
          axiosResponse = await httpClient.delete(url, {
            data: payload,
            headers: headers,
          });
          break;
        default:
          axiosResponse = await httpClient.get(requestUrl, {
            headers,
          });
          break;
      }

      const { data } = axiosResponse;

      return Promise.resolve({ data: data });
    },
  }) as any;
