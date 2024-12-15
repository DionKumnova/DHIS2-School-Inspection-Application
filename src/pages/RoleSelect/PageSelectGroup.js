import React from 'react';
import { Button } from '@dhis2/ui';
import '../../styles/RoleSelect.css';

export const PageSelectGroup = ({ buttons }) => {
    return (
        
       <div > <h3 style={{ marginBottom: '0rem', marginTop: "1rem"}}>What do you want to do today?</h3>
            <div className="button-group">

                {buttons.map((button, index) => (
                    <Button
                        className="custom-button"
                        large
                        key={index}
                        onClick={button.onClick}
                    >
                        <div className="button-content">
                            <div className="button-text">
                                <div className="button-title">{button.text}</div>
                                <div className="button-helptext">{button.helpText}</div>
                            </div>
                            <span className="button-icon">{button.icon}</span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default PageSelectGroup;