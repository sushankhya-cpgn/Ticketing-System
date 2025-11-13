import CheckboxField from "../Fields/CheckBoxField";
import SelectSearch from "../Fields/SelectSearch";
import DatePickerComponent from "../Fields/DatePicker";
import { useState } from "react";


function InsuranceProposalForm(){

    const[edit,setEdit] = useState(false);

    const option = [
      {label:"Mr."},{label:"Mrs."}
    ]

      
    return(
        <div className="p-4">
            <div className="mb-4">
            <CheckboxField label="Edit" edit={edit} setEdit={setEdit}/>
            </div>
            <div className="mb-8">
               {!edit && <SelectSearch options={option} label="DocType" required/>}
            </div>
            <div className="mb-8">
            <DatePickerComponent width="100%" label="Proposal Date"/>
                    </div>
                    <div className=" flex flex-row gap-1 mb-8">
                    <DatePickerComponent label="Effective Date" />
                    <DatePickerComponent label="Expiry Date"/>
                    </div>
                    <div>
                    <SelectSearch options={option} label="Calculation Option"/> 
                    </div>
        </div>
    );
}

export default InsuranceProposalForm;