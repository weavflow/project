// Access 검증 + ID 검증 + 시간 초과 시 검증 만료
export default function hasAccess(type, id, ttl = 1000 * 60 * 10) {
    const row = sessionStorage.getItem(`Access:${type}:${id}`);
    if (!row) return false;

    try {
        const {time} = JSON.parse(row);
        return Date.now() - time < ttl;
    } catch {
        return false;
    }
}