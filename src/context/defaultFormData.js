const defaultFormData = {
    metadata: {
        id: null,
        orgUnit: null,
        displayName: null,
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
            form: "inspectionForm"
        },

        "CHK Electricity supply": {
            displayName: "The school has working electricity",
            helpText: "Check: power outlets, lighting in classrooms, consistent supply during school hours",
            value: null,
            id: "IKiSAA19Xvl",
            type: "radio",
            form: "inspectionForm"
        },
        "CHK Electricity supply condition": {
            displayName: "What is the overall condition of electrical installations?",
            helpText: "Consider: wiring safety, distribution boards, backup systems, maintenance status",
            value: null,
            id: "MH2eDd7qWxR",
            type: "segmented",
            form: "inspectionForm"
        },
        "CHK Computer Lab": {
            displayName: "The school has a computer lab",
            helpText: "Verify: dedicated space for computers, proper furniture, security measures",
            value: null,
            id: "Nvp4hIbXrzF",
            type: "radio",
            form: "inspectionForm"
        },
        "CHK Computer Lab condition": {
            displayName: "What is the overall condition of the computer lab?",
            helpText: "Consider: working computers, internet connectivity, proper ventilation, maintenance records",
            value: null,
            id: "gzhjCMe7OyS",
            type: "segmented",
            form: "inspectionForm"
        },
        "CHK Library": {
            displayName: "The school has a library",
            helpText: "Verify: dedicated space for books, reading area, proper shelving",
            value: null,
            id: "Y6DQqwTdhiZ",
            type: "radio",
            form: "inspectionForm"
        },
    
        "CHK Playground": {
            displayName: "The school has a playground",
            helpText: "Check: designated play area, safety of equipment, adequate space",
            value: null,
            id: "XThfmg6f2oC",
            type: "radio",
            form: "inspectionForm"
        },
        "CHK Playground condition": {
            displayName: "What is the overall condition of the playground?",
            helpText: "Consider: surface safety, equipment integrity, drainage system, maintenance status",
            value: null,
            id: "JzZfwXtdL6G",
            type: "segmented",
            form: "inspectionForm"
        },
        "CHK Handwashing": {
            displayName: "The school has handwashing facilities",
            helpText: "Verify: water supply, soap availability, proper drainage",
            value: null,
            id: "n9KwS4rY2HC",
            type: "radio",
            form: "inspectionForm"
        },
        "CHK Handwashing condition": {
            displayName: "What is the overall condition of handwashing facilities?",
            helpText: "Consider: water pressure, cleanliness, accessibility, drainage, maintenance status",
            value: null,
            id: "ie3bFiVatHT",
            type: "segmented",
            form: "inspectionForm"
        },
        "CHK number of classrooms": {
            displayName: "Total number of classrooms",
            helpText: "Count all rooms used for teaching, including temporary spaces",
            value: null,
            id: "ya5SyA5hej4",
            type: "number",
            form: "inspectionForm"
        },
        "CHK Number of classrooms clean and secure": {
            displayName: "Number of classrooms in good condition",
            helpText: "Count rooms that are clean, secure, and suitable for teaching",
            value: null,
            id: "XIgpDhDC4Ol",
            type: "number",
            form: "inspectionForm"
        },
        "CHK Toilet for teachers": {
            displayName: "Number of functional teacher toilets",
            helpText: "Count toilets specifically designated for teachers' use",
            value: null,
            id: "I13NTyLrHBm",
            type: "number",
            form: "inspectionForm"
        },
        "Notes": {
            displayName: "Notes",
            helpText: 
                "In your summary it might be useful to include:\n\n" +
                "• What stood out in the inspection?\n" +
                "• What are the main safety concerns?\n" +
                "• Are there any urgent maintenance needs?\n" +
                "• What are the top 3 priority issues for the Head Teacher?",
            value: null,
            id: "Notes",
            type: "text",
            form: "inspectionForm"
        }
    }
}

export default defaultFormData;
