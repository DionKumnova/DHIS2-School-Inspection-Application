import React, { useState, useEffect } from 'react';
import ReportTemplate from '../components/ReportTemplate';
import formatReportData from '../context/formatReportData';
import { useDataQuery } from '@dhis2/app-runtime';
import eventsQuery from '../queries/eventsQuery';
import schoolsQuery from '../queries/schoolsQuery';
import useLocalStorage from '../context/useLocalStorage';
import formatApiReportData from '../context/formatApiReportsData';

const SCHOOL_INSPECTION_PROGRAM_ID = 'UxK2o06ScIe'
const RESOURCE_COUNT_PROGRAM_ID = 'gLQ233Sp6ul'

export const ViewReports = ({
    onlineReports,
    role,
    district,
    offlineReports,
    setAllReports
}) => {
    // School selection state with localStorage
    const [schools, setSchools] = useLocalStorage("schools", []);
    const [selectedSchool, setSelectedSchool] = useLocalStorage("viewReportsSelectedSchool", {
        id: "tfip7hOsZct", name: "Rev. J. C. Faye Memorial LBS (Banjul)"
    });
    const [selectedSchoolName, setSelectedSchoolName] = useLocalStorage("viewReportsSelectedSchoolName", '');
 
    const schoolResponse = useDataQuery(schoolsQuery, {
        onComplete: (data) => {
            if (data.dataSet.children) {
                setSchools(data.dataSet.children);
            }
        }
    });
    const { loading: loadingSchoolInspectionEvents, error: errorSchoolInspectionEvents, data: dataSchoolInspectionEvents, refetch: schoolInspectionRefetch } = useDataQuery(eventsQuery, {
        variables: {
            orgUnit: selectedSchool.id, // change to the selectedSchool id instead, when school selection is implemented
            program: SCHOOL_INSPECTION_PROGRAM_ID
        }
    })

    const { loading: loadingResourceCountEvents, error: errorResourceCountEvents, data: dataResourceCountEvents, refetch: resourceCountRefetch } = useDataQuery(eventsQuery, {
        variables: {
            orgUnit: selectedSchool.id, // change to the selectedSchool id instead, when school selection is implemented
            program: RESOURCE_COUNT_PROGRAM_ID
        }
    }
    )
    // Reports state
    const [reports, setReports] = useState([]);
    const [reportType, setReportType] = useState('School Inspection Report');
    const [index, setIndex] = useState(0);

    // Update reports when school changes
    useEffect(() => {
        if (selectedSchool) {
            const schoolReports = onlineReports[selectedSchool.id]?.concat(offlineReports[selectedSchool.id]) || [];
            setReports(schoolReports);
        } else {
            setReports([]);
        }
        console.log(dataResourceCountEvents)
    }, [selectedSchool, onlineReports, offlineReports]);

    const [reportData, setReportData] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const formattedData = formatReportData(reports, role);
        setReportData(formattedData);
    }, [reports, role]);

    const getFilteredReportData = () => {
        return reportData.filter(report => report.type === reportType && report.date !== 'Unknown Date');
    };

    const getReportList = () => {
        const filteredData = getFilteredReportData();
        if (!filteredData.length) {
            return [];
        }
        return filteredData.map(report => ({
            name: report.name,
            isSubmitted: report.isSubmitted
        }));
    };

    useEffect(() => {
        const filteredData = getFilteredReportData();
        setSelected(filteredData.length ? filteredData[index] : null);
    }, [index, reportType, reportData]);

    useEffect(() => {
        setIndex(0);
    }, [reportType]);

    // Validate stored school 
    useEffect(() => {
        if (selectedSchool && schools.length > 0) {
            const schoolStillExists = schools.some(s => s.id === selectedSchool.id);
            if (!schoolStillExists) {
                setSelectedSchool(null);
                setSelectedSchoolName('');
            }
        }
    }, [schools]);

    const handleSchoolSelect = (selected) => {
        const school = schools.find(s => s.name === selected);
        setSelectedSchool(school);
        setSelectedSchoolName(selected);
        setIndex(0);
    };

    const handleRefresh = () => {
        if (selectedSchool) {
            const schoolReports = onlineReports[selectedSchool.id]?.concat(offlineReports[selectedSchool.id]) || [];
            setReports(schoolReports);
            setIndex(0);
        }
    };

    return (
        <ReportTemplate
            reportType={reportType}
            setReportType={setReportType}
            name={selected ? selected.name : ""}
            setSelected={setIndex}
            data={selected?.data || []}
            reportNames={getReportList()}
            schools={schools}
            selectedSchoolName={selectedSchoolName}
            onSchoolSelect={handleSchoolSelect}
            schoolsLoading={schoolResponse.loading}
            schoolsError={schoolResponse.error}
            onRefresh={handleRefresh}
        />

    );
}

export default ViewReports;
