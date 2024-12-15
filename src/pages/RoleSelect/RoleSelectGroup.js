import React from 'react';
import { Button } from '@dhis2/ui';
import '../../styles/RoleSelect.css';

export const RoleSelectGroup = ({ role, handleRoleSelect }) => {
    return (
        <>
            <h3 style={{ marginTop: '1.5rem' , marginBottom: '0rem' }}>Select your role to begin</h3>
            <div className="button-group">
                <Button
                    className={`custom-button ${role === 'School Inspector' ? 'selected-button' : ''}`}
                    large
                    onClick={() => handleRoleSelect('School Inspector')}
                >
                    <div className="button-content">
                        <div className="button-text">
                            <div className="button-title">School Inspector</div>
                            <div className="button-helptext">Conduct school inspections and view reports</div>
                        </div>
                    </div>
                </Button>
                <Button
                    className={`custom-button ${role === 'Head Teacher' ? 'selected-button' : ''}`}
                    large
                    onClick={() => handleRoleSelect('Head Teacher')}
                >
                    <div className="button-content">
                        <div className="button-text">
                            <div className="button-title">Head Teacher</div>
                            <div className="button-helptext">Conduct resource counts and view reports</div>
                        </div>
                    </div>
                </Button>
            </div>
        </>
    );
}

export default RoleSelectGroup;