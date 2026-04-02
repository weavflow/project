export default function toKST(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("ko-KR", {
       timeZone: "Asia/Seoul",
       year: "numeric",
       month: "long", // 3월
       day: "numeric",
       hour: "numeric",
       minute: "numeric",
        // second: "numeric",
       hour12: true, // true시 (오전/오후) false시 24시 표현
    }).format(date);
}