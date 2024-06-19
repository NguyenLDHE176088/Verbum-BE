export const jsonReplacer = (key, value) => {
    if (typeof value === 'bigint') {
        return value.toString() + 'n';
    }
    return value;
};

export const convertBigIntToString = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (typeof obj === 'object') {
        if (obj instanceof Date) {
            return obj.toISOString(); // Ensure Date objects are converted to ISO strings
        }

        if (Array.isArray(obj)) {
            return obj.map(item => convertBigIntToString(item));
        }

        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = convertBigIntToString(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}