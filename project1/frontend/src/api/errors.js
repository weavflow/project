// APIError 핸들러
export class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}