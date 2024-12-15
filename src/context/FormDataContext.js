import React, { createContext } from 'react';
import useLocalStorage from '../context/useLocalStorage';
import defaultFormData from './defaultFormData'; // Ensure correct path

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
    const [formdata, setFormData] = useLocalStorage("formdata", defaultFormData) ?? defaultFormData;
    if (formdata === null) {
        setFormData(defaultFormData);
    }
    return (
        <FormDataContext.Provider value={{ formdata, setFormData }}>
            {children}
        </FormDataContext.Provider>
    );
};