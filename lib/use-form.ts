"use client";

import { useState, useCallback } from "react";
// import type { ValidationError } from "./validation"
import type { ValidationError } from "./validation";

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  submitError: string | null;
}

export function useForm<T extends Record<string, unknown>>(initialData: T) {
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: [],
    isSubmitting: false,
    submitError: null,
  });

  const updateField = useCallback((field: keyof T, value: string) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
      errors: prev.errors.filter((error) => error.field !== field),
      submitError: null,
    }));
  }, []);

  const setErrors = useCallback((errors: ValidationError[]) => {
    setState((prev) => ({
      ...prev,
      errors,
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  }, []);

  const setSubmitError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      submitError: error,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      errors: [],
      isSubmitting: false,
      submitError: null,
    });
  }, [initialData]);

  const getFieldError = useCallback(
    (field: string) => {
      return (
        state.errors.find((error) => error.field === field)?.message || null
      );
    },
    [state.errors]
  );

  return {
    ...state,
    updateField,
    setErrors,
    setSubmitting,
    setSubmitError,
    reset,
    getFieldError,
  };
}
