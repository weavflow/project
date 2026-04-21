// SQL 실행 및 DB 접근 전용
// 1. 데이터 존재 여부 검증 금지
// 2. HTTP 요청/응답 처리 금지
// 3. err 처리 금지
// 4. 다른 로직 호출 금지

import {pool} from '../db/db.js';

const DB_TABLE = "Todos";
const DB_TABLE_DELETE = "Todos_Delete";

// 전체 조회
export async function FINDALL() {
    let sql = `SELECT * FROM ${DB_TABLE}`;

    const [rows] = await pool.query(sql);
    return rows;
}

// 필터 조회
export async function FINDBYFILTER({
    title,
    status
   }) {
    const query = {
        sql: `SELECT * FROM ${DB_TABLE} WHERE 1=1`,
        params: []
    };

    function condition(obj, condition, value) {
        if (value === null || value === undefined) return;

        obj.sql += ` AND ${condition}`;
        obj.params.push(value);
    }

    condition(query, "title LIKE ?", title && `%${title}%`);
    condition(query, "status=?", status);

    const [rows] = await pool.query(query.sql, query.params);
    return rows;
}

// PK 조회 (상세조회, 추가, 삭제 전용)
export async function FINDBYID(id) {
    let sql = `SELECT * FROM ${DB_TABLE} WHERE id = ?`;

    const [rows] = await pool.query(sql, [id]);
    // [id] : SQL Injection 방지
    // Prepared Statement 사용
    return rows[0] || null;
}

// 추가
export async function INSERT(todo) {
    let sql = `INSERT INTO ${DB_TABLE} (title) VALUES (?)`;

    const params = [
        todo.title,
    ];

    const [result] = await pool.query(sql, params);
    return result.insertId;
}

// 변경
export async function UPDATE(todo) {
    let sql = `UPDATE ${DB_TABLE} SET title=? WHERE id = ?`;
    const params = [
        todo.title,
        todo.id,
    ];

    await pool.query(sql, params);
}

// 상태 변경
export async function UPDATESTATUS(todo) {
    let sql = `UPDATE ${DB_TABLE} SET status=? WHERE id = ?`;
    const params = [
        todo.status,
        todo.id
    ];

    await pool.query(sql, params);
}

// 삭제 전용 추가
export async function INSERTARCHIVE(conn, id, deletedBy = null) {
    const [result] = await conn.query(
        `INSERT INTO ${DB_TABLE_DELETE} (originId, title, status, createdAt, deletedAt, deletedBy)
        SELECT id, title, status, createdAt, NOW(), ?
        FROM ${DB_TABLE} WHERE id = ?`,
        [deletedBy, id]
    );

    return result.affectedRows;
}

// 삭제 전용
export async function DELETEBYID(conn, id) {
    await conn.query(
        `DELETE FROM ${DB_TABLE} WHERE id = ?`, [id]
    );
}