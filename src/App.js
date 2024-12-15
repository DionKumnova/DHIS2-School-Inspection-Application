import classes from './App.module.css';
import i18n from '@dhis2/d2-i18n';
import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import { InspectionForm } from './pages/InspectionForm';
import RoleSelect from "./pages/RoleSelect/RoleSelect";
import { ResourceCount } from "./pages/ResourceCount";
import Navigation from './components/Navigation';
import { ViewReports } from "./pages/ViewReports";
import JSON from 'json5';
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import { AlertBar } from '@dhis2/ui';
import { FormDataProvider } from './context/FormDataContext';
import { ResourceFormDataProvider } from './context/ResourseFormContext';
import useLocalStorage from './context/useLocalStorage';

const App = () => {
  const [activePage, setActivePage] = useState("RoleSelect");
  const [role, setRole] = useState("null");

  //only support for Jambalaya Cluster for now
  const [district, setDistrict] = useState(
    {
      id: null,
      name: null
      // id: "Jj1IUjjPaWf",
      // name: "Jambalaya Cluster"
    }
  )


  const [school, setSchool] = useLocalStorage("school", {
    id: "tfip7hOsZct", name: "Rev. J. C. Faye Memorial LBS (Banjul)"
  })
  const [allReports, setAllReports] = useLocalStorage("reports", {})
  const [offlineReports, setOfflineReports] = useLocalStorage("offlineReports", {})
  const { isConnected } = useDhis2ConnectionStatus() // returns true if connected to DHIS2, false otherwise

  useEffect(() => {
    if (!(school.id in allReports)) {
      setAllReports({ ...allReports, [school.id]: [] });
    }
    if (!(school.id in offlineReports)) {
      setOfflineReports({ ...offlineReports, [school.id]: [] });
    }
  }, [school]);

  useEffect(() => {
    if (isConnected) {
      console.log(isConnected, 'Connected to DHIS2');
    } else {
      console.log(isConnected, 'Disconnected from DHIS2');
    }
  }, [isConnected]);

  useEffect(() => {
    console.log(offlineReports, "offlineReports")
    console.log(allReports, "allReports")
  }, [offlineReports, allReports])


  function activePageHandler(page) {
    setActivePage(page);
  }

  const handleRoleSelect = (role) => {
    setRole(role);
  }

  const handleSchool = useCallback((selectedSchool) => {
    console.log(selectedSchool, "School Selected");
    setSchool(selectedSchool);
  }, [school])


  return (
    <>
      <div className={classes.container}>
        <div className={classes.left}>
          <Navigation
            activePage={activePage}
            activePageHandler={activePageHandler}
            role={role}
            district={district}
            school={school}
          />
        </div>
        <div className={classes.right}>
          <div className={classes.top}>
            {!isConnected &&
              <AlertBar permanent>
                You are offline, your data will be saved until you are back online</AlertBar>}
          </div>
          {activePage === "RoleSelect" &&
            <RoleSelect
              handleRoleSelect={handleRoleSelect}
              isConnected={isConnected}
              role={role}
              setActivePage={setActivePage}
              district={district}
              setDistrict={setDistrict}
              handleSchool={handleSchool}
              school={school}
            />}
          {activePage === "Inspection" &&
            <FormDataProvider>
              <InspectionForm
                district={district}
                school={school ? school : { name: "" }}
                isConnected={isConnected}
                handleSchool={handleSchool}
                reports={allReports}
                setReports={setAllReports}
                offlineReports={offlineReports}
                setOfflineReports={setOfflineReports}
              />
            </FormDataProvider>}
          {activePage === "ResourceCount" &&
            <ResourceFormDataProvider
              isConnected={isConnected}
              school={school}
              reports={allReports}
              setReports={setAllReports}
              offlineReports={offlineReports}
              setOfflineReports={setOfflineReports}>
              <ResourceCount />
            </ResourceFormDataProvider>}
          {activePage === "ViewReports" &&
            <ViewReports
              onlineReports={allReports}
              role={role}
              school={school}
              district={district}
              offlineReports={offlineReports}
              setAllReports={setAllReports}
            />}
        </div>
      </div>
    </>
  );
}

export default App
