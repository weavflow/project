// req, res만 받아서 service를 호출하여 결과를 전달하는 로직
// 1. db query 직접 호출 금지
// 2. HTTP 요청 / 응답 처리
// 3. err -> status 변환
// service에서 throw처리를 하고 여기선 진행하지 않고 return 처리

import {
    getAllTodos,
    getTodoByFilter,
    getTodoById,
    createTodo,
    updateTodo,
    updateTodoStatus,
    removeTodoWithArchive
} from "../services/service.js";

// 필터를 통한 단건 조회 혹은 전체 조회
export async function getListOrFilter(req, res) {
    const filter = ({
        title: req.query.title || null,
        status: req.query.status === "true" ? true :
            req.query.status === "false" ? false : null
    });

    let data;

    // 필터가 있는 경우
    if (filter.title || filter.status !== null) {
        data = await getTodoByFilter(filter);
        if (data.length === 0) {
            return res.status(200).json({message: "일정이 없습니다.", data: []});
        }
        return res.json(data);
    }

    // 필터 없이 전체 조회
    data = await getAllTodos();
    if (data.length === 0) {
        return res.status(200).json({message: "일정이 없습니다.", data: []});
    }
    return res.json(data);
}

// 상세 조회
export async function getById(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({message: "ID가 유효하지 않습니다."});
    }

    const data = await getTodoById({id})

    if (!data) {
        return res.status(404).json({message: "일정이 없습니다.", data: null});
    }

    return res.json(data);
}

// 추가
export async function add(req, res) {
    try {
        const data = await createTodo(req.body);
        return res.status(201).json(data);
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ message: err.message });
    }
}

// 변경
export async function update(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({message: "ID가 유효하지 않습니다."});
    }

    try {
        const data = await updateTodo({
            ...req.body,
            id,
        });

        return res.status(200).json(data);
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ message: err.message });
    }
}

// 상태 변경
export async function updateStatus(req, res) {
    const id = Number(req.params.id);
    const { status } = req.body;
    console.log(req.body.status, status);

    if (Number.isNaN(id)) {
        return res.status(400).json({message: "ID가 유효하지 않습니다."});
    }

    // if (!status) {
    //     return res.status(400).json({message: "상태가 유효하지 않습니다."});
    // }
    if (status === undefined) {
        return res.status(400).json({message: "상태가 유효하지 않습니다."});
    }
    // 상태 변경
    // 미완료 -> 체크 시 -> 완료 변경 : 그대로 진행.
    // 완료 -> 체크 시 -> 미완료 변경 : if (!status)는 false를 무조건 오류로 잡기 때문에 변경해야함.

    try {
        const data = await updateTodoStatus(id, status);
        return res.status(200).json(data);
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ message: err.message });
    }
}

export async function remove(req, res) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({message: "ID가 유효하지 않습니다."});
    }

    try {
        await removeTodoWithArchive(id);
        return res.status(204).end();
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ message: err.message });
    }
}