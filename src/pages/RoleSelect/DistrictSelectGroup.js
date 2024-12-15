import React, { useEffect, useState } from 'react';
import { SingleSelect, SingleSelectOption, CircularLoader, IconDimensionOrgUnit16, IconHome16 } from '@dhis2/ui';
import schoolsQuery from '../../queries/schoolsQuery';
import { useDataQuery } from '@dhis2/app-runtime';
import '../../styles/RoleSelect.css';
import useLocalStorage from '../../context/useLocalStorage';

export const DistrictSelectGroup = ({
    isConnected,
    district,
    setDistrict,
    handleSchool,
    school,
    showSchoolSelect
}) => {
    const [schools, setSchools] = useLocalStorage("schools", []);

    const [selectedSchoolName, setSelectedSchoolName] = useState(school?.name || '');
    const schoolResponse = useDataQuery(schoolsQuery, {
        onComplete: (data) => {
            if (data.dataSet.children) {
                setSchools(data.dataSet.children);
            }
        }
    });

    const isValidSchool = schools.some(s => s.name === selectedSchoolName);


    return (
        <div className="roleContainer" style={{ margin: "0 0 0 0" }}>
            <h3 className="label-select-district"><IconDimensionOrgUnit16 /> Select District:</h3>
            <SingleSelect
                className="select"
                placeholder="Select a district"
                onChange={({ selected }) => {
                    // When Jambalaya is selected, update the district
                    if (selected === "Jambalaya Cluster") {
                        const jambalaya = {
                            id: "Jj1IUjjPaWf",
                            name: "Jambalaya Cluster"
                        };
                        setDistrict(jambalaya);
                    }
                }}
                selected={district?.name || ''}
            >
                <SingleSelectOption
                    key="Jj1IUjjPaWf"
                    label="Jambalaya Cluster"
                    value="Jambalaya Cluster"
                />
            </SingleSelect>

            {showSchoolSelect && (
                <>
                    <h3 className="labels"><IconHome16 /> Select School:</h3>
                    <SingleSelect
                        className="select"
                        placeholder="Select a school"
                        loading={schoolResponse.loading}
                        error={schoolResponse.error}
                        selected={isValidSchool ? selectedSchoolName : ''}
                        onChange={({ selected }) => {
                            const selectedSchool = schools.find(s => s.name === selected);
                            handleSchool(selectedSchool);
                            setSelectedSchoolName(selected);
                            localStorage.setItem("school", selectedSchool)
                        }}
                    >
                        {schools && schools.map(schoolElement => (
                            <SingleSelectOption
                                key={schoolElement.id}
                                value={schoolElement.name}
                                label={schoolElement.name}
                            />
                        ))}
                    </SingleSelect>
                    {schoolResponse.loading && <CircularLoader small />}
                </>
            )}
        </div>
    );
}

export default DistrictSelectGroup;
