

const formatData = (formDataSet, role) => {
    if (!formDataSet) return [];

    const names = [];

    // Function to generate a unique name
    const generateUniqueName = (baseName) => {
        if (!names.includes(baseName)) {
            names.push(baseName);
            return baseName;
        }
        let counter = 1;
        let newName = `${baseName} (${counter})`;

        while (names.includes(newName)) {
            counter++;
            newName = `${baseName} (${counter})`;
        }

        names.push(newName);
        return newName;
    };
    if (!formDataSet || formDataSet.length <= 0) return [];
    const reportData = formDataSet.map(report => {
        if (Object.entries(report.fields).length <= 0) return {}

        const formFields = Object.entries(report.fields).filter(([key, field]) =>
            key !== "resourceCountDate" &&
            key !== "inspectionDate"
        ).map(([key, field]) => ({
            displayName: field.displayName,
            id: field.id,
            value: field.value,
            type: field.type,
            standard: field.displayName !== "Inspection Date" ? field.standardValue || 0 : "",
            discrepancy: field.displayName !== "Inspection Date" ? (field.value || 0) - (field.standardValue || 0) : ""
        }));

        // Get the appropriate date based on report type
        const dateValue = report.fields.inspectionDate?.value;

        const inspectionDate = new Date(dateValue);
        const formattedDate = inspectionDate.toLocaleDateString('en-GB');

        // Generate base name based on report type and date
        const baseName = `${report.metadata.type === "inspection" ? "School Inspection Report" : "Resource Count Report"} for ${formattedDate}`;
        const uniqueName = generateUniqueName(baseName);

        return {
            data: formFields,
            role: role,
            isSubmitted: report.metadata.isSubmitted,
            type: report.metadata.type === "inspection" ? "School Inspection Report" : "Resource Count Report",
            date: formattedDate,
            name: uniqueName
        };
    });

    return reportData;
};

const formatReportData = (formDataSet, role) => {
    const data = formatData(formDataSet, role);
    return data;
}



export default formatReportData;
