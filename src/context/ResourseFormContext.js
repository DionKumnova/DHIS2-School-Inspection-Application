import React, { createContext, useEffect } from 'react';
import useLocalStorage from '../context/useLocalStorage';
import defaultResourceFormData from './defaultResourceFormData'; // Ensure correct path
import resourceFormMutation from '../mutations/resourceFormMutation';
import { useDataMutation } from '@dhis2/app-runtime';

export const ResourceFormDataContext = createContext();

export const ResourceFormDataProvider = ({
    children,
    isConnected,
    school,
    reports,
    setReports,
    offlineReports,
    setOfflineReports
}) => {
    const [formdata, setFormData] = useLocalStorage("resourceFormData", defaultResourceFormData);
    const [postQueue, setPostQueue] = useLocalStorage("resourcePostQueue", []);

    const [standards, setStandards] = useLocalStorage("standards", []);
    const [mutate, { loading: loadingPost, error: errorPost, data: dataPost, called: calledPost }] = useDataMutation(resourceFormMutation)

    useEffect(() => {
        if (isConnected) {
            if (postQueue && postQueue.length > 0 && school.id in reports) {
                postQueue.forEach(form => {
                    const dataValues = Object.entries(form.fields)
                        .filter(([key, field]) => field.id !== 'inspectionDate') // Exclude inspectionDate
                        .map(([key, field]) => ({
                            dataElement: field.id,
                            value: field.value
                        }));
                    mutate({
                        orgUnit: school.id,
                        eventDate: form.fields.inspectionDate.value,
                        status: "COMPLETED",
                        dataValues: dataValues
                    });
                    form.metadata.isSubmitted = true;
                    console.log(form, "submitted resource form")
                    setReports({ ...reports, [school.id]: [...reports[school.id], form] });
                });
                setPostQueue([]);
                setOfflineReports({ ...offlineReports, [school.id]: [] });
            }
        }
    }, [isConnected, postQueue]);

    useEffect(() => {
        if (!isConnected && postQueue.length && postQueue.at(-1).metadata.orgUnit in offlineReports) {
            setOfflineReports({ ...offlineReports, [postQueue.at(-1).metadata.orgUnit]: [...offlineReports[postQueue.at(-1).metadata.orgUnit], postQueue.at(-1)] });
        }
        console.log(postQueue, "resourcePostQueue")
    }, [postQueue]);

    useEffect(() => {
        if (!(school.id in standards)) {
            setStandards({ ...standards, [school.id]: [] });
        }
        else if (formdata && standards[school.id].length) {
            Object.entries(formdata.fields).forEach(([key, field], index) => {
                if (key !== "inspectionDate") {
                    if (!standards[school.id].includes(field.value)) {
                        formdata.fields[key].standardValue = standards[school.id].at(index)
                    }
                }
            });
        }
        console.log(standards, "standards")
    }, [school]);

    if (formdata === null) {
        setFormData(defaultResourceFormData);
    }

    return (
        <ResourceFormDataContext.Provider value={{
            formdata,
            setFormData,
            postQueue,
            setPostQueue,
            errorPost,
            dataPost,
            school,
            isConnected,
            reports,
            offlineReports,
            standards,
            setStandards
        }}>
            {children}
        </ResourceFormDataContext.Provider>
    );
};
