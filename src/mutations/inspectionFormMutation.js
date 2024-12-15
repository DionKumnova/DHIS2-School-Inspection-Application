const inspectionFormMutation = {
    resource: 'events',
    type: 'create',
    data: ({ orgUnit, status, eventDate, dataValues, notesValue }) => ({
        events: [{
            program: 'UxK2o06ScIe',
            programStage: 'eJiBjm9Rl7E',
            orgUnit,
            status,
            eventDate: eventDate.concat("T00:00:00.000"), //since user can change inspectionDate, time of day today has no value
            dataValues: dataValues.map(({ dataElement, value }) => ({
                dataElement,
                value
            })),
            notes: [{ value: notesValue }]
        }]
    })
}

export default inspectionFormMutation;
