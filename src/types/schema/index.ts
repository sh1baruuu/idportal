import { z } from "zod";


export const TricycleSchema = z.object({
    makeOrBrand: z.string().min(1, 'Please enter the make or brand.').transform((str) => str.toUpperCase()),
    engineNo: z.string().min(1, 'Please enter the registration number.').transform((str) => str.toUpperCase()),
    chassisNo: z
        .string()
        .min(1, 'Please enter the serial chassis number.').transform((str) => str.toUpperCase()),
    plateOrStickerNo: z.string().min(1, 'Please enter the plate number.').transform((str) => str.toUpperCase()),
    applicantId: z.string().transform((str) => str.toUpperCase())
});

export const ApplicantSchema = z.object({
    applicationNo: z.string(),
    applicationType: z.string(),
    fullname: z.string().min(1, 'Please enter your fullname.'),
    address: z.string().min(1, 'Please enter your address.'),
    contactNo: z.string().min(1, 'Please enter your contact number.'),
    licenseNo: z.string().min(1, 'Please enter your license number.').transform((str) => str.toUpperCase()),
    applicationDate: z.string(),
    driverName:  z.string().min(1, 'Please enter your driver name.'),
    driverLicenseNo:  z.string(),
});

export const TricycleArraySchema = z.array(TricycleSchema);
export const ApplicantArraySchema = z.array(ApplicantSchema);

export const ApplicantFormSchema = ApplicantSchema.extend({
    tricycles: TricycleArraySchema,
})

export const AddApplicantSchema = z.object({
    applicant: ApplicantSchema,
    tricycle: TricycleArraySchema
})

export const ApplicantPaginationSchema = z.object({
    search: z.string().nullable(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    filter: z.string(),
    order: z.string(),
});

export const InsertBackUpSchema = z.object({
    applicantData: ApplicantArraySchema,
    tricycleData: TricycleArraySchema
})


export const ApplicantDeleteSchema = z.object({
    applicantId: z.string(),
    fullname: z.string(),
})

export const GetByIdSchema = z.string();


export const UpdatePasswordSchema = z.object({
    currentUser: z.any(),
    currentPassword: z.string().optional(),
    newPassword: z.string(),
});
export const UpdatePasswordFormSchema = z.object({
    currentPassword: z.string().min(1, "Please enter your password"),
    newPassword: z.string().min(1, "Please enter new password").min(6, "New password must be at least 6 characters long").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "New password must include an uppercase, lowercase, symbol, and number"
    ),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

