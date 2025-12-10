import { axiosInstance, generateSort, generateFilter } from "./utils";
import { stringify } from "query-string";
import type { AxiosInstance } from "axios";
import type { CrudFilters, CrudSorting, DataProvider } from "@refinedev/core";
import { ApiResponse } from "../../common/types/api";
import { getMapper } from "../rest-data-provider/mapping/mapper.registry";

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
    parentmodule?: string;
  };
};

export type GetManyParams = {
  resource: string;
  ids: number[] | string[];
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypes;
    parentmodule?: string;
  };
};

export type CreateParams = {
  resource: string;
  variables: Record<string, any>;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypesWithBody;
    parentmodule?: string;
  };
};

export type UpdateParams = {
  resource: string;
  id: number | string;
  variables: Record<string, any>;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypesWithBody;
    parentmodule?: string;
    relation_ids?: number[] | string[];
  };
};

export type GetOneParams = {
  resource: string;
  id: number | string;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypes;
    parentmodule?: string;
  };
};

export type DeleteOneParams = {
  resource: string;
  id: number | string;
  variables?: Record<string, any>;
  meta?: {
    headers?: Record<string, string>;
    method?: MethodTypesWithBody;
    parentmodule?: string;
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
      let parentmodule = meta?.parentmodule;

      const requestMethod = (method as MethodTypes) ?? "get";

      const featureName = meta?.parentmodule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentmodule === resource) {
        parentmodule = undefined;
      }

      const url = parentmodule
        ? `${apiUrl}/${parentmodule}/${resource}`
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
        const { _sort, _order } = generatedSort;
        query._sort = _sort.join(",");
        query._order = _order.join(",");
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
      let parentmodule = meta?.parentmodule;

      const requestMethod = (method as MethodTypes) ?? "get";
      const featureName = meta?.parentmodule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentmodule === resource) {
        parentmodule = undefined;
      }

      const url = parentmodule
        ? `${apiUrl}/${parentmodule}/${resource}?${stringify({ id: ids })}`
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

      let parentmodule = meta?.parentmodule;

      const featureName = meta?.parentmodule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentmodule === resource) {
        parentmodule = undefined;
      }

      const url = parentmodule
        ? `${apiUrl}/${parentmodule}/${resource}`
        : `${apiUrl}/${resource}`;

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(
        url,
        variables,
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
      const requestMethod = (method as MethodTypesWithBody) ?? "put";

      let parentmodule = meta?.parentmodule;

      const featureName = meta?.parentmodule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentmodule === resource) {
        parentmodule = undefined;
      }

      const selector = id === "relation" ? `${relation_ids?.join("/")}` : id;

      const url = parentmodule
        ? `${apiUrl}/${parentmodule}/${resource}/${selector}`
        : `${apiUrl}/${resource}/${selector}`;

      const { data } = await httpClient[requestMethod]<ApiResponse<any>>(
        url,
        variables,
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
      let parentmodule = meta?.parentmodule;

      const featureName = meta?.parentmodule || resource;
      const mapper = getMapper(featureName, resource);

      if (parentmodule === resource) {
        parentmodule = undefined;
      }

      const url = parentmodule
        ? `${apiUrl}/${parentmodule}/${resource}/${id}`
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
      let parentmodule = meta?.parentmodule;

      const selector = id === "relation" ? `${relation_ids?.join("/")}` : id;

      if (parentmodule === resource) {
        parentmodule = undefined;
      }

      const url = parentmodule
        ? `${apiUrl}/${parentmodule}/${resource}/${selector}`
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
    }) => {
      let requestUrl = `${url}?`;

      if (sorters) {
        const generatedSort = generateSort(sorters);
        if (generatedSort) {
          const { _sort, _order } = generatedSort;
          const sortQuery = {
            _sort: _sort.join(","),
            _order: _order.join(","),
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
