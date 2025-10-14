import { z } from "zod";

// Employee Schema
export const employeeStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);
export type EmployeeStatus = z.infer<typeof employeeStatusEnum>;

export const employeeSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  department: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  designation: z.string(),
  status: employeeStatusEnum,
});

export const insertEmployeeSchema = employeeSchema.omit({ id: true });

export type Employee = z.infer<typeof employeeSchema>;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

// Asset Schema
export const assetStatusEnum = z.enum(["AVAILABLE", "ASSIGNED", "UNDER_REPAIR", "RETIRED"]);
export const assetConditionEnum = z.enum(["NEW", "GOOD", "NEEDS_REPAIR", "DAMAGED"]);

export type AssetStatus = z.infer<typeof assetStatusEnum>;
export type AssetCondition = z.infer<typeof assetConditionEnum>;

export const assetSchema = z.object({
  id: z.number(),
  assetName: z.string(),
  assetType: z.string(),
  makeModel: z.string(),
  serialNumber: z.string(),
  purchaseDate: z.string(),
  warrantyExpiryDate: z.string().nullable(),
  condition: assetConditionEnum,
  status: assetStatusEnum,
  isSpare: z.boolean(),
  specifications: z.string().nullable(),
});

export const insertAssetSchema = assetSchema.omit({ id: true });

export type Asset = z.infer<typeof assetSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

// Assignment History Schema
export const assignmentHistorySchema = z.object({
  id: z.number(),
  assetId: z.number(),
  employeeId: z.number(),
  assignedDate: z.string(),
  returnedDate: z.string().nullable(),
  notes: z.string().nullable(),
  asset: assetSchema.optional(),
  employee: employeeSchema.optional(),
});

export const assignmentRequestSchema = z.object({
  assetId: z.number(),
  employeeId: z.number(),
  notes: z.string().optional(),
});

export const returnRequestSchema = z.object({
  notes: z.string().optional(),
});

export type AssignmentHistory = z.infer<typeof assignmentHistorySchema>;
export type AssignmentRequest = z.infer<typeof assignmentRequestSchema>;
export type ReturnRequest = z.infer<typeof returnRequestSchema>;

// Statistics Types
export type AssetStatistics = {
  total: number;
  assigned: number;
  available: number;
  underRepair: number;
  retired: number;
  spare: number;
};

export type AssetsByType = Record<string, number>;

// Paginated Response Type
export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
