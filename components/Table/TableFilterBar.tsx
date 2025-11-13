// import React from "react";
// import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import SelectSearch from "../Fields/SelectSearch";
// import TextFieldComponent from "../Fields/TextFieldComponent";
// import ButtonComponent from "../Buttons/button";

// interface FilterOption {
//   label: string;
//   value: string;
// }

// interface TableFilterBarProps {
//   searchField: string;
//   setSearchField: (val: any) => void;
//   searchText: string;
//   setSearchText: (val: string) => void;
//   searchSelect: string;
//   setSearchSelect: (val: string) => void;
//   dropdownFields: string[];
//   fieldOptions: FilterOption[];
//   selectOptions?: Record<string, FilterOption[]>;
//   onAddClick: () => void;
//   addButtonLabel: string;
//   pageSize: number | "all";
//   setPageSize: (val: number | "all") => void;
//   setPage: (page: number) => void;
// }

// const TableFilterBar: React.FC<TableFilterBarProps> = ({
//   searchField,
//   setSearchField,
//   searchText,
//   setSearchText,
//   searchSelect,
//   setSearchSelect,
//   dropdownFields,
//   fieldOptions,
//   selectOptions = {},
//   onAddClick,
//   addButtonLabel,
//   pageSize,
//   setPageSize,
//   setPage,
// }) => {
//   return (
//     <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b">

//       {/* Left Filters */}
//       <div className="flex gap-4 flex-wrap items-center">
        
//         {/* Field selector */}
//         <SelectSearch
//           label="Field"
//           value={searchField}
//           onChange={(v) => {
//             setSearchField(v);
//             setSearchText("");
//             setSearchSelect("");
//             setPage(1);
//           }}
//           options={fieldOptions}
//           width="200px"
//         />

//         {/* Dynamic Search condition */}
//         {dropdownFields.includes(searchField) ? (
//           <SelectSearch
//             label="Select"
//             value={searchSelect}
//             onChange={(v) => setSearchSelect(String(v))}
//             options={selectOptions[searchField] || []}
//             width="200px"
//           />
//         ) : (
//           <TextFieldComponent
//             type="text"
//             label="Search"
//             name="search"
//             width="250px"
//             placeholder="Search..."
//             value={searchText}
//             onChange={(e: any) => setSearchText(e.target.value)}
//             height="40px"
//           />
//         )}
//       </div>

//       {/* Right Controls */}
//       <div>
//         <ButtonComponent
//           onClick={onAddClick}
//           sx={{ backgroundColor: "green", marginRight: "20px" }}
//         >
//           {addButtonLabel}
//         </ButtonComponent>

//         <FormControl size="small">
//           <InputLabel>Rows</InputLabel>
//           <Select
//             label="Rows"
//             value={pageSize}
//             onChange={(e) => {
//               setPageSize(e.target.value as number | "all");
//               setPage(1);
//             }}
//             style={{ minWidth: 120 }}
//           >
//             {[50, 100, 200, "all"].map((size) => (
//               <MenuItem key={size} value={size}>
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
import ProtectedAction from "../Auth/ProtectedAction"; // ✅ import this
import { usePermission } from "../../hooks/usePermission"; // ✅ to check task availability

interface FilterOption {
  label: string;
  value: string;
}

interface TableFilterBarProps {
  searchField: string;
  setSearchField: (val: any) => void;
  searchText: string;
  setSearchText: (val: string) => void;
  searchSelect: string;
  setSearchSelect: (val: string) => void;
  dropdownFields: string[];
  fieldOptions: FilterOption[];
  selectOptions?: Record<string, FilterOption[]>;
  onAddClick: () => void;
  addButtonLabel: string;
  addButtonPermission?: string; // ✅ optional permission name
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
  addButtonPermission = "", // ✅ permission check (e.g., "Add Role")
  pageSize,
  setPageSize,
  setPage,
}) => {
  const { hasPermission } = usePermission();

  return (
    <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b">

      {/* Left Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        {/* Field selector */}
        <SelectSearch
          label="Field"
          value={searchField}
          onChange={(v) => {
            setSearchField(v);
            setSearchText("");
            setSearchSelect("");
            setPage(1);
          }}
          options={fieldOptions}
          width="200px"
        />

        {/* Dynamic Search condition */}
        {dropdownFields.includes(searchField) ? (
          <SelectSearch
            label="Select"
            value={searchSelect}
            onChange={(v) => setSearchSelect(String(v))}
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
            onChange={(e: any) => setSearchText(e.target.value)}
            height="40px"
          />
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* ✅ Permission-based Add button */}
        {addButtonPermission ? (
          <ProtectedAction permission={addButtonPermission} title={addButtonLabel}>
            <ButtonComponent
              onClick={onAddClick}
              sx={{ backgroundColor: "green" }}
            >
              {addButtonLabel}
            </ButtonComponent>
          </ProtectedAction>
        ) : (
          <ButtonComponent
            onClick={onAddClick}
            sx={{ backgroundColor: "green" }}
          >
            {addButtonLabel}
          </ButtonComponent>
        )}

        {/* Page size selector */}
        <FormControl size="small">
          <InputLabel>Rows</InputLabel>
          <Select
            label="Rows"
            value={pageSize}
            onChange={(e) => {
              setPageSize(e.target.value as number | "all");
              setPage(1);
            }}
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
