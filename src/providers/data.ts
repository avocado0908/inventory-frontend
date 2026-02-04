import { Product } from "@/types";
import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Beef Brisket Point End",
    category: "Meat",
    supplier: "Bidvest",
    pkg: 1,
    uom: "kg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bacon Streaky-Gluten Free-Rindless-Bee Knees",
    category: "Meat",
    supplier: "Bidvest",
    pkg: 1,
    uom: "kg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Chicken Smoked sliced",
    category: "Poultry",
    supplier: "Bidvest",
    pkg: 1,
    uom: "kg",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Crème Fraiche-Tatua",
    category: "Dairy",
    supplier: "Bidvest",
    pkg: 500,
    uom: "g",
    createdAt: new Date().toISOString(),
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }: 
    GetListParams): Promise<GetListResponse<TData>> => {
      if(resource !== 'products') return { data: [] as TData[], total: 0};

      return {
        data: MOCK_PRODUCTS as unknown as TData[],
        total: MOCK_PRODUCTS.length,
      }
    },

    getOne: async () => {throw new Error('This function is not present in mock')},
    create: async () => {throw new Error('This function is not present in mock')},
    update: async () => {throw new Error('This function is not present in mock')},
    deleteOne: async () => {throw new Error('This function is not present in mock')},

    getApiUrl: () => '',
}