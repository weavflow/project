export function UTCConversion(date, time) {
    return new Date(`${date}T${time}:00+09:00`);
}
// new Date(`${date}T00:00:00+09:00`)
// 해당 문자열의 정의는 UTC+9 기준이라는 타임존 지정자를 뜻한다.
// 자바스크립트는 해당 문자열을 UTC 기준으로 변환하여 내부 저장하게 되며
// .toISOString()을 하게되면 최종적으로 실제 시간에서 -9시간이 된 UTC시간으로 저장된다.