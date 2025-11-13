// components/forms/FormProviderWrapper.jsx
import React from 'react';
import { FormProvider, useForm } from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup'

interface FormProviderProps{
  children: React.ReactNode;
  onSubmit: (data:any)=> void;
  defaultValues?:object;
  schema?:any;
}

const FormProviderWrapper : React.FC <FormProviderProps> = ({ children, onSubmit, defaultValues = {},schema }) => {
  const methods = useForm({ defaultValues, resolver:yupResolver(schema),mode:"onBlur"});

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default FormProviderWrapper;
