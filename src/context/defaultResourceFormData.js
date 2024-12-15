const defaultResourceFormData = {
    metadata: {
        id: null,
        displayName: null,
        orgUnit: null,
        createdAt: null,
        type: null,
        form: null,
        isSubmitted: true
    },
    fields: {
        inspectionDate: {
            displayName: "Inspection Date",
            value: new Date().toISOString().split('T')[0],
            id: "inspectionDate",
            type: "date",
            form: "resourceCount"
        },
        "Seats actual - LBE": {
            displayName: "Number of available seats",
            value: null,
            standardValue: 0,
            id: "NjH03frHDdJ", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Seats good - LBE": {
            displayName: "Number of seats in good condition",
            standardValue: 0,
            value: null,
            id: "L7G04Tz5Ge0", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Desks actual - LBE": {
            displayName: "Number of available desks",
            standardValue: 0,
            value: null,
            id: "hbtxlR8hygx", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Desks good - LBE": {
            standardValue: 0,
            displayName: "Number of desks in good condition",
            value: null,
            id: "C5svakoRIZG", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Textbooks - Maths": {
            displayName: "Number of maths textbooks",
            standardValue: 0,
            value: null,
            id: "xqRFKIs7gMs", // Updated
            type: "number",
            form: "resourceCount",
        },
        /*
        "Textbooks - Integrated Science": {
            displayName: "Number of integrated science textbooks",
            standardValue: 0,
            value: null,
            id: "xD0toQcnOab", // Updated
            type: "number",
            form: "resourceCount",
        },*/
        "Textbooks - Science": {
            displayName: "Number of science textbooks",
            standardValue: 0,
            value: null,
            id: "PrZ8Zxao47h", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Textbooks - English": {
            displayName: "Number of english textbooks",
            standardValue: 0,
            value: null,
            id: "Jk1rdoGCMBP", // Updated
            type: "number",
            form: "resourceCount",
        },
      
        "Teachers - Science": {
            displayName: "Number of science teachers",
            value: null,
            standardValue: 0,
            id: "Eenb1StQTDY", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Teachers - Maths": {
            displayName: "Number of maths teachers",
            standardValue: 0,
            value: null,
            id: "buUVz1FuDdZ", // Updated
            type: "number",
            form: "resourceCount",
        },
        "Teachers - English": {
            displayName: "Number of english teachers",
            standardValue: 0,
            value: null,
            id: "Kf0vCTP0sO5", // Updated
            type: "number",
            form: "resourceCount",
        },
  
    }
}

export default defaultResourceFormData;
