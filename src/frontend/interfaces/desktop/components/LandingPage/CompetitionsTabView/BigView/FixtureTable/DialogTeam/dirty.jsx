import { useState } from 'react';

export function setInitialState(initialData, handler) {
    const [data, setData] = useState(initialData);
    const [dirty, setDirty] = useState(
        Object.keys(initialData).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );

    const updateState = (key, newValue) => {
        setData((prevData) => {
            const updatedData = { ...prevData, [key]: newValue };
            const isDirty = updatedData[key] !== initialData[key];

            setDirty((prevDirty) => ({ ...prevDirty, [key]: isDirty }));

            handler({
                data: updatedData,
                dirty: { ...dirty, [key]: isDirty },
                isDirty: Object.values({ ...dirty, [key]: isDirty }).some(Boolean)
            });

            return updatedData;
        });
    };

    return { 
        isDirty: Object.values(dirty).some(Boolean),
        newState: data,
        updateState
    };
}