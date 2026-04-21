import express from 'express';
import {add, getById, getListOrFilter, update, remove, updateStatus} from "../controllers/controller.js";

const router = express.Router();

//전체 조회 & 필터 조회
router.get("/", getListOrFilter);

// 상세 조회
router.get("/:id", getById);

// 추가
router.post("/", add);

// 수정
router.put("/:id", update);

// 상태 수정
router.patch("/:id/status", updateStatus);

// 삭제
router.delete("/:id", remove);

export default router;
