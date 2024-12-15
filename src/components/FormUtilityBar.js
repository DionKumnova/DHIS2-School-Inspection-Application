import React from 'react';
import '../styles/Forms.css';

const FormUtilityBar = ({ items, className }) => {
    return (
        <div className={`utilityBar ${className || ''}`}>
            {items.map((item, index) => (
                <div key={index} className='utilityItem'>
                    {item.label && <span className='utilityLabel'>{item.label}</span>}
                    {item.element}
                </div>
            ))}
        </div>
    );
};

export default FormUtilityBar;