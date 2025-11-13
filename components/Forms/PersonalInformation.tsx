import { useFormContext } from "react-hook-form";
import TextFieldComponent from "../Fields/TextFieldComponent";
import RomanToNepaliInput from "../Fields/NepaliInput";

export default function PersonalInformation(){
    const {
        register,
        formState: { errors },
      } = useFormContext();
    
    return(
        <>
        <div className="grid grid-cols-2 gap-6">
        <TextFieldComponent label="Insured Name" name="insuredName" register={register} error={errors} />
        <RomanToNepaliInput
          label="Name(Nepali)"
          name="insuredNameNepali"
          register={register}
          required
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <TextFieldComponent label="District" name="district" register={register} error={errors.district} required/>
        <TextFieldComponent label="VDC/Municipality" name="vdcMunicipality" register={register} error={errors.vdcMunicipality} />
        <TextFieldComponent label="Ward No." name="wardNo" register={register} error={errors.wardNo} required/>
        <TextFieldComponent label="Street/Tole" name="streetTole" register={register} error={errors.streetTole} required />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TextFieldComponent label="Full Address" name="fullAddress" register={register} error={errors.fullAddress} required />
        <RomanToNepaliInput
  label="Address(Nepali)"
  name="addressNepali"
  register={register}
  required
  errors={errors}
/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <TextFieldComponent label="Email Address" name="emailAddress" register={register} error={errors.emailAddress} />
        <TextFieldComponent label="CC Email Address" name="ccEmailAddress" register={register} error={errors.ccEmailAddress} />
        <TextFieldComponent label="Mobile" name="mobile" register={register} error={errors.mobile} required/>
        <TextFieldComponent label="Pan/Vat No" name="panVatNo" register={register} error={errors.panVatNo} />
        <TextFieldComponent label="Pesa" name="pesa" register={register} error={errors.pesa} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TextFieldComponent label="Prashtawak Name" name="prashtawakName" register={register} error={errors.prashtawakName} />
        <TextFieldComponent label="Prashtawak Thegana" name="prashtawakThegana" register={register} error={errors.prashtawakThegana} />
        <TextFieldComponent label="Reference Text" name="referenceText" register={register} error={errors.referenceText} />
      </div>
      </>
    );
}