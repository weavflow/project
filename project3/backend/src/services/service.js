// 매개변수를 storage쪽으로 넘겨서 다시 넘어온 데이터가 빈 데이터인지 검사하는 로직
// 1. 데이터 존재 여부 검증
// 2. sql query 직접 호출 금지

import {
    FINDALL,
    FINDBYFILTER,
    FINDBYID,
    INSERT,
    UPDATE,
    UPDATESTATUS,
    INSERTARCHIVE,
    DELETEBYID
} from "../repository/todo.repository.js";
import {pool} from "../db/db.js";
import {toDomain, toPersistence} from "../utils/mapper.js";

//전체
export async function getAllTodos() {
    const rows = await FINDALL();
    // 전체 조회의 경우 검색
    // 결과가 없어도 오류가 아니기 때문에 null 생략.
    return rows.map(toDomain);
}

// 필터 조회
export async function getTodoByFilter(filter) {
    const rows =  await FINDBYFILTER(filter);
    // 필터 조회도
    // 검색 결과가 없어도 오류가 아니기 때문에 null 생략.
    return rows.map(toDomain);
}

// PK로 조회
export async function getTodoById({id}) {
    const data = await FINDBYID(id);
    return data ? toDomain(data) : null;
}

// 추가
export async function createTodo(body) {
    const newData = {
        ...body
    }

    const id = await INSERT(newData);
    return await getTodoById({id});
}

// 추가, 수정 등에서 return을 하는 이유
// 1. 프론트 상태 동기화
// 서버 최신 상태 -> 프론트에 전달

// 2. DB 자동 값 반영
// updatedAt 컬럼을 DB에 자동 갱신으로 진행했다면
// JS에선 updatedAt의 값을 모르기 때문에 다시 조회가 필요함.

// 3. 서버의 최종 결과 보장
// 요청 데이터와 실제 저장 데이터가 다른 경우
// DEFAULT값이 있거나 DB 트리거가 존재하는 경우
// 최종 상태를 서버에서 보장해주는 것이 안전함.

// 변경
export async function updateTodo(body) {
    const exist = await getTodoById({id: body.id});
    if (!exist) {
        const err = new Error("일정이 없습니다.");
        err.status = 404;
        throw err;
    }

    const updatedData = {
        ...exist,
        ...body,
        id: exist.id,
    };

    await UPDATE(updatedData);
    return await getTodoById({id : body.id});
}

// 상태 변경
export async function updateTodoStatus(id, status) {
    const exist = await getTodoById({id});

    if (!exist) {
        const err = new Error("일정이 없습니다.");
        err.status = 404;
        throw err;
    }

    const updatedData = {
        ...exist,
        status: toPersistence(status),
    }

    await UPDATESTATUS(updatedData)
    return await getTodoById({id});
}

// 삭제
// 삭제 로직은 주로 SoftDelete 와 Archive Table 이동 2가지 패턴을 사용
// 기본 패턴은 삭제 후 결과 체크를 주로 사용한다.
// DELETE + affectedRows

// 만약 UI 응답 혹은 권한과 같은 검증 로직이 있을 경우
// 선택적으로 찾기 -> 삭제 를 진행하는 경우도 있다.

// 추가로 Archive Table 이동의 경우
// 삭제 과정에서 복사를 하기 때문에 sql query 안에 SELECT문이 있어 조회의 역할을 수행한다.
export async function removeTodoWithArchive(id, userId = null) {
    if (userId === undefined) {
        throw new Error("Access Denied");
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const result = await INSERTARCHIVE(conn, id);

        if (result.affectedRows === 0) {
            throw new Error("NOT FOUND");
        }
        await DELETEBYID(conn, id);

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

// Archive Table를 진행하기 위해선
// JS에 트랜잭션을 구현할 필요가 있다.