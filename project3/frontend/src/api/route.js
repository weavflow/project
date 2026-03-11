export default async function GET(params) {
    const query = params.toString();
    const BASE_URL = "http://localhost:9000/todos";

    return query? `${BASE_URL}?${query}` : BASE_URL;
}