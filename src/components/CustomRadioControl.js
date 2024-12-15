import React, { useState } from 'react';
import { Radio } from "@dhis2/ui";

const CustomRadioControl = ({ label, onChange, fieldData, valueName, helpText }) => {
    return (
        <div>
            <p style={{ margin: '0 0 0.25em 0' }}>{label}</p>
            {helpText && (
                <p style={{
                    margin: '0 0 0.75em 0',
                    fontSize: '0.9em',
                    color: '#666666',
                    fontStyle: 'italic',
                    marginBottom: "1.11em"
                }}>
                    {helpText}
                </p>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Radio
                    label="Yes"
                    name={valueName}
                    value="true"
                    checked={fieldData.value === true}
                    onChange={({ value }) => {
                        onChange(true, valueName);
                    }}
                />
                <Radio
                    label="No"
                    name={valueName}
                    value="false"
                    checked={fieldData.value === false}
                    onChange={({ value }) => {
                        onChange(false, valueName);
                    }}
                />
            </div>
        </div>
    );
}

export default CustomRadioControl; 