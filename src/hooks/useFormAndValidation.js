import { useState, useCallback } from 'react';

//  Функция для получения состояния - значения, статус валидации и ошибки  //
export function useFormAndValidation() {
  const [values, setValues] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { value, name } = event.target;

    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: event.target.validationMessage });
    setIsValid(event.target.closest('.form').checkValidity());
  };

//  Очищаем форму - 1-ый аргумент = значения по умолчанию, 2-ой = зависимости  //
    const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid]
  );

  return { values, handleChange, errors, isValid, resetForm, setValues, setIsValid };
}


/* Старая версия - удалить
import React, { useState } from 'react'

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event) => {
    const {value, name} = event.target;
    setValues({...values, [name]: value});
  };
  return {values, handleChange, setValues};
}
*/