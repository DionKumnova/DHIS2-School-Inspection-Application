import { useDataQuery } from "@dhis2/app-runtime"

const resourceFormMutation = {
    resource: 'events',
    type: 'create',
    data: ({ orgUnit, status, eventDate, dataValues }) => ({
        events: [{
            program: 'gLQ233Sp6ul',
            programStage: 'frk7x4xZxLR',
            orgUnit,
            status,
            eventDate: eventDate.concat("T00:00:00.000"), //since user can change inspectionDate, time of day today has no value
            dataValues: dataValues.map(({ dataElement, value }) => ({
                dataElement,
                value
            }))
        }]
    })
}

export default resourceFormMutation;

s
