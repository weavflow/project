import APIError from "@/app/api/data/error";

export default async function FetchList(type) {
    const res = await fetch(`/api/data?type=${type}`);
    if (!res.ok) {
        throw new APIError({
            message: "Fetch List Failed",
            status: 400
        });
    }
    return res.json();
}