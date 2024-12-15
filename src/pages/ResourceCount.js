import React, { useState, useEffect, useCallback, useContext } from 'react';
import { CircularLoader, AlertBar, Input } from '@dhis2/ui';
import { ReactFinalForm, Button, NoticeBox } from '@dhis2/ui';
import NumberField from '../components/NumberField';
import '../styles/Forms.css';
import '../styles/ResourceCount.css';
import { v4 as uuidv4 } from 'uuid';
import FormCacheModal from '../components/FormCacheModal';
import FormSuccessModal from '../components/FormSuccessModal';
import ErrorModal from '../components/ErrorModal';
import { ResourceFormDataContext } from '../context/ResourseFormContext';
import defaultResourceFormData from '../context/defaultResourceFormData';
import JSON5 from 'json5'; // Corrected import for JSON5
import FormUtilityBar from '../components/FormUtilityBar';
import useLocalStorage from '../context/useLocalStorage';
const { Form } = ReactFinalForm;
const isFormDataEqual = (data1, data2) => {
    const fields1 = { ...data1.fields };
    const fields2 = { ...data2.fields };


    // Maybe not needed? resourceCountDate is not a field, inspectionDate is
    if ("inspectionDate" in fields1 && "inspectionDate" in fields2) {
        delete fields1['inspectionDate'];
        delete fields2['inspectionDate'];

        return JSON.stringify(fields1) === JSON.stringify(fields2);
    }
    return false;
};

export const getMetadata = (school) => {
    return {
        id: uuidv4(),
        name: 'Resource Count Report',
        createdAt: new Date().toLocaleDateString(),
        type: 'resourcecount',
        orgUnit: school?.id,
    };
};

export function ResourceCount() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { formdata, setFormData, postQueue, setPostQueue, errorPost, dataPost, school, isConnected, standards, setStandards } = useContext(ResourceFormDataContext);
    const [formError, setError] = useState({
        status: false,
        message: '',
    });

    const handleFormChange = useCallback(
        (val, fieldName) => {
            setFormData((prevData) => ({
                ...prevData,
                metadata: getMetadata(school),
                fields: {
                    ...prevData.fields,
                    [fieldName]: {
                        ...prevData.fields[fieldName],
                        value: val,
                        touched: true,
                    },
                },
            }));
        },
        [setFormData]
    );


    const utilityItems = [
        {
            label: "Inspection Date",
            element: (
                <Input
                    type="date"
                    name="inspectionDate"
                    value={formdata.fields.inspectionDate?.value || 
                        new Date().toISOString().split('T')[0]}
                    required
                    onChange={(e) => handleFormChange(e.value, 'inspectionDate')}
                />
            )
        },
        {
            element: !isFormDataEqual(formdata, defaultResourceFormData) ? (
                <Button
                    name="clear button"
                    destructive
                    secondary
                    onClick={() => {
                        setStandardValues(formdata);
                    }}
                >
                    Clear Form
                </Button>
            ) : null
        }
    ];

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setError((prevError) => ({ ...prevError, status: false }));
    };

    const renderField = (fieldData, key) => {
        if (fieldData.type === 'number') {
            const lastYearValue = fieldData.standardValue || 0;
            const currentValue = fieldData.value || 0;
            const discrepancy = currentValue - lastYearValue;

            return (
                <div key={key} className="resourceRow">
                    <div className="fieldLabel">{fieldData.displayName}</div>
                    <div className="currentValue">
                        <NumberField
                            name={key}
                            label=""
                            onChange={handleFormChange}
                            valueName={key}
                            fieldData={formdata.fields[key]}
                        />
                    </div>
                    <div className="lastYearValue">
                        <Input
                            type="number"
                            label=""
                            value={lastYearValue.toString()}
                            readOnly
                        />
                    </div>
                    <div className={`discrepancy ${discrepancy < 0 ? "negative" : discrepancy > 0 ? "positive" : ""}`}>
                        <Input type="number" label="" value={fieldData.value !== null ? discrepancy.toString() : ""} readOnly />
                    </div>
                </div>
            );
        }
        return null;
    };

    const setStandardValues = () => {
        const newStandards = []
        const updatedFormdata = {
            ...defaultResourceFormData,
            fields: Object.entries(formdata.fields).reduce((acc, [key, field]) => {
                if (field.value !== null && field.form === 'resourceCount' && field.type === 'number') {
                    acc[key] = {
                        ...defaultResourceFormData.fields[key],
                        standardValue: field.value
                    };
                } else {
                    acc[key] = field;
                }
                newStandards.push(field.value);
                return acc;
            }, {})
        };
        setStandards({ ...standards, [school.id]: newStandards });
        setFormData(updatedFormdata);
    }
    useEffect(() => {
        if (errorPost) {
            setError({
                status: true,
                message: `An error occurred with the API while trying to submit the form .\n
                Please try again later or contact your local system administrator for assistance.`
            });
            //contact source: https://dhis2.org/contact/
            setIsModalOpen(true);
        }
    }, [errorPost]);

    const onSubmit = () => {
        const hasFormError = Object.entries(formdata.fields).some(([key, field]) => {
            if (field.form === 'resourceCount') {
                if (field.type === 'date') {
                    return !field.value;
                }
                return field.value === null || field.value === '';
            }
            return false;
        });

        if (hasFormError) {
            setError({
                status: true,
                message: 'One or more required fields were not filled in',
            });
            setIsModalOpen(true);
            return;
        }
        
        setPostQueue([...postQueue, formdata]);
        if (isConnected && !errorPost) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        setIsModalOpen(true);
        setStandardValues();
    };

    if (formdata) {
        return (
            <div>
                <div className="formContainer">
                    <div className='formHeader'>
                        <div className='titleSection'>
                            <h1 className='formTitle'>Resource Count Form</h1>
                            <div className='formSubtitle'>New Resource Count</div>
                        </div>
                    </div>

                    <FormUtilityBar items={utilityItems} className="rc-resourceUtilityBar" />

                    <Form
                        name="resourceCountForm"
                        onSubmit={onSubmit}
                        initialValues={formdata.fields}
                        subscription={{ values: true }}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="rc-inputContainer">
                                    <div className="resourceHeader">
                                        <div className="fieldLabel">Resource</div>
                                        <div className="currentValue">Current Count</div>
                                        <div className="lastCountValue">Last Count</div>
                                        <div className="discrepancy">Discrepancy</div>
                                    </div>

                                    {Object.entries(formdata.fields)
                                        .filter(([key, field]) => field.type === 'number')
                                        .map(([key, field]) => renderField(field, key))}
                                </div>

                                <div className="rc-reportContainer">
                                    <Button type="submit" primary>
                                        Submit Form
                                    </Button>
                                    {!isConnected && (
                                        <NoticeBox title="You are offline." warning>
                                            Your report is saved but will not be submitted until you are online.
                                        </NoticeBox>
                                    )}
                                </div>
                            </form>
                        )}
                    </Form>
                </div>

                {/* {loading && (<CircularLoader />)} */}

                
                {isModalOpen && (formError.status || errorPost) && (
                    <ErrorModal onClose={handleCloseModal} message={formError.message} />
                )}
                {isModalOpen && !isConnected && !formError.status && < FormCacheModal onClose={handleCloseModal} />}
                {isModalOpen && isConnected && (!formError.status && dataPost) && (
                    <FormSuccessModal onClose={handleCloseModal} />
                )}

                {showAlert && dataPost && (
                    <div style={{
                        bottom: '2em',
                        left: '14em',
                        paddingLeft: 16,
                        position: 'fixed',
                        width: '100%',
                        zIndex: 1000,
                    }}>
                        <AlertBar success>Form submitted successfully!</AlertBar>
                    </div>
                )}
            </div>
        );
    }
    return null;
}
