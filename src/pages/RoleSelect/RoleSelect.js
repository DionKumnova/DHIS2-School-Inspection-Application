import React from 'react';
import { useDataQuery } from '@dhis2/app-runtime'
import RoleSelectGroup from './RoleSelectGroup';
import PageSelectGroup from './PageSelectGroup';
import DistrictSelectGroup from './DistrictSelectGroup';
import '../../styles/RoleSelect.css';
import { IconArrowRight24 } from '@dhis2/ui';

const RoleSelect = ({
    handleRoleSelect,
    isConnected,
    setActivePage,
    role,
    district,
    setDistrict,
    handleSchool,
    school
}) => {
    const schoolInspectorProps = {
        buttons: [
            {
                text: 'Inspection',
                helpText: 'Start a new school inspection',
                icon: <IconArrowRight24/>, 
                onClick: () => setActivePage('Inspection')
            },
            {
                text: 'Reports',
                helpText: 'View inspection and resource reports',
                icon: <IconArrowRight24/>, 
                onClick: () => setActivePage('ViewReports')
            }
        ]
    }

    const headTeacherProps = {
        buttons: [
            {
                text: 'Resource Count',
                helpText: 'Start a new resource count',
                icon: <IconArrowRight24/>, 
                onClick: () => setActivePage('ResourceCount')
            },
            {
                text: 'Reports',
                helpText: 'View inspection and resource reports',
                icon: <IconArrowRight24/>, 
                onClick: () => setActivePage('ViewReports')
            }
        ]
    }

    // Check location selection based on role
    const isLocationSelected = role === 'School Inspector' 
        ? district?.name 
        : (district?.name && school?.name);
    
    return (
        <div className="roleContainer">
            <h1 style={{ margin: '0rem' }} >Edutopia School Management System</h1>
            
            <RoleSelectGroup role={role} handleRoleSelect={handleRoleSelect} />
            
            {role && role !== "null" && (  
                <>
                    <DistrictSelectGroup
                        isConnected={isConnected}
                        district={district}
                        setDistrict={setDistrict}
                        handleSchool={handleSchool}
                        school={school}
                        showSchoolSelect={role === 'Head Teacher' && district?.name}
                    />
                </>
            )}
            
            {isLocationSelected && (
                <PageSelectGroup 
                    buttons={role === 'School Inspector' 
                        ? schoolInspectorProps.buttons 
                        : headTeacherProps.buttons
                    } 
                />
            )}
        </div>
    );
}

export default RoleSelect;
