// import React from 'react';

// function PreviewSection({ formData, calculationData }) {
//   const formatCurrency = (amount) => {
//     return `Rs. ${amount}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 ">
//       <div className="p-4">

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Main Policy Content */}
//           <div className="lg:col-span-3 space-y-8">
            
//             {/* Section I: Policyholder Information */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
//                 <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
//                   Section I: Policyholder Information
//                 </h2>
//               </div>
              
//               <div className="p-2">
//                 {/* Primary Details */}
//                 <div className="mb-8">
//                   <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
//                     A. Personal Details
//                   </h3>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Full Name:</span>
//                       <span className="font-semibold text-gray-900">{formData.client}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">KYC Reference:</span>
//                       <span className="font-semibold text-gray-900">{formData.kycCode}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Title:</span>
//                       <span className="font-semibold text-gray-900">{formData.title}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Name (Nepali):</span>
//                       <span className="font-semibold text-gray-900">{formData.insuredNameNp}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Occupation:</span>
//                       <span className="font-semibold text-gray-900">{formData.pesa}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">PAN/VAT Number:</span>
//                       <span className="font-semibold text-gray-900">{formData.panVat}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Address Information */}
//                 <div className="mb-8">
//                   <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
//                     B. Registered Address
//                   </h3>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">District:</span>
//                       <span className="font-semibold text-gray-900">{formData.district}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">VDC/Municipality:</span>
//                       <span className="font-semibold text-gray-900">{formData.vdc}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Ward Number:</span>
//                       <span className="font-semibold text-gray-900">{formData.ward}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Street/Tole:</span>
//                       <span className="font-semibold text-gray-900">{formData.tole}</span>
//                     </div>
//                     <div className="col-span-2">
//                       <div className="flex justify-between border-b border-gray-100 pb-2 mb-2">
//                         <span className="font-medium text-gray-600">Complete Address:</span>
//                         <span className="font-semibold text-gray-900">{formData.fullAddress}</span>
//                       </div>
//                       <div className="flex justify-between border-b border-gray-100 pb-2">
//                         <span className="font-medium text-gray-600">Address (Nepali):</span>
//                         <span className="font-semibold text-gray-900">{formData.fullAddressNp}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Details */}
//                 <div className="mb-8">
//                   <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
//                     C. Contact Information
//                   </h3>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Primary Email:</span>
//                       <span className="font-semibold text-gray-900">{formData.email}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">CC Email:</span>
//                       <span className="font-semibold text-gray-900">{formData.ccEmail}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Mobile Number:</span>
//                       <span className="font-semibold text-gray-900">{formData.mobile}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Agent Information */}
//                 <div>
//                   <h3 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
//                     D. Agent & Reference Details
//                   </h3>
//                   <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Agent Name:</span>
//                       <span className="font-semibold text-gray-900">{formData.prashtawakName}</span>
//                     </div>
//                     <div className="flex justify-between border-b border-gray-100 pb-2">
//                       <span className="font-medium text-gray-600">Agent Address:</span>
//                       <span className="font-semibold text-gray-900">{formData.prashtawakThegana}</span>
//                     </div>
//                     <div className="col-span-2">
//                       <div className="flex justify-between border-b border-gray-100 pb-2">
//                         <span className="font-medium text-gray-600">Reference:</span>
//                         <span className="font-semibold text-gray-900">{formData.referenceText}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Premium Calculation Panel */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
//               <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
//                 <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
//                   Section II: Premium Assessment
//                 </h2>
//               </div>

//               <div className="p-6">
//                 {/* Policy Terms */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
//                     Policy Terms
//                   </h3>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Policy Duration:</span>
//                       <span className="font-semibold">{calculationData.policyDays} Days</span>
//                     </div>
//                     <div className="flex justify-between py-2 border-b border-gray-100">
//                       <span className="text-gray-600">Sum Insured:</span>
//                       <span className="font-semibold">{formatCurrency(calculationData.sumInsured)}</span>
//                     </div>
//                     {calculationData.includesTerrorism && (
//                       <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
//                         <div className="flex items-center gap-2">
//                           {/* <Shield className="w-4 h-4 text-red-600" /> */}
//                           <span className="text-xs font-medium text-red-800 uppercase">Terrorism & Riot Coverage Included</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Premium Calculation */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
//                     Premium Breakdown
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between py-1">
//                       <span className="text-gray-600">Base Premium:</span>
//                       <span className="font-medium">{formatCurrency(calculationData.premium)}</span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-gray-600">Pool Premium:</span>
//                       <span className="font-medium">{formatCurrency(calculationData.poolPremium)}</span>
//                     </div>
//                     <div className="flex justify-between py-1 border-t border-gray-200 pt-2">
//                       <span className="text-gray-600">Sub Total:</span>
//                       <span className="font-medium">{formatCurrency(calculationData.subTotal)}</span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-gray-600">Tax (13%):</span>
//                       <span className="font-medium">{formatCurrency(calculationData.tax)}</span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-gray-600">Stamp Duty:</span>
//                       <span className="font-medium">{formatCurrency(calculationData.stamp)}</span>
//                     </div>
//                     <div className="flex justify-between py-1">
//                       <span className="text-gray-600">Commission:</span>
//                       <span className="font-medium">{formatCurrency(calculationData.commission)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Total Premium */}
//                 <div className="border-t-2 border-gray-300 pt-4">
//                   <div className="bg-slate-800 text-white p-4 rounded">
//                     <div className="text-center">
//                       <p className="text-xs font-medium uppercase tracking-wider mb-1">Total Premium Payable</p>
//                       <p className="text-2xl font-bold">{formatCurrency(calculationData.totalPremium)}</p>
//                       <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
//                         ({calculationData.totalInWords})
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

      

//         {/* Official Footer */}
//         <div className="mt-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="text-center text-gray-600">
//             <div className="border-t border-gray-200 pt-4">
//               <p className="text-sm font-medium">OFFICIAL DOCUMENT - INSURANCE POLICY PREVIEW</p>
//               <p className="text-xs mt-2">
//                 This document serves as a preliminary assessment and is subject to final policy terms and conditions.
//               </p>
//               <p className="text-xs mt-1">
//                 Generated on: {new Date().toLocaleDateString('en-GB', { 
//                   weekday: 'long',
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })} at {new Date().toLocaleTimeString('en-GB', { 
//                   hour: '2-digit', 
//                   minute: '2-digit'
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const formData = {
//   client: "John Doe",
//   kycCode: "KYC123456",
//   title: "Mr.",
//   insuredName: "John Doe",
//   insuredNameNp: "जोन डो",
//   district: "Kathmandu",
//   vdc: "Ward 5",
//   ward: "5",
//   tole: "Lalitpur",
//   fullAddress: "Jawalakhel, Lalitpur",
//   fullAddressNp: "जावलाखेल, ललितपुर",
//   email: "john@example.com",
//   ccEmail: "cc@example.com",
//   mobile: "9800000000",
//   panVat: "123456789",
//   pesa: "Software Engineer",
//   prashtawakName: "Agent A",
//   prashtawakThegana: "Kathmandu",
//   referenceText: "Referred by Agent B",
// };

// const calculationData = {
//   policyDays: 365,
//   sumInsured: "500,000",
//   premium: "5,000",
//   poolPremium: "200",
//   includesTerrorism: true,
//   subTotal: "5,200",
//   tax: "676",
//   stamp: "20",
//   commission: "500",
//   totalPremium: "6,396",
//   totalInWords: "Six Thousand Three Hundred Ninety-Six Only",
//   remarks: "Customer has requested expedited processing for this policy application.\n\nAll required documentation has been submitted and verified through our standard KYC procedures. The application meets all regulatory compliance requirements.\n\nSpecial provisions have been included for high-value coverage as per client requirements.",
//   otherInfo: "Policy effective date: August 1, 2025\n\nRenewal notification will be dispatched thirty (30) days prior to policy expiration.\n\nPremium payment methods accepted: Bank transfer, online banking, and certified cheque.\n\nAll policy terms and conditions are subject to the standard policy document provisions.",
// };

// export default function Preview() {
//   return <PreviewSection formData={formData} calculationData={calculationData} />;
// }