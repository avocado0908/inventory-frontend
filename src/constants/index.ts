import { User } from "lucide-react";


export enum UserRole {
  MANAGER = "manager",
  STAFF = "staff",
  ADMIN = "admin",
}

export const ROLE_OPTIONS = [
  {
    value: UserRole.STAFF,
    label: "Staff",
    icon: User,
  },
  {
    value: UserRole.MANAGER,
    label: "Manager",
    icon: User,
  },
  {
    value: UserRole.ADMIN,
    label: "Admin",
    icon: User,
  },
];

export const  CATEGORIES = [
    'Meat',
    'Poultry',
    'Seafood',
    'Dairy',
    'Dry goods',
    'Frozen goods',
    'Fresh produce',
    'Pastry and bakery',
    'Alcohol',
    'Cold drinks',
    'Hot drinks',
    'Confectionery',
    'Packaging',
]as const;

export const CATEGORY_OPTIONS = CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
}));

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// Fallback keeps the app rendering on static hosts even when env is missing.
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? "/api";

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET;
