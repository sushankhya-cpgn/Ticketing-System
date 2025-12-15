// // import React from "react";
// // import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// // import SelectSearch from "../Fields/SelectSearch";
// // import TextFieldComponent from "../Fields/TextFieldComponent";
// // import ButtonComponent from "../Buttons/button";
// // import ProtectedAction from "../Auth/ProtectedAction"; 

// // interface FilterOption {
// //   label: string;
// //   value: string;
// // }

// // interface TableFilterBarProps {
// //   searchField: string;
// //   setSearchField: (val: any) => void;
// //   searchText: string;
// //   setSearchText: (val: string) => void;
// //   searchSelect: string;
// //   setSearchSelect: (val: string) => void;
// //   dropdownFields: string[];
// //   fieldOptions: FilterOption[];
// //   selectOptions?: Record<string, FilterOption[]>;
// //   onAddClick: () => void;
// //   addButtonLabel: string;
// //   addButtonPermission?: string; // ✅ optional permission name
// //   pageSize: number | "all";
// //   setPageSize: (val: number | "all") => void;
// //   setPage: (page: number) => void;
// // }

// // const TableFilterBar: React.FC<TableFilterBarProps> = ({
// //   searchField,
// //   setSearchField,
// //   searchText,
// //   setSearchText,
// //   searchSelect,
// //   setSearchSelect,
// //   dropdownFields,
// //   fieldOptions,
// //   selectOptions = {},
// //   onAddClick,
// //   addButtonLabel,
// //   addButtonPermission = "", // ✅ permission check (e.g., "Add Role")
// //   pageSize,
// //   setPageSize,
// //   setPage,
// // }) => {

// //   return (
// //     <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b">

// //       {/* Left Filters */}
// //       <div className="flex gap-4 flex-wrap items-center">
// //         {/* Field selector */}
// //         <SelectSearch
// //           label="Field"
// //           value={searchField}
// //           onChange={(v) => {
// //             setSearchField(v);
// //             setSearchText("");
// //             setSearchSelect("");
// //             setPage(1);
// //           }}
// //           options={fieldOptions}
// //           width="200px"
// //         />

// //         {/* Dynamic Search condition */}
// //         {dropdownFields.includes(searchField) ? (
// //           <SelectSearch
// //             label="Select"
// //             value={searchSelect}
// //             onChange={(v) => setSearchSelect(String(v))}
// //             options={selectOptions[searchField] || []}
// //             width="200px"
// //           />
// //         ) : (
// //           <TextFieldComponent
// //             type="text"
// //             label="Search"
// //             name="search"
// //             width="250px"
// //             placeholder="Search..."
// //             value={searchText}
// //             onChange={(e: any) => setSearchText(e.target.value)}
// //             height="40px"
// //           />
// //         )}
// //       </div>

// //       {/* Right Controls */}
// //       <div className="flex items-center gap-4">
// //         {/* ✅ Permission-based Add button */}
// //         {addButtonPermission ? (
// //           <ProtectedAction permission={addButtonPermission} title={addButtonLabel}>
// //             <ButtonComponent
// //               onClick={onAddClick}
// //               sx={{ backgroundColor: "green" }}
// //             >
// //               {addButtonLabel}
// //             </ButtonComponent>
// //           </ProtectedAction>
// //         ) : (
// //           <ButtonComponent
// //             onClick={onAddClick}
// //             sx={{ backgroundColor: "green" }}
// //           >
// //             {addButtonLabel}
// //           </ButtonComponent>
// //         )}

// //         {/* Page size selector */}
// //         <FormControl size="small">
// //           <InputLabel>Rows</InputLabel>
// //           <Select
// //             label="Rows"
// //             value={pageSize}
// //             onChange={(e) => {
// //               setPageSize(e.target.value as number | "all");
// //               setPage(1);
// //             }}
// //             style={{ minWidth: 120 }}
// //           >
// //             {[50, 100, 200, "all"].map((size) => (
// //               <MenuItem key={size} value={size}>
// //                 {size === "all" ? "All" : size}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       </div>
// //     </div>
// //   );
// // };

// // export default TableFilterBar;


// // src/components/TableFilterBar.tsx
// import React from "react";
// import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import SelectSearch from "../Fields/SelectSearch";
// import TextFieldComponent from "../Fields/TextFieldComponent";
// import ButtonComponent from "../Buttons/button";
// import ProtectedAction from "../Auth/ProtectedAction";

// interface FilterOption {
//   label: string;
//   value: string;
// }

// interface Props {
//   searchText: string;
//   setSearchText: (val: string) => void;

//   dropdownFields?: string[]; // e.g. ['roleName','userStatusName']
//   selectOptions?: Record<string, FilterOption[]>; // options per dropdown field

//   // Called when a dropdown filter changes (field, value)
//   onDropdownChange: (field: string, value: string) => void;

//   onAddClick: () => void;
//   addButtonLabel: string;
//   addButtonPermission?: string;

//   pageSize: number | "all";
//   setPageSize: (val: number | "all") => void;

//   setPage: (p: number) => void;
// }

// const TableFilterBar: React.FC<Props> = ({
//   searchText,
//   setSearchText,
//   dropdownFields = [],
//   selectOptions = {},
//   onDropdownChange,
//   onAddClick,
//   addButtonLabel,
//   addButtonPermission,
//   pageSize,
//   setPageSize,
//   setPage,
// }) => {
//   return (
//     <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b">
//       <div className="flex gap-4 flex-wrap items-center">
//         <TextFieldComponent
//           type="text"
//           label="Search"
//           name="search"
//           width="280px"
//           placeholder="Search..."
//           value={searchText}
//           onChange={(e: any) => {
//             setSearchText(e.target.value);
//             setPage(1);
//           }}
//           height="40px"
//         />

//         {dropdownFields.map((field) => (
//           <SelectSearch
//             key={field}
//             label={field}
//             value={selectOptions[field]?.find(o => o.value === (selectOptions[field][0]?.value)) ? "" : ""}
//             onChange={(v) => {
//               onDropdownChange(field, String(v));
//               setPage(1);
//             }}
//             options={selectOptions[field] || []}
//             width="200px"
//           />
//         ))}
//       </div>

//       <div className="flex items-center gap-4">
//         {addButtonPermission ? (
//           <ProtectedAction permission={addButtonPermission} title={addButtonLabel}>
//             <ButtonComponent onClick={onAddClick}>{addButtonLabel}</ButtonComponent>
//           </ProtectedAction>
//         ) : (
//           <ButtonComponent onClick={onAddClick}>{addButtonLabel}</ButtonComponent>
//         )}

//         <FormControl size="small">
//           <InputLabel>Rows</InputLabel>
//           <Select
//             label="Rows"
//             value={pageSize}
//             onChange={(e) => {
//               const val = e.target.value as number | "all";
//               setPageSize(val);
//               setPage(1);
//             }}
//             style={{ minWidth: 120 }}
//           >
//             {[10, 20, 50, 100, "all"].map((size) => (
//               <MenuItem key={String(size)} value={size}>
//                 {size === "all" ? "All" : size}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>
//     </div>
//   );
// };

// export default TableFilterBar;
import React from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import SelectSearch from "../Fields/SelectSearch";
import TextFieldComponent from "../Fields/TextFieldComponent";
import ButtonComponent from "../Buttons/button";
import ProtectedAction from "../Auth/ProtectedAction";

interface FilterOption {
  label: string;
  value: string;
}

interface TableFilterBarProps {
  searchField: string;
  setSearchField: (val: string) => void;

  searchText: string;
  setSearchText: (val: string) => void;

  searchSelect: string;
  setSearchSelect: (val: string) => void;

  dropdownFields?: string[];
  fieldOptions?: FilterOption[];
  selectOptions?: Record<string, FilterOption[]>;

  onAddClick: () => void;
  addButtonLabel: string;
  addButtonPermission?: string;

  pageSize: number | "all";
  setPageSize: (val: number | "all") => void;
  setPage: (page: number) => void;
}

const TableFilterBar: React.FC<TableFilterBarProps> = ({
  searchField,
  setSearchField,
  searchText,
  setSearchText,
  searchSelect,
  setSearchSelect,
  dropdownFields,
  fieldOptions,
  selectOptions = {},

  onAddClick,
  addButtonLabel,
  addButtonPermission = "",

  pageSize,
  setPageSize,
  setPage,
}) => {
  const handleFieldChange = (val: string ) => {
    setSearchField(val);
    setSearchText("");
    setSearchSelect("");
    setPage(1);
  };

  const handleTextChange = (e: any) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleSelectChange = (val: string) => {
    setSearchSelect(val);
    setPage(1);
  };

  const handlePageSizeChange = (e: any) => {
    const value = e.target.value;
    setPageSize(value);
    setPage(1);
  };

  return (
    <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b">

      {/* LEFT SECTION */}
      <div className="flex gap-4 flex-wrap items-center">

        {/* FIELD SELECTOR */}
        <SelectSearch
          label="Field"
          value={searchField}
          onChange={handleFieldChange}
          options={fieldOptions}
          width="200px"
        />

        {/* DYNAMIC FIELD INPUT */}
        {dropdownFields.includes(searchField) ? (
          <SelectSearch
            label="Select"
            value={searchSelect}
            onChange={handleSelectChange}
            options={selectOptions[searchField] || []}
            width="200px"
          />
        ) : (
          <TextFieldComponent
            type="text"
            label="Search"
            name="search"
            width="250px"
            placeholder="Search..."
            value={searchText}
            onChange={handleTextChange}
            height="40px"
          />
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* ADD BUTTON WITH PERMISSION */}
        {addButtonPermission ? (
          <ProtectedAction permission={addButtonPermission} title={addButtonLabel}>
            <ButtonComponent onClick={onAddClick} sx={{ backgroundColor: "green" }}>
              {addButtonLabel}
            </ButtonComponent>
          </ProtectedAction>
        ) : (
          <ButtonComponent onClick={onAddClick} sx={{ backgroundColor: "green" }}>
            {addButtonLabel}
          </ButtonComponent>
        )}

        {/* PAGE SIZE DROPDOWN */}
        <FormControl size="small">
          <InputLabel>Rows</InputLabel>
          <Select
            label="Rows"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ minWidth: 120 }}
          >
            {[50, 100, 200, "all"].map((size) => (
              <MenuItem key={size} value={size}>
                {size === "all" ? "All" : size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default TableFilterBar;
