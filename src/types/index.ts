
export interface LogInCredential {
    email: string;
    password: string;
}

export interface Tricycle {
    makeOrBrand: string;
    engineNo: string;
    chassisNo: string;
    plateOrStickerNo: string;
}


export interface Tricycles extends Tricycle {
    id: number;
    driverName: string;
    driverLicenseNo: string | null;
    operator: string;
}[]

export type ApplicationType = 'All' | 'Driver/Operator' | 'Operator';

export interface SortOptions {
    label: string;
    value: string;
}

export interface PaginationParams { 
    page: number; 
    pageSize: number; 
    order: string; 
    }

export interface SearchParams {
    search: string | null;
}

export interface FilterParams {
    filter: string;
}

export interface GetAllTricyclesParams extends PaginationParams, SearchParams {};

export interface GetAllApplicantsParams extends PaginationParams, SearchParams, FilterParams {};