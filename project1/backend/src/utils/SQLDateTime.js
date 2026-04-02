export default function SQLDateTime(now) {
    return now.slice(0, 19).replace("T", " ");
}