import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import MaskedInput from 'react-text-mask';

const oldPhoneFormat = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
const newPhoneFormat = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

const MaskedTextField = ({
  field, id, label, validateZap, touch, isTouched,
}:{field:any,
  id:string,
  label:string,
  validateZap:(zap:string)=>void,
  touch:()=>void,
  isTouched:boolean }) => {
  const getOnlyNumbers = (value:any) => {
    if (!value) {
      return value;
    }
    return value.replace(/\D+/g, '');
  };

  const getMaskByValue = (value:any) => {
    if (value.length > 10) {
      return newPhoneFormat;
    }
    return oldPhoneFormat;
  };
  const [definedMask, setDefinedMask] = useState(getMaskByValue(field.input.value));

  function MaskedInputConfigured(props:any) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={definedMask}
        placeholderChar={'\u2000'}
      />
    );
  }

  const handleOnBlur = (event: any) => {
    const value = getOnlyNumbers(event.currentTarget.value);
    const target = { ...event.currentTarget, value };
    field.input.onChange({ target });
    setDefinedMask(getMaskByValue(value));
    validateZap(value);
    touch();
  };

  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      fullWidth
      onBlur={handleOnBlur}
      error={isTouched && field.meta.invalid}
      helperText={
         isTouched && field.meta.invalid && field.meta.error
        }
      InputProps={{ inputComponent: MaskedInputConfigured }}
      defaultValue={field.input.value}
    />
  );
};

export default MaskedTextField;
