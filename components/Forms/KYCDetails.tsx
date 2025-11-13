// import React from 'react';
// import { useFormContext } from "react-hook-form";
// import ButtonComponent from "../Buttons/button";
// import SelectSearch from "../Fields/SelectSearch";
// import TextFieldComponent from "../Fields/TextFieldComponent";
// import SearchIcon from '@mui/icons-material/Search';


// interface KYCDetailsProps{
//   setSearchKYC: (searchKYC:boolean)=> void;
// }

// const  KYCDetails: React.FC<KYCDetailsProps> = ({setSearchKYC}) => {
//      const {
//               register,
//               formState: { errors },
//             } = useFormContext();
//     const option = [
//                 {label:"Mr."},{label:"Mrs."}
//               ]
          
//     return(
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
//         <SelectSearch 
//         label="Title" 
//         name="title" 
//         register={register} 
//         errors={errors} // Changed from errors.requiredField to errors
//         options={option} 
//         required 
//       />
//         <TextFieldComponent label="KYC Code" name="kyccode" register={register} error={errors}  required/>
//         <ButtonComponent
//           startIcon={<SearchIcon />}
//           color="primary"
//           label="Search KYC"
//           width="200px"
//           onClick={() => setSearchKYC(true)}
//         />
//         <ButtonComponent startIcon={<SearchIcon />} color="primary" label="New KYC" width="200px" />
//       </div>
//     );
// }

// export default KYCDetails;