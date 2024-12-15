

const countDataQuery = {
    analytics: {
        resource: 'analytics.json',
        params: ({ dataElement, period, orgUnit }) => ({
            dimension: [
                `dx:${dataElement}`, 
                `pe:${period}`, 
                `ou:${orgUnit}` 
            ],
            skipMeta: "true",
        })
    }
};

export default countDataQuery;
