import {pool} from "../db/db.js";

// 전체
export async function findAll() {
    let sql = "SELECT * FROM reservations";

    const [rows] = await pool.query(sql);
    return rows;
}

export async function findByFilter({
   reserveId,
   name,
   status,
    location,
    date,
    time
   }) {

    const query = {
        sql: "SELECT * FROM reservations WHERE 1=1",
        params: []
    }

    let start = `${date} ${time}:00`;
    let end = `${date} ${time}:59`;

    function condition(obj, condition, value) {
        if (!value) return;

        obj.sql += ` AND ${condition}`;
        obj.params.push(value);
    }

    function conditions(obj, condition, value1, value2) {
        if (!value1 || !value2) return;

        obj.sql += ` AND ${condition}`;
        obj.params.push(value1);
        obj.params.push(value2);
    }

    condition(query, "reserveId = ?", reserveId);
    condition(query, "status = ?", status);
    condition(query, "name LIKE ?", name && `%${name}%`);
    condition(query, "location LIKE ?", location && `%${location}%`);

    conditions(query, "startAt >= ? AND startAt <= ?",
        date && start, date && end);

    const [rows] = await pool.query(query.sql, query.params);
    return rows;
}

// PK id (상세조회, 추가, 삭제 전용)
export async function findById(id) {
    let sql = "SELECT * FROM reservations WHERE id = ?";
    const findReserve = [id];

    const [rows] = await pool.query(sql, findReserve);
    return rows[0] || null;
}

// 추가
export async function insert(reservation) {
    let sql = "INSERT INTO reservations (name, reserveId, location, startAt, endAt, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)";

    const params = [
        reservation.name,
        reservation.reserveId,
        reservation.location,
        reservation.startAt,
        reservation.endAt,
        reservation.status,
        reservation.createdAt,
        reservation.updatedAt,
    ];

    await pool.query(sql, params)
}

// 수정
// 수정이 가능한 항목은 이름과, 장소, 예약 시작 시간만 수정이 가능함.
// 끝나는 시간과 updateAt은 자동 변환.
export async function update(reservation) {
    let sql = "UPDATE reservations SET name=?, location=?, startAt=?, endAt=?, updatedAt=? WHERE id = ?"
    const params = [
        reservation.name,
        reservation.location,
        reservation.startAt,
        reservation.endAt,
        reservation.updatedAt,
        reservation.id
    ];

    await pool.query(sql, params);
}

// 상태 수정
export async function updateStatus(reservation) {
    let sql = "UPDATE reservations SET status=?, updatedAt=? WHERE id=?";
    const params = [
        reservation.status,
        reservation.updatedAt,
        reservation.id
    ];

    await pool.query(sql, params);
}

// 삭제
export async function remove(reservation) {
    let sql = "DELETE FROM reservations WHERE id = ?";
    const findReserve = [reservation.id];

    await pool.query(sql, findReserve);
}

// DB에서 날짜를 기준으로 찾기
export async function getReserveByAt({location, startAt, endAt, id = null}) {
    let sql = "SELECT * FROM reservations WHERE location = ? AND startAt < ? AND endAt > ?";
    const params = [location, endAt, startAt]

    if (reserveId) {
        sql += ` AND id != ?`;
        params.push(id);
    }

    sql += " LIMIT 1";

    const [rows] = await pool.query(sql, params);

    return rows.length > 0;
}

export async function getReserveByLocationDate(location, startDate, endDate) {
    let sql = "SELECT startAt FROM reservations WHERE location = ? AND startAt >= ? AND startAt < ?";
    const params = [location, startDate, endDate];

    const [rows] = await pool.query(sql, params);

    return rows
}
