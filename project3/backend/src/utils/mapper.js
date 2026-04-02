export function toDomain(row) {
    return {
        ...row,
        status: Boolean(row.status),
    };
}

export function toPersistence(status) {
    return status ? 1 : 0;
}