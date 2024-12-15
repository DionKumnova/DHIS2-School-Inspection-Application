import defaultFormData from "./defaultFormData";
import defaultResourceFormData from "./defaultResourceFormData";

const formatApiReportData = (data, type, setReports) => {
    console.log(data, "data")
    const newReports = []
    if (!data?.events?.events) return [];
    data.events.events.forEach((report) => {
        console.log(report, "report")
        const form = {
            metadata: {
                id: report.event,
                orgUnit: report.orgUnit,
                type: type,
                form: type,
                isSubmitted: true
            },
            fields: {
                inspectionDate: {
                    displayName: "Inspection Date",
                    value: new Date().toISOString().split('T')[0],
                    id: "inspectionDate",
                    type: "date",
                    form: type
                },
                Notes: {  // Initialize Notes field
                    displayName: "Notes",
                    value: report.notes?.[0]?.value || '',
                    id: "Notes",
                    type: "text",
                    form: type
                }
            }
        };
        if (report && report.dataValues) {
            form.metadata.id = report.event;
            form.metadata.orgUnit = report.orgUnit;
            form.metadata.type = type;
            form.metadata.form = type;
            form.metadata.isSubmitted = true;
            form.fields.inspectionDate = {
                displayName: "Inspection Date",
                value: new Date().toISOString().split('T')[0],
                id: "inspectionDate",
                type: "date",
                form: type

            };
            report.dataValues.forEach((field) => {
                form.fields[findFieldKey(field.dataElement, type)] = {
                    displayName: findFieldDisplayName(field.dataElement, type),
                    value: field.value,
                    id: field.dataElement,
                    type: findFieldType(field.dataElement, type),
                    form: type
                };
            });

            form.fields.Notes.value = report.notes.length ? report.notes[0].value : ""
            console.log(form, "form")
            newReports.push(form)
        }
    })
    return newReports;
}

const findFieldDisplayName = (id, type) => {
    if (type === "inspection") {
        Object.entries(defaultFormData.fields).forEach(([key, field]) => {
            if (field.id === id) {
                return field.displayName;
            }
        })
    }
    else {
        Object.entries(defaultResourceFormData.fields).forEach(([key, field]) => {
            if (field.id === id) {
                return field.displayName;
            }
        })
    }
}

const findFieldType = (id, type) => {
    if (type === "inspection") {
        Object.entries(defaultFormData.fields).forEach(([key, field]) => {
            if (field.id === id) {
                return field.type;
            }
        })
    }
    else {
        Object.entries(defaultResourceFormData.fields).forEach(([key, field]) => {
            if (field.id === id) {
                return field.type;
            }
        })
    }
}

const findFieldKey = (id, type) => {
    if (type === "inspection") {
        Object.entries(defaultFormData.fields).forEach(([key, field]) => {
            if (field.id === id) {
                return key;
            }
        })
        return ""
    }
    else {
        Object.entries(defaultResourceFormData.fields).forEach(([key, field]) => {
            if (field.id === id) {
                return key;
            }
        })
    }
}

export default formatApiReportData;