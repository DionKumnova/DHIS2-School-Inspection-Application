
const formatResourceMutation = (formdata) => {
    const formattedResourceData = [];
    for (const key in formdata.fields) {
        if (formdata.fields[key].value === null) continue;
        formattedResourceData.push({ id: formdata.fields[key].id, value: formdata.fields[key].value });
    }
    return formattedResourceData;
}

export default formatResourceMutation;