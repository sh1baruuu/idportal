


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

