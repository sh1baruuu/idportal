import { z } from "zod";

export const TricycleSchema = z.object({
    makeOrBrand: z.string().min(1, 'Please enter the make or brand.'),
    engineNo: z.string().min(1, 'Please enter the registration number.'),
    chassisNo: z
        .string()
        .min(1, 'Please enter the serial chassis number.'),
    plateOrStickerNo: z.string().min(1, 'Please enter the plate number.'),
});

export const ApplicantFormSchema = z.object({
    applicationNo: z.string(),
    applicationType: z.string(),
    fullname: z.string().min(1, 'Please enter your fullname.'),
    address: z.string().min(1, 'Please enter your address.'),
    contactNo: z.string().min(1, 'Please enter your contact number.'),
    licenseNo: z.string().min(1, 'Please enter your license number.'),
    applicationDate: z.string(),
    tricycles: z.array(TricycleSchema),
    driverName:  z.string().min(1, 'Please enter your driver name.'),
    driverLicenseNo:  z.string().min(1, 'Please enter driver license no.'),
});

