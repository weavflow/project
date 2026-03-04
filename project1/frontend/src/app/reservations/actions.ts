"use server"
// Next.js에서 use server는 Server Action으로 강제 지정하는 지시어
// 기본적으로 Server Component가 기본값이지만
// Client Component내부에서 form action으로 백엔드 로직을 직접 실행하고 싶을 때 사용한다.

// "use server"
// 서버에서만 실행
// DB에 접근 가능
// fetch 캐시 제어 가능
// 보통 폼제출이나 데이터 수정/삭제, mutation(변경)작업, 경로 재검증 사용 시

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {json} from "node:stream/consumers";

export async function removeReservation(formData: FormData) {
    const id = formData.get("id");

    await fetch(`http://localhost:3001/reservations/${id}`, {method: "DELETE", cache: "no-store"});
    // Next.js는 기본적으로 fetch 결과를 캐시한다.
    // 데이터 수정/삭제가 된 경우 페이지는 캐시된 데이터를 유지하기 때문에
    // 화면이 갱신되지 않는다.
    // 함수를 사용하여 직접 DB에 접근이 가능하나 독립 백엔드서버의 구조라면
    // 프론트에서 DB접근은 책임 분리가 불가능하다.

    // 또한 fetch로 [id]/route.ts를 호출할 때 method: "DELETE"를 호출하는 것 역시
    // server action에서 API Route를 거치고 다시 백엔드서버를 거치는 이중 단계가 진행되기 때문에
    // 이 역시 계층이 최소화되는 구조가 아니게 된다.
    // 따라서 server action에서는 직접 백엔드서버를 호출하는 방법을 권장한다.

    revalidatePath("/reservations");
    // /reservations 경로의 캐시를 무효화하고 다음 요청 시 최신 데이터로 다시 생성하라는 요청이 된다.

    redirect("/reservations");
    // 서버에서 다른 경로로 이동하는 요청
    // revalidatePath는 같은 페이지를 유지하기 때문에 수정 혹은 삭제와 같은 요청 후
    // 클라이언트가 확인할 수 있는 페이지로 이동하기 위해선
    // redirect를 사용해야 한다.

    // 또한 server action은 Response를 직접 반환하지 않기 때문에
    // redirect이후의 동작은 실행되지 않는다.
}

export async function updateReservation(formData: FormData) {
    const id = formData.get("id");

    await fetch(`http://localhost:3001/reservations/${id}`, {method: "PUT", cache: "no-store"});

    revalidatePath("/reservations");
    redirect("/reservations");
}

export async function updateStatus(formData: FormData) {
    const id = formData.get("id");

    await fetch(`http://localhost:3001/reservations/${id}`, {method: "PATCH", cache: "no-store"});

    revalidatePath("/reservations");
    redirect("/reservations");
}

export async function createReservation(formData: FormData) {
    const name = formData.get("name");
    const location = formData.get("location");
    const date = formData.get("date");
    const time = formData.get("time");

    await fetch("http://localhost:3001/reservations", {
        method: "POST",
        cache: "no-store",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, location, date, time})
    });

    redirect("/reservations");
}