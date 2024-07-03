export interface FilterOptions {
    status: string;
    description: string;
    value: string;
}

export const filterOptions: FilterOptions[] = [
    {
        status: "In Progress",
        description: "When registration is ongoing and IDs are being processed.",
        value: "inProgress"
    },
    {
        status: "Ready for Printing",
        description: "When registration is complete and IDs are ready to be printed.",
        value: "readyForPrinting"
    },
    {
        status: "Partially Printed",
        description: "When some IDs have been printed but not all.",
        value: "partiallyPrinted"
    },
    {
        status: "Issues",
        description: "When there are problems or delays in the registration or printing process.",
        value: "issues"
    },
    {
        status: "Completed",
        description: "Synonym for 'Printed,' indicating all IDs in the barangay are done.",
        value: "completed"
    },
    {
        status: "Not Started",
        description: "No registration activities have begun for the barangay.",
        value: "notStarted"
    }
];




        

