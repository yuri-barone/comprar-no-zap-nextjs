import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import MaskedInput from 'react-text-mask';

const oldPhoneFormat = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
const newPhoneFormat = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

const MaskedTextField = ({ field, id, label }:{field:any, id:string, label:string}) => {
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
        showMask
      />
    );
  }

  const handleOnBlur = (event: any) => {
    const value = getOnlyNumbers(event.currentTarget.value);
    const target = { ...event.currentTarget, value };
    field.input.onChange({ target });
    setDefinedMask(getMaskByValue(value));
  };

  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      fullWidth
      onBlur={handleOnBlur}
      error={field.meta.touched && field.meta.invalid}
      helperText={
          field.meta.touched && field.meta.invalid && field.meta.error
        }
      InputProps={{ inputComponent: MaskedInputConfigured }}
      defaultValue={field.input.value}
    />
  );
};

export default MaskedTextField;
