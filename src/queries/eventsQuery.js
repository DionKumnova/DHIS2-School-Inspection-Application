const eventsQuery = {
    events: {
        resource: 'events',
        params: ({ orgUnit, program, includeDescendants = false }) => ({
            orgUnit,
            program, 
            fields: 'program,event,orgUnit,occurredAt,orgUnitName,dataValues[dataElement,value],notes',
            ouMode: includeDescendants ? 'DESCENDANTS' : 'SELECTED' 
        })
    }
}

export default eventsQuery;
