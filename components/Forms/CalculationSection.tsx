import { Typography } from "@mui/material";
import TextFieldComponent from "../Fields/TextFieldComponent";
import CheckboxField from "../Fields/CheckBoxField";
import { useState } from "react";
import UploadButton from "../Buttons/UploadButton";
import { useFormContext } from "react-hook-form";

export default function CalculationSection(){

  const [edit,setEdit] = useState(false);
  const [uploadedFiles,setUploadedFiles] = useState<any>("");
  const {register,formState:{errors}} = useFormContext();

    return(
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <Typography variant="h6" component="h2" textAlign="center" className="mb-6 text-gray-800 font-semibold">
            Calculation Section
          </Typography>

          <div className="space-y-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sum Insured <span className="text-red-500">*</span>
              </label>
              <TextFieldComponent height="40px" register={register} type="number"  name="suminsured" error={errors.suminsured}  />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premium <span className="text-red-500">*</span>
              </label>
              <TextFieldComponent  height="40px"  register={register} name="premium"  type="number" error={errors.premium} />

            </div>

            <div className="py-2">
              <CheckboxField label="Includes Terrorism & Riot Cover" edit={edit} setEdit={setEdit} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pool Premium
              </label>
              <TextFieldComponent height="40px" type="number" name="poolpremium" register={register} error={errors.premium} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks / Detail Information
              </label>
              {/* <TextAreaComponent register={register}  name="remark"  errors={errors.remark}/> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Information
              </label>
              {/* <TextAreaComponent register={register}  name="otherinformation"  errors={errors.remark} /> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Scanned Copy of Proposal Form Here
              </label>
              <UploadButton uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles}/>
             
            </div>
          </div>
        </div>
    );

}