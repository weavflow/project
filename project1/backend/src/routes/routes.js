import express from "express";
import {
    getListOrFilter,
    getById,
    add,
    update,
    remove,
    updateStatus, getReservedSlots,
} from "../controllers/controller.js"
import validateCreateBody from "../middleware/validateCreateBody.js";
import validateUpdateBody from "../middleware/validateUpdateBody.js";
import {buildEndAt, buildUTC, validateDuplicate} from "../middleware/validateDuplicate.js";
import validateBusinessBody from "../business/validateBusinessBody.js";

const router = express.Router();

// 전체 조회
router.get("/", getListOrFilter);

// 상세 조회
router.get("/:id", getById);

// 예약시간 반환하기
router.get("/slots", getReservedSlots);

// 중복검사 먼저
router.post("/phase1", buildUTC, buildEndAt, validateDuplicate, (req, res) => {
    res.json({ok: true});
})

// 추가 (중복검사 먼저 실행)
router.post("/", validateCreateBody, validateBusinessBody, buildEndAt, validateDuplicate, add);

// 수정 (중복검사 먼저 실행)
router.put("/:id", validateUpdateBody, validateBusinessBody, buildEndAt, validateDuplicate, update);

// 상태 변경
router.patch("/:id/status", updateStatus);

// 삭제
router.delete("/:id", remove);

export default router;



