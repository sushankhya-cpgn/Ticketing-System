import { useState } from "react";
import CheckboxField from "../Fields/CheckBoxField";
import TextFieldComponent from "../Fields/TextFieldComponent";
import ButtonComponent from "../Buttons/button";
import SearchIcon from '@mui/icons-material/Search';
import { useFormContext } from "react-hook-form";


export default function ClientDetails(){
      const [client, setClient] = useState(false);
      const {
          register,
          formState: { errors },
        } = useFormContext();
      
    return(
        <div className={`${client ? "justify-evenly" : ""} flex flex-wrap items-center`}>
        <CheckboxField label="Client" edit={client} setEdit={setClient} />
        {!client && (
          <div className="flex flex-row gap-6 items-center">
            <TextFieldComponent label="Client" name="clientName" register={register} error={errors.clientName} required/>
            <ButtonComponent startIcon={<SearchIcon />} color="primary" label="Client" width="200px" />
            <ButtonComponent
              startIcon={<SearchIcon />}
              color="primary"
              label="Multi"
              width="200px"
            />
          </div>
        )}
      </div>
    );
}