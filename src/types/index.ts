import { z } from "zod";
import { AddApplicantSchema, ApplicantDeleteSchema, ApplicantFormSchema, ApplicantSchema, InsertBackUpSchema, TricycleArraySchema, TricycleSchema, UpdatePasswordFormSchema, UpdatePasswordSchema } from "./schema";

export interface LogInCredential {
    email: string;
    password: string;
};

export type Tricycle = z.infer<typeof TricycleSchema>;
export interface TricycleForm extends Tricycle { };
export type ApplicantForm = z.infer<typeof ApplicantFormSchema>;

export interface Tricycles extends Omit<Tricycle, 'applicantId'> {
    driverName: string | null;
    driverLicenseNo: string | null;
    id: number;
    operator: string;
};

export interface SortOptions {
    label: string;
    value: string;
};

export interface PaginationParams {
    page: number;
    pageSize: number;
    order: string;
};

export interface SearchParams {
    search: string | null;
};

export interface FilterParams {
    filter: string;
};

export interface GetAllTricyclesParams extends PaginationParams, SearchParams { };

export interface GetAllApplicantsParams extends PaginationParams, SearchParams, FilterParams { };

export type TricycleArr = z.infer<typeof TricycleArraySchema>[number];
export type Applicant = z.infer<typeof ApplicantSchema>;
export type AddApplicant = z.infer<typeof AddApplicantSchema>;
export type ApplicantDelete = z.infer<typeof ApplicantDeleteSchema>;
export type InsertBackUp = z.infer<typeof InsertBackUpSchema>;
export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;

export interface TricycleExportData {
    applicationNo: string;
    operator: string;
    licenseNo: string | null;
    address: string | null;
    makeOrBrand: string;
    engineNo: string;
    chassisNo: string;
    plateOrStickerNo: string;
    driverName: string | null;
    driverLicenseNo: string | null;
    applicationDate: string | null;
};


export interface TPExportData {
    name: string;
    address: string | null;
    licenseNo: string | null;
    applicationType: string;
    makeOrBrand: string | null;
    engineNo: string | null;
    chassisNo: string | null;
    plateOrStickerNo: string | null;
    driverName: string | null;
    driverLicenseNo: string | null;
    applicationDate: string | null;
    applicationNo: string;
};
export type UpdatePasswordForm = z.infer<typeof UpdatePasswordFormSchema>;
