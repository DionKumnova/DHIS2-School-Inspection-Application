import React, { useState, useEffect } from 'react';
import { SegmentedControl } from "@dhis2/ui";

const CustomSegmentedControl = ({
    name,
    label,
    onChange,
    fieldData,
    valueName,
    helpText
}) => {
    const [selected, setSelected] = useState(fieldData.value !== null ? String(fieldData.value) : "3");

    useEffect(() => {
        // Get the corresponding radio button field name
        const radioFieldName = valueName.replace(" condition", "");
        const facilityExists = fieldData.facilityExists;

        // Only set default value if facility exists
        if (fieldData.value === null && facilityExists) {
            onChange(3, valueName);
        } else if (!facilityExists) {
            onChange(null, valueName);
        }
    }, [fieldData.facilityExists]);

    const options = [
        { label: 'Poor', value: "1" },
        { label: 'Fair', value: "2" },
        { label: 'Neutral', value: "3" },
        { label: 'Good', value: "4" },
        { label: 'Excellent', value: "5" }
    ];

    return (
        <div>
            <p style={{ margin: '0 0 0.25em 0' }}>{label}</p>
            {helpText && (
                <p style={{
                    margin: '0 0 0.75em 0',
                    fontSize: '0.9em',
                    color: '#666666',
                    fontStyle: 'italic'
                }}>
                    {helpText}
                </p>
            )}
            <SegmentedControl
                key={name}
                value={selected}
                ariaLabel="Segmented control label"
                onChange={(value) => {
                    setSelected(value.value);
                    onChange(Number(value.value), valueName);
                }}
                options={options}
                selected={selected}
            />
        </div>
    );
}

export default CustomSegmentedControl;
