"use client"
import {useState, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";
import LoadData from "@/lib/loadData";
import styles from "./page.module.css";
import Indicator from "@/components/indicator/indicator";

export default function Page() {
    const [ad, setAd] = useState([]);
    const [error, setError] = useState(null);

    // 이미지 순서
    const [index, setIndex] = useState(1);
    const [prevIndex, setPrevIndex] = useState(null);

    // Link의 데이터 불러오기
    const location = useLocation();

    // 데이터 불러오기 Query
    let type = location.state.data;
    console.log(type);
}