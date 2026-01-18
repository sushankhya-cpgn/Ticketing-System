// import React, { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";

// import SelectSearch from "../components/Fields/SelectSearch";
// import DatePickerComponent from "../components/Fields/DatePicker";
// import TextFieldComponent from "../components/Fields/TextFieldComponent";

// import { ReportAPI } from "../src/api/Report/reportApi";
// import {  BRANCH_TYPES, REPORT_FILTERS } from "../constants/reportMapping"

// export default function ReportPage() {
//   const methods = useForm({
//     defaultValues: {
//       reportType: "",
//       reportHead: "",
//       fromDate: "",
//       toDate: "",
//       fiscalYear: "",
//       branchType: "",
//       branch: "",
//       department: "",
//       agent: "",
//       clientCode: "",
//       riskCode: "",
//     },
//   });

//   const { handleSubmit, reset, watch, getValues } = methods;
//   const reportType = watch("reportType");
//   const branchType = watch("branchType"); // watch branchType
//   const [showFilters, setShowFilters] = useState(true);
//   const [departments, setDepartments] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [fiscalYears, setFiscalYears] = useState([]);
//   const [reportTypes, setReportTypes] = useState([]);

//   /* ----------------------------- API LOAD ----------------------------- */
//   useEffect(() => {

//     ReportAPI.getSubReports("sp_Report_UW_RegisterPaid").then((res) => {
//       setReportTypes(
//         res.data?.data?.map((rh: any) => ({ label: rh.reportTypeName, value: rh.reportTypeCode })) || []
//       );
//     });
//     ReportAPI.getDepartments().then((res) => {
//       setDepartments(
//         res.data?.data?.map((d: any) => ({ label: d.deptName, value: d.deptKey })) || []
//       );
//     });



//     ReportAPI.getFiscalYears().then((res) => {
//       setFiscalYears(
//         res.data?.data?.map((fy: any) => ({ label: fy.fyDisplay, value: fy.orderNumber })) || []
//       );
//     });

//   }, []);

//   useEffect(() => {
//     if (!branchType) {
//       setBranches([]);
//       return;
//     }

//     const fetchBranches = async () => {
//       try {
//         let res;
//         switch (branchType) {
//           case "BRANCH":
//             res = await ReportAPI.getBranches();
//             setBranches(
//               res.data?.data?.map((b: any) => ({
//                 label: `${b.branchCode} - ${b.branchEName}`,
//                 value: b.branchCode,
//               })) || []
//             );
//             break;

//           case "PROVINCE":
//             res = await ReportAPI.getProvinces();
//             setBranches(
//               res.data?.data?.map((p: any) => ({
//                 label: p.provinceEName,
//                 value: p.provinceCode,
//               })) || []
//             );
//             break;

//           case "REGION":
//             res = await ReportAPI.getBranchRegions();
//             setBranches(
//               res.data?.data?.map((r: any) => ({
//                 label: r.regionEName,
//                 value: r.regionCode,
//               })) || []
//             );
//             break;

//           default:
//             setBranches([]);
//         }

//         // Reset selected branch when type changes
//         reset({ ...getValues(), branch: "" });
//       } catch (err) {
//         console.error(err);
//         setBranches([]);
//       }
//     };

//     fetchBranches();
//   }, [branchType]);

//   /* ---------------------- RESET ON REPORT TYPE CHANGE ---------------------- */
//   useEffect(() => {
//     reset({
//       reportType,
//       reportHead: "",
//       department: "",
//       agent: "",
//       clientCode: "",
//       riskCode: "",
//     });
//   }, [reportType]);

//   /* ---------------------- SUBMIT HANDLER ---------------------- */
//   const onSubmit = (data: any) => {
//     console.log("Report Filters:", data);
//     // you can now submit 'fromDate', 'toDate', and other filters
//   };

//   /* ---------------------- HELPER TO RENDER CONDITIONAL FILTERS ---------------------- */
//   const renderReportFilters = () => {
//     return REPORT_FILTERS[reportType]?.map((filter) => {
//       if (filter.type === "select") {
//         const options =
//           filter.name === "department" ? departments :
//             filter.name === "agent" ? [] :
//               filter.name === "riskCode" ? [] : [];
//         return <SelectSearch key={filter.name} label={filter.label} name={filter.name} options={options} />;
//       }
//       if (filter.type === "text") {
//         return <TextFieldComponent key={filter.name} label={filter.label} name={filter.name} />;
//       }
//       return null;
//     });
//   };

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

//         {/* HEADER */}
//         <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow-sm">
//           <h2 className="text-lg font-semibold">Report Filters</h2>
//           <button
//             type="button"
//             onClick={() => setShowFilters((p) => !p)}
//             className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
//           >
//             {showFilters ? "Hide Filters" : "Show Filters"}
//           </button>
//         </div>

//         {/* FILTER PANEL */}
//         {showFilters && (
//           <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">

//             {/* REPORT TYPE */}
//             <div className="grid grid-cols-4 gap-4">
//               <SelectSearch label="Report Type" name="reportType" options={reportTypes} required />
//             </div>

//             {/* COMMON FILTERS */}
//             <div className="grid grid-cols-4 gap-4">
//               <DatePickerComponent label="From Date" name="fromDate" />
//               <DatePickerComponent label="To Date" name="toDate" />
//               <SelectSearch label="Fiscal Year" name="fiscalYear" options={fiscalYears} />
//               <SelectSearch label="Branch Type" name="branchType" options={BRANCH_TYPES} />
//               <SelectSearch label="Branch / Province / Region" name="branch" options={branches} />
//             </div>

//             {/* CONDITIONAL FILTERS */}
//             {reportType && <div className="grid grid-cols-4 gap-4">{renderReportFilters()}</div>}

//             {/* ACTIONS */}
//             <div className="flex justify-end gap-2">
//               <button type="button" onClick={() => reset()} className="rounded border px-4 py-2 text-sm">
//                 Reset
//               </button>
//               <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
//                 Load Report
//               </button>
//             </div>
//           </div>
//         )}

//         {/* REPORT CONTENT */}
//         <main className="space-y-4">
//           <div className="rounded-lg bg-blue-50 px-6 py-4">
//             <h1 className="text-xl font-semibold text-blue-900">Underwriting Register</h1>
//             <p className="text-sm text-blue-700">Review transactions within selected criteria</p>
//           </div>
//           <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             Sorry! No record found.
//           </div>
//           <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">Report results will appear here.</div>
//         </main>
//       </form>
//     </FormProvider>
//   );
// }


// reports/pages/ReportPage.tsx

import {useReportFilter} from "../hooks/useReportFilter"
import ReportFilters from "../components/Report/ReportFilter";
import DynamicReport from "../components/Report/Caption";
export default function ReportPage() {

  return (
    <>
 
    <DynamicReport/>
</>
  );
}
