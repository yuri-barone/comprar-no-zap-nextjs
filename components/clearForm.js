import { useEffect } from 'react';
import { useFormState } from 'react-final-form-hooks';

export default function ResetOnSubmitSuccess({ form, onSubmitSuccess }) {
  const state = useFormState(form, { submitSucceeded: true });

  useEffect(() => {
    if (state.submitSucceeded) {
      onSubmitSuccess();
    }
  }, [state.submitSucceeded]);

  return null;
}
