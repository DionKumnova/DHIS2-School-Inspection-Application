import React, { useState, useEffect, useCallback, useContext } from "react";
import {
    CircularLoader,
    MenuItem,
    SingleSelect,
    AlertBar,
    SingleSelectOption,
} from "@dhis2/ui";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import inspectionFormMutation from "../mutations/inspectionFormMutation";
import { useConfig } from "@dhis2/app-runtime";
import {
    ReactFinalForm,
    Button,
    Input,
    TextAreaField,
    NoticeBox,
    IconSync16,
} from "@dhis2/ui";
import NumberField from "../components/NumberField";
import CustomSegmentedControl from "../components/CustomSegmentedControl";
import CustomRadioControl from "../components/CustomRadioControl";
import "../styles/Forms.css";
import schoolsQuery from "../queries/schoolsQuery";
import defaultFormData from "../context/defaultFormData";
import { v4 as uuidv4 } from "uuid";
import FormCacheModal from "../components/FormCacheModal";
import FormSuccessModal from "../components/FormSuccessModal";
import FormUtilityBar from "../components/FormUtilityBar";
import ErrorModal from "../components/ErrorModal";
import { FormDataContext } from "../context/FormDataContext";
import JSON from "json5";
import useLocalStorage from "../context/useLocalStorage";
const { Form } = ReactFinalForm;

export function InspectionForm({
    isConnected,
    reports,
    setReports,
    offlineReports,
    setOfflineReports,
}) {
    const [schools, setSchools] = useLocalStorage("schools", []);
    const [school, setSchool] = useLocalStorage("inspectionSchool", {});
    const { loading, errorSchool, schoolData } = useDataQuery(schoolsQuery, {
        onComplete: (data) => {
            if (data.dataSet.children) {
                setSchools(data.dataSet.children);
            }
        },
    });
    const [mutate, { loading: loadingPost, error: errorPost, data: dataPost, called: calledPost }] = useDataMutation(inspectionFormMutation)

    const { formdata, setFormData } = useContext(FormDataContext);
    const handleSchoolChange = (newSchool) => {
        setSchool(newSchool);
    };
    const handleDateChange = (newDate) => {
        setFormData((prevData) => ({
            ...prevData,
            fields: {
                ...prevData.fields,
                inspectionDate: {
                    ...prevData.fields.inspectionDate,
                    value: newDate,
                    touched: true,
                },
            },
            metadata: {
                ...prevData.metadata,
                createdAt: newDate,
            },
        }));
    };
    const [postQueue, setPostQueue] = useLocalStorage("inspectionPostQueue", []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState({
        status: false,
        message: "",
    });

    const [canRefetch, setCanReFetch] = useState(
        formdata === defaultFormData ? false : true
    );
    const [showAlert, setShowAlert] = useState(false);

    const handleFormChange = useCallback((val, fieldName) => {
        setFormData((prevData) => ({
            ...prevData,
            fields: {
                ...prevData.fields,
                [fieldName]: {
                    ...prevData.fields[fieldName],
                    value: val,
                    touched: true,
                },
            },
        }));
    });

    const handleFormMetadataChange = useCallback((val) => {
        setFormData((prevData) => ({
            ...prevData,
            metadata: val,
        }));
    });

    useEffect(() => {
        if (!(school.id in reports)) {
            setReports({ ...reports, [school.id]: [] });
        }
        handleFormMetadataChange({
            id: uuidv4(),
            orgUnit: school.id,
            name: "School Inspection Report",
            createdAt: new Date().toLocaleDateString(),
            type: "inspection",
        });
    }, [school]);

    useEffect(() => {
        if (isConnected) {
            if (postQueue.length > 0) {
                postQueue.forEach((form) => {
                    const dataValues = Object.entries(form.fields)
                        .map(([key, field]) => ({
                            dataElement: field.id,
                            value: field.value,
                        }));
                    mutate({
                        orgUnit: form.metadata.orgUnit ?? school.id,
                        eventDate: form.fields.inspectionDate.value,
                        status: "COMPLETED",
                        dataValues: dataValues.filter(field =>
                            field.dataElement !== "inspectionDate" &&
                            field.dataElement !== "Notes"
                        ),
                        notesValue: form.fields.Notes.value,
                    });
                    form.metadata.isSubmitted = true;
                    setReports({ ...reports, [school.id]: [...reports[school.id], form] });
                    console.log("Fired off POST call");
                });
                setPostQueue([]);
                setOfflineReports({ ...offlineReports, [school.id]: [] });
            }
        }
    }, [isConnected, postQueue]);

    useEffect(() => {
        if (!isConnected && postQueue.length > 0 && !offlineReports[school.id].some(report => report.id === postQueue.at(-1).id)) {
            setOfflineReports({ ...offlineReports, [school.id]: [...offlineReports[school.id], postQueue.at(-1)] });
        }
        console.log(postQueue, "PostQueue");
    }, [postQueue]);


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setError((prevError) => ({ ...prevError, status: false }));
    };

    const renderField = (fieldData, key) => {
        if (fieldData.type === "segmented") {
            const facilityKey = key.replace(" condition", "");
            const facilityExists = formdata.fields[facilityKey]?.value === true;
            if (!facilityExists) {
                return null;
            }
            fieldData.facilityExists = facilityExists;
        }

        switch (fieldData.type) {
            case "segmented":
                return (
                    <CustomSegmentedControl
                        name={key}
                        label={fieldData.displayName}
                        onChange={handleFormChange}
                        valueName={key}
                        fieldData={fieldData}
                        helpText={fieldData.helpText}
                    />
                );
            case "radio":
                return (
                    <CustomRadioControl
                        name={key}
                        label={fieldData.displayName}
                        onChange={handleFormChange}
                        valueName={key}
                        fieldData={formdata.fields[key]}
                        helpText={fieldData.helpText}
                    />
                );
            case "number":
                return (
                    <NumberField
                        name={key}
                        label={fieldData.displayName}
                        onChange={handleFormChange}
                        valueName={key}
                        fieldData={formdata.fields[key]}
                    />
                );
            case "text":
                return (
                    <>
                        <TextAreaField
                            value={fieldData.value}
                            key={key}
                            name={key}
                            label="Report Summary"
                            valid={
                                fieldData.touched
                                    ? fieldData.value
                                        ? true
                                        : undefined
                                    : undefined
                            }
                            error={
                                fieldData.touched ? !fieldData.value : undefined
                            }
                            helpText={fieldData.helpText.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment> // hack to make each bullet point appear on its own line...
                            ))}
                            placeholder="Write a report to the Head Teacher..."
                            onChange={(e) => handleFormChange(e.value, key)}
                            min={""}
                            rows={8}
                        />
                        {fieldData.touched && !fieldData.value && (
                            <span
                                style={{
                                    color: "red",
                                    marginTop: "0.5em",
                                    display: "block",
                                }}
                            >
                                {
                                    "Please enter a text describing the inspection"
                                }
                            </span>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const handleRefresh = () => {
        setFormData(defaultFormData);
        setCanReFetch(true);
    };

    const utilityItems = [
        {
            label: "Select School",
            element: (
                <SingleSelect
                    className="utilitySelect"
                    placeholder="School"
                    selected={school.name}
                    onChange={({ selected }) => {
                        const selectedSchool = schools.find(
                            (s) => s.name === selected
                        );
                        handleSchoolChange(selectedSchool);
                    }}
                >
                    {schools.length &&
                        schools.map((schoolOption) => (
                            <SingleSelectOption
                                value={schoolOption.name}
                                key={schoolOption.id}
                                label={schoolOption.name}
                            />
                        ))}
                </SingleSelect>
            ),
        },
        {
            label: "Inspection Date",
            element: (
                <Input
                    type="date"
                    name="inspectionDate"
                    value={
                        formdata.fields.inspectionDate?.value ||
                        new Date().toISOString().split("T")[0]
                    }
                    required
                    onChange={(e) => handleDateChange(e.value)}
                />
            ),
        },
        {
            element: canRefetch ? (
                <Button
                    ariaLabel="Button"
                    name="clear button"
                    destructive
                    secondary
                    onClick={handleRefresh}
                    title="clear button"
                    value="default"
                >
                    Clear Form
                </Button>
            ) : null,
        },
    ];
    useEffect(() => {
        if (errorPost) {
            setError({
                status: true,
                message: `An error occurred while trying to submit the form.\n
                Please try again later or contact your local system administrator for assistance.`
            });
            //contact source: https://dhis2.org/contact/
            setIsModalOpen(true);
        }
    }, [errorPost]);


    const onSubmit = () => {
        const hasError = Object.entries(formdata.fields).some(([key, field]) => {
            // Skip validation for segmented controls if their facility doesn't exist
            if (field.type === "segmented") {
                const facilityKey = key.replace(" condition", "");
                const facilityExists = formdata.fields[facilityKey]?.value === true;
                return facilityExists ? field.value === null : false;
            }

            // Regular validation for other fields
            return field.value === null || field.value === "" || Object.keys(school).length === 0;
        });

        if (hasError) {
            setError({
                status: true,
                message: "One or more required fields were not filled in",
            });
            setIsModalOpen(true);
            return;
        }
        if (isConnected && !errorPost) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }

        setPostQueue([...postQueue, formdata]);
        setIsModalOpen(true);
        setFormData(defaultFormData);
    };

    if (formdata) {
        return (
            <div>
                <div className="formContainer">
                    <div className="formHeader">
                        <div className="titleSection">
                            <h1 className="formTitle">
                                School Inspection Form
                            </h1>
                            <div className="formSubtitle">New Inspection</div>
                        </div>
                    </div>

                    <FormUtilityBar items={utilityItems} />

                    <Form
                        name="inspectionForm"
                        onSubmit={onSubmit}
                        initialValues={formdata.fields}
                        subscription={{ values: true }}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="inputContainer">
                                    {Object.entries(formdata.fields)
                                        .filter(
                                            ([key, field]) =>
                                                field.form === "inspectionForm"
                                        )
                                        .map(([key, field]) => {
                                            return renderField(field, key);
                                        })}
                                </div>

                                <div className="reportContainer">
                                    <Button type="submit" primary>
                                        Submit Form
                                    </Button>
                                    {!isConnected && (
                                        <NoticeBox
                                            title="You are offline."
                                            warning
                                        >
                                            Your report is saved but will not be
                                            submitted until you are online.
                                        </NoticeBox>
                                    )}
                                </div>
                            </form>
                        )}
                    </Form>
                </div>
                {isModalOpen && isConnected && (error.status || errorPost) && (
                    <ErrorModal
                        onClose={handleCloseModal}
                        message={error.message}
                    />
                )}
                {isModalOpen && !isConnected && !error.status && (<FormCacheModal onClose={handleCloseModal} />)}
                {isModalOpen && isConnected && (!error.status && dataPost) && (<FormSuccessModal onClose={handleCloseModal} />)}
                {showAlert && dataPost && (
                    <div
                        style={{
                            bottom: "2em",
                            left: "14em",
                            paddingLeft: 16,
                            position: "fixed",
                            width: "100%",
                            zIndex: 1000,
                        }}
                    >
                        <AlertBar success>
                            Form submitted successfully!
                        </AlertBar>
                    </div>
                )}
            </div>
        );
    }
    return null;
}
