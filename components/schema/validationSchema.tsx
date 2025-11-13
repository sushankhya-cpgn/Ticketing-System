import * as yup from "yup"


export const insuranceFormSchema = yup.object().shape({
    
    clientName: yup.string().required("Client Code is required"),
    title: yup.string().required("Please select an option"),
    kyccode: yup.string().required("KYC Code is required"),
    insuredName: yup.string().required("Insured Name is required"),
    insuredNameNepali: yup.string().required("Insured Name (Nepali) is required"),
    emailAddress: yup.string().email("Invalid email").required("Email is required"),
    mobile: yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits"),
    district: yup.string().required("District is required"),
    suminsured: yup
    .number()
    .required("Sum Insured is required"),
    premium: yup.number().required("Premium is required")
  
})