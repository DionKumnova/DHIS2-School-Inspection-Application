import React, { useState } from "react";
import {
    Table,
    TableHead,
    TableRowHead,
    TableBody,
    TableRow,
    TableCell,
    SingleSelect,
    SingleSelectOption,
    CircularLoader,
    IconHome24,
    Button,
} from "@dhis2/ui";
import "../styles/ReportTemplate.css";

const ReportTemplate = ({
    reportNames,
    name,
    setSelected,
    data,
    reportType,
    setReportType,
    schools,
    selectedSchoolName,
    onSchoolSelect,
    schoolsLoading,
    schoolsError,
    onRefresh,
    reverseReports = false, // New prop to control report order
}) => {
    const [sortConfig, setSortConfig] = useState({
        column: null,
        direction: null,
    });

    // To extract notes and display it separately
    const filteredData = data.filter(item => item.displayName !== "Notes");
    const notesData = data.find(item => item.displayName === "Notes");

    const getColumns = () => {
        if (reportType === "School Inspection Report") {
            return [
                { key: "displayName", label: "Field" },
                { key: "value", label: "Value" },
            ];
        } else {
            return [
                { key: "displayName", label: "Resource" },
                { key: "value", label: "Amount" },
                { key: "standard", label: "Previous Amount" },
                { key: "discrepancy", label: "Difference" },
            ];
        }
    };

    const handleSort = (column) => {
        setSortConfig((prevConfig) => {
            const newDirection =
                prevConfig.column === column && prevConfig.direction === "asc"
                    ? "desc"
                    : prevConfig.column === column &&
                      prevConfig.direction === "desc"
                    ? null
                    : "asc";
            return { column, direction: newDirection };
        });
    };

    const formatValue = (value, type) => {
        const ratings = {
            1: 'Poor',
            2: 'Fair',
            3: 'Neutral',
            4: 'Good',
            5: 'Excellent'
        };
    
        switch (type) {
            case 'segmented':
                if (value === null) return 'Not Applicable';
                return ratings[value] || value;
            case 'radio':
                if (value === true) return 'Yes';
                if (value === false) return 'No';
                return value;
            case 'number':
                if (value === null) return '-';
                return value.toString();
            case 'text':
                if (!value) return '-';
                return value;
            default:
                return value;
        }
    };

    const getSortedData = () => {
        if (!sortConfig.column || !sortConfig.direction) return filteredData;

        return [...filteredData].sort((a, b) => {
            if (sortConfig.direction === "asc") {
                return a[sortConfig.column] > b[sortConfig.column] ? 1 : -1;
            } else if (sortConfig.direction === "desc") {
                return a[sortConfig.column] < b[sortConfig.column] ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedData = getSortedData();
    const columns = getColumns();

    const renderTableCell = (item, column) => {
        if (column.key === "value") {
            return formatValue(item.value, item.type);
        }
        if (
            column.key === "standard" &&
            reportType === "Resource Count Report"
        ) {
            return item.standard;
        }
        if (
            column.key === "discrepancy" &&
            reportType === "Resource Count Report"
        ) {
            return item.discrepancy;
        }
        return item[column.key];
    };

    const isValidSchool = schools.some(s => s.name === selectedSchoolName);

    // Determine the order of reports based on the reverseReports prop
    const displayedReportNames = reverseReports
        ? [...reportNames].reverse()
        : reportNames;

    return (
        <div className="container">
            <h1 className="header-title">Previous Inspection Reports</h1>        

            <div className="main-content">
                {/* Sidebar Section */}
                <div className="sidebar">
                    {/* School Selection */}
                    <div style={{ marginBottom: '1.5rem', width: '270px' }}>
                        <h2 className="section-title">
                            <IconHome24 /> Select School
                        </h2>
                        <SingleSelect
                            placeholder="Select a school"
                            loading={schoolsLoading}
                            error={schoolsError}
                            selected={isValidSchool ? selectedSchoolName : ''}
                            onChange={({ selected }) => onSchoolSelect(selected)}
                        >
                            {schools && schools.map(school => (
                                <SingleSelectOption
                                    key={school.id}
                                    value={school.name}
                                    label={school.name}
                                />
                            ))}
                        </SingleSelect>
                        {schoolsLoading && <CircularLoader small />}
                    </div>
                    
                    {/* Report Type Selection */}
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", marginTop: "0rem"}}>
                        Select Report Type
                    </h3>
                    <div className="button-group">
                        <Button
                            className={`custom-button ${reportType === "School Inspection Report" ? "selected-button" : ""}`}
                            onClick={() => setReportType("School Inspection Report")}
                        >
                            Inspection Reports
                        </Button>
                        <Button
                            className={`custom-button ${reportType === "Resource Count Report" ? "selected-button" : ""}`}
                            onClick={() => setReportType("Resource Count Report")}
                        >
                            Resource Reports
                        </Button>
                    </div>

                    {/* Report Selection */}
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", marginTop: "0rem" }}>
                        Select Report
                    </h3>

                    <Table>
                        <TableBody>
                            {displayedReportNames.map((report, index) => (
                                <TableRow
                                    key={report.id || index} // Prefer using a unique id if available
                                    onClick={() => setSelected(reverseReports ? reportNames.length - 1 - index : index)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: name === report.name ? "#e0f2f1" : "#fff",
                                    }}
                                >
                                    <TableCell
                                        style={{
                                            fontWeight: name === report.name ? "bold" : "normal",
                                            color: name === report.name ? "#007bff" : "#000",
                                        }}
                                    >
                                        {report.name}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            style={{
                                                color: report.isSubmitted ? "#2e7d32" : "#e56408",
                                                fontWeight: "bold",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {report.isSubmitted ? "Submitted" : "Pending"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Refresh Button */}
                    {selectedSchoolName && (
                        <div className="refresh-button">
                            <Button
                                secondary
                                onClick={onRefresh}
                            >
                                Refresh Reports
                            </Button>
                        </div>
                    )}
                </div>

                {/* Data Table Section */}
                <div className="data-table">
                    <h4 className="data-title">
                        {name ? ` ${name}` : "Select a report to view"}
                    </h4>

                    <Table>
                        <TableHead>
                            <TableRowHead>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={
                                            sortConfig.column === column.key
                                                ? sortConfig.direction === "asc"
                                                    ? "sorted-asc"
                                                    : sortConfig.direction === "desc"
                                                    ? "sorted-desc"
                                                    : ""
                                                : ""
                                        }
                                        onClick={() => handleSort(column.key)}
                                    >
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                            {column.label}
                                            <span className="sort-icons">
                                                <span>▲</span>
                                                <span>▼</span>
                                            </span>
                                        </span>
                                    </th>
                                ))}
                            </TableRowHead>
                        </TableHead>
                        <TableBody>
                            {sortedData && sortedData.length > 0 ? (
                                sortedData.map((item, index) => (
                                    <TableRow key={index}>
                                        {columns.map((column) => (
                                            <TableCell key={column.key}>
                                                {renderTableCell(item, column)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="no-data">
                                        No report has been selected
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Report Summary */}
                    {reportType === "School Inspection Report" && notesData && (
                        <div className="report-summary">
                            <h4>Report Summary</h4>
                            <textarea
                                readOnly
                                value={notesData.value || 'No notes available'}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportTemplate;
