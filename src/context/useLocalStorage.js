import { useState } from 'react';
import JSON from 'json5';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            const parsedItem = item ? JSON.parse(item) : null;
            if (!parsedItem || parsedItem === null) {
                window.localStorage.setItem(key, initialValue)
                return initialValue
            }

            // Merge initialValue with parsedItem
            // const mergedValue = mergeFormData(initialValue, parsedItem);

            return parsedItem;
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”:", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error("Error setting localStorage key “" + key + "”:", error);
        }
    };

    return [storedValue, setValue];
};

// Helper function to merge form data
function mergeFormData(initialValue, storedValue) {
    if (!storedValue) {
        return initialValue;
    }

    // Merge the fields
    const mergedFields = { ...initialValue.fields };

    for (const key in storedValue.fields) {
        if (initialValue.fields[key]) {
            // If the field exists in both, merge their properties
            mergedFields[key] = {
                ...initialValue.fields[key],
                ...storedValue.fields[key],
            };
        } else {
            // If the field only exists in storedValue, add it
            mergedFields[key] = storedValue.fields[key];
        }
    }

    // Merge the metadata
    const mergedMetadata = {
        ...initialValue.metadata,
        ...storedValue.metadata,
    };

    // Return the merged form data
    return {
        ...initialValue,
        fields: mergedFields,
        metadata: mergedMetadata,
    };
}

export default useLocalStorage;
