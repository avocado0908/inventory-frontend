export type ListResponse<T = unknown> = {
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateResponse<T = unknown> = {
  data?: T;
};

export type GetOneResponse<T = unknown> = {
  data?: T;
};

declare global {
  interface CloudinaryUploadWidgetResults {
    event: string;
    info: {
      secure_url: string;
      public_id: string;
      delete_token?: string;
      resource_type: string;
      original_filename: string;
    };
  }

  interface CloudinaryWidget {
    open: () => void;
  }

  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: CloudinaryUploadWidgetResults,
        ) => void,
      ) => CloudinaryWidget;
    };
  }
}

export interface UploadWidgetValue {
  url: string;
  publicId: string;
}

export interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
}

export enum UserRole {
  MANAGER = "manager",
  STAFF = "staff",
  ADMIN = "admin",
}

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
  department?: string;
};

export type Category = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Supplier = {
  id: number;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type Uom = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: number;
  name: string;
  categoryId?: number | null;
  supplierId?: number | null;
  uomId?: number | null;
  price?: number | null;
  pkg: number;
  barcode?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: Category | null;
  supplier?: Supplier | null;
  uom?: Uom | null;
};

export type Branch = {
  id: number;
  name: string;
};

export type MonthlyInventory = {
  id: number;
  productId: number;
  branchAssignmentsId: number;
  quantity: number;
  stockValue?: string | number | null;
  updatedAt?: string;
};

export type BranchAssignments = {
  id: number;
  name: string;
  branchId: number;
  assignedMonth: string;
  status: string;
  assignedAt?: string;
  updatedAt?: string;
};
