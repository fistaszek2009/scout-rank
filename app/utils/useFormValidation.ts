import { useState } from "react";

export type ValidationError = Record<string, string | undefined>;

type ValidationFunctions = Record<string, (value: string) => string | undefined>;

export function useFormValidation(
  initialFields: Record<string, string>,
  validators: ValidationFunctions
) {
  const [values, setValues] = useState(initialFields);
  const [errors, setErrors] = useState<ValidationError>({});

  const handleFieldChange = (value: string, field: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    const newErrors = { ...errors };
    delete newErrors[field];

    if (validators[field]) {
      const error = validators[field](value);
      if (error) newErrors[field] = error;
    }

    setErrors(newErrors);
  };

  const validateAll = (): boolean => {
    const newErrors: ValidationError = {};

    Object.keys(validators).forEach((field) => {
      const error = validators[field](values[field] || "");
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setApiError = (message: string) => {
    setErrors((prev) => ({ ...prev, api: message }));
  };

  const clearApiError = () => {
    setErrors((prev) => {
      const { api, ...rest } = prev;
      return rest;
    });
  };

  return {
    values,
    errors,
    handleFieldChange,
    validateAll,
    setApiError,
    clearApiError,
    setErrors
  };
}
