import React, { useState, useEffect } from 'react';
import { Input } from '@dhis2/ui';

const NumberField = ({ name, label, onChange, valueName, fieldData }) => {
    const [selected, setSelected] = useState(fieldData.value === null ? "" : fieldData.value);
    const [isTouched, setIsTouched] = useState(false);

    const isPositiveInteger = (value) => {
        if (value === "" || value === null) return false;        
        const num = Number(value);
        return !isNaN(num) && Number.isInteger(num) && num >= 0;        
    };

    useEffect(() => {
        if (selected !== null && selected !== "") {
            const num = Number(selected);
            if (!isNaN(num)) {
                onChange(num, valueName);
            } else {
                onChange(null, valueName);
            }
        } else {
            onChange(null, valueName);
        }
    }, [selected]);

    // Add this useEffect to reset the state when fieldData.value changes
    useEffect(() => {
        setSelected(fieldData.value === null ? "" : fieldData.value);
        setIsTouched(false);
    }, [fieldData.value]);

    const isValid = isPositiveInteger(fieldData.value);
    const showError = isTouched && !isValid;

    return (
        <>
            <div>
                <p style={{ margin: '0 0 0.5em 0' }}>{label}</p>
                <div style={{ width: '30%' }}>
                    <Input
                        value={fieldData.value !== null ? String(fieldData.value) : ""}
                        key={name}
                        name={name}
                        valid={isTouched ? isValid : undefined}
                        error={showError}
                        placeholder='Enter a number...'
                        type='number'
                        onChange={(e) => {
                            setSelected(e.value);
                            setIsTouched(true);
                        }}
                        onBlur={() => setIsTouched(true)}
                        min="0"
                        required
                    />
                </div>
                {showError && (
                    <span style={{ color: 'red', marginTop: '0.5em', display: 'block', fontSize: '14px' }}>
                        {'Please enter a number (for example: 3)'}
                    </span>
                )}
            </div>
        </>
    );
};

export default NumberField;
