// import { useRef, useState } from "react";
// import TabButton from "../components/Buttons/TabButtons";
// import FormBanner from "../components/Forms/FormBanner";
// import ProgressBar from "../components/ProgressBar/ProgressBar";
// import InsuranceProposalForm from "../components/Forms/InsuranceProposalForm";
// import PersonalDetail from "../components/Forms/PersonalDetail";
// import ButtonComponent from "../components/Buttons/button";
// import { GridDeleteIcon } from "@mui/x-data-grid";
// import KYCListPage from "../components/Table/KYCTable";
// import FormProviderWrapper from "../components/Forms/FormWrapper";
// import { insuranceFormSchema } from "../components/schema/validationSchema";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { v4 as uuidv4 } from 'uuid';
// import { useFormContext, type FieldValues } from "react-hook-form";
// import { CalculationTable } from "../components/Table/CalculationTable";
// import CalculationSection from "../components/Forms/CalculationSection";
// import SelectSearch from "../components/Fields/SelectSearch";
// import Preview from "../components/Forms/PreviewSection";


// interface FormContentProps {
//   step: number;
//   setStep: React.Dispatch<React.SetStateAction<number>>;
//   setSearchKYC: React.Dispatch<React.SetStateAction<boolean>>;
// }

// function FormContent({ step, setStep, setSearchKYC }: FormContentProps) {
//   const stepFields: Record<number, string[]> = {
//     1: [
//       "clientName",
//       "title",
//       "kyccode",
//       "insuredName",
//       "insuredNameNepali",
//       "district",
//       "emailAddress",
//       "mobile",
//     ],
//     2: ["suminsured", "premium"],
//     3: [],
//   };

//   const { handleSubmit, trigger, setFocus, formState: { errors } } = useFormContext();

//   const handleNext = async () => {
//     const fields = stepFields[step];
//     console.log('Checking is valid')
//     const isValid = await trigger(fields);
//     console.log(isValid);
//     if (isValid) {
//       setStep(step + 1);
//     } else {
//       const firstErrorField = fields.find((field) => errors[field]);
//       if (firstErrorField) {
//         setFocus(firstErrorField);
//       }
//     }
//   };

//   const handleNextStep = (data: FieldValues) => {
//     console.log("Form Submitted", data);
//   };

//   const uniqueUUid = useRef(uuidv4()).current;

//   const renderStepContent = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="mt-4 flex flex-row gap-6 w-full">
//             <div className="w-1/4 flex flex-col">
//               <InsuranceProposalForm />
//             </div>
//             <div className="w-3/4">
//               <PersonalDetail setSearchKYC={setSearchKYC} />
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="mt-4 flex flex-row gap-4 w-full">
//             <div className="w-1/2 flex flex-col mb-4">
//               <CalculationSection />
//             </div>
//             <div className="w-1/2">
//               <div className="flex flex-row gap-4 p-4">
//                 <SelectSearch
//                   label="Field Officer"
//                   options={[
//                     { label: "Name", value: "name" },
//                     { label: "KYC", value: "kyc" },
//                     { label: "Mobile", value: "mobile" },
//                     { label: "PAN", value: "pan" },
//                     { label: "Passport", value: "passport" },
//                   ]}
//                   width="200px"
//                   height="50px"
//                 />
//                 <SelectSearch
//                   label="Agent"
//                   options={[
//                     { label: "Name", value: "name" },
//                     { label: "KYC", value: "kyc" },
//                     { label: "Mobile", value: "mobile" },
//                     { label: "PAN", value: "pan" },
//                     { label: "Passport", value: "passport" },
//                   ]}
//                   width="200px"
//                   height="50px"
//                 />
//               </div>
//               <CalculationTable />
//             </div>
//           </div>
//         );
//       case 3:
//         return <Preview />;
//       default:
//         return (
//           <div className="mt-4 flex flex-row gap-6 w-full">
//             <div className="w-full text-center p-8">
//               <p className="text-gray-500">Invalid step</p>
//             </div>
//           </div>
//         );
//     }
//   };

//   const renderActionButtons = () => {
//     const isFirstStep = step === 1;
//     const isLastStep = step === 3;

//     return (
//       <div className="flex sm:flex-row gap-4 justify-end">
//         <ButtonComponent
//           label="Clear Form"
//           width="50"
//           endIcon={<GridDeleteIcon />}
//         />
//         {!isFirstStep && (
//           <ButtonComponent
//             label="Back"
//             startIcon={<ArrowBackIcon />}
//             onClick={() => setStep(step - 1)}
//             width="100px"
//           />
//         )}
//         {/* <ButtonComponent
//           color="primary"
//           label={isLastStep ? "Submit" : "Next"}
//           endIcon={isLastStep ? <CheckIcon /> : <ArrowForwardIosIcon />}
//           onClick={async () => {
//             if (isLastStep) {
//               await handleSubmit(handleNextStep)(); // final form submit
//             } else {
//               await handleNext(); // just go to next step
//             }
//           }} // Wrap handleNextStep with handleSubmit
//           width="100px"
//         /> */}
//       </div>
//     );
//   };

//   return (
//     <>
//       {renderStepContent()}
//       <div className="flex flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 mt-auto">
//         <p className="font-mono text-sm bg-gray-100 p-2 rounded-md border border-gray-300 text-gray-700">
//           {uniqueUUid}
//         </p>
//         <p>Asterisk(*) fields are mandatory</p>
//         {renderActionButtons()}
//       </div>
//     </>
//   );
// }

// export default function InsuranceForm() {
//   const tabs = ["Basic Detail", "Identification", "Preview"];
//   const [step, setStep] = useState<number>(1);
//   const [searchKYC, setSearchKYC] = useState<boolean>(false);

//   const onSubmit = () => {
//     console.log("Form Submitted:");
//     setStep(step + 1);
//   };



//   return (
//     <>
//       {searchKYC && <KYCListPage setSearchKYC={setSearchKYC} />}
//       {!searchKYC && (
//         <div className="flex flex-col bg-white/90 shadow-xl h-screen">
//           <FormBanner height="20" />
//           <div className="mt-4">
//             <ProgressBar step={step} tabslength={tabs.length} />
//           </div>
//           <div className="mt-4 text-center">
//             <TabButton tabs={tabs} step={step}  />
//           </div>
//           <FormProviderWrapper onSubmit={onSubmit} schema={insuranceFormSchema}>
//             <FormContent step={step} setStep={setStep} setSearchKYC={setSearchKYC} />
//           </FormProviderWrapper>
//         </div>
//       )}
//     </>
//   );
// }