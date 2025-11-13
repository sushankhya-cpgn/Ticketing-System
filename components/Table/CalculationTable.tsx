// import React from "react";
// import { Typography } from "@mui/material";
// import { useFormContext } from "react-hook-form";

// export function CalculationTable() {

//   const {watch} = useFormContext();
//   const sumInsured = watch("suminsured") || 0;
//   const premium = watch("premium") || 0;
//   const poolPremium = watch("poolpremium") || 0;
//   const policyPeriod = 0;
//   const subTotal = 0;
//   const stamp = 0;
//   const commission = 0;
//   const totalPremium = 0;
//   const tax = 0;
//   const amountInWords = "Zero";
//   return (
//     <div className="bg-white/90 p-6 rounded-2xl shadow-lg">
//       <Typography variant="h6" component="h2" className="mb-6 text-gray-800 font-semibold">
//         Premium Calculation
//       </Typography>

//       <div className="space-y-3">
//         <Row label="Policy Period in Days:" value={policyPeriod} />
//         <Row label="Sum Insured:" value={sumInsured} />
//         <Row label="Premium:" value={premium} />
//         <Row label="Pool Premium:" value={poolPremium} />
//         <Row label="Sub Total:" value={subTotal} isBold />
//         <Row label="13% TAX:" value={tax} />
//         <Row label="Stamp:" value={stamp} />
//         <Row label="Commission:" value={commission} />
//         <Row label="Total Premium:" value={totalPremium} highlight />
//         <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//           <p className="text-xs text-gray-600 italic">
//             In Words: {amountInWords || "Zero"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value, isBold = false, highlight = false }) {
//   const baseClass = "flex justify-between items-center py-1 border-b border-gray-100";
//   const highlightClass = "py-3 mt-4 bg-green-50 rounded-lg px-3 border border-green-200";

//   const textClass = isBold
//     ? "text-sm font-semibold text-gray-700"
//     : "text-sm font-medium text-gray-600";

//   const valueClass = highlight
//     ? "text-base font-bold text-green-700"
//     : "text-sm font-semibold text-gray-800";

//   return (
//     <div className={highlight ? highlightClass : baseClass}>
//       <span className={textClass}>{label}</span>
//       <span className={valueClass}>{parseFloat(value).toFixed(2)}</span>
//     </div>
//   );
// }
