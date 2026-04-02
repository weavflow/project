// Access 부여
export function useServiceAccess(type, id) {
    const now = Date.now();

    sessionStorage.setItem(
        `Access:${type}:${id}`,
        JSON.stringify({time: now})
    );
}