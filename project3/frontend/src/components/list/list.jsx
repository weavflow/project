"use client"
import styles from "./list.module.css";
import {useState, useEffect} from "react";
import Link from "next/link";
import LoadData from "@/lib/loadData"

export default function List({label, type}) {
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);

    useEffect( () => {
        setError(null);
        LoadData(setList, setError, type);
    }, [type]);

    if (error) return <>{error.message}</>

    return (
        <>
            <section className={styles.product__container}>
                <div className={styles.product__label}>
                    <h3>{label}</h3>
                    <p><Link href={"/"}>홈</Link> {`>`} <strong>{label} (총 {list.length}개)</strong></p>
                </div>
                <div className={styles.product__info}>
                    <p className={"text-sm"}><strong>서울시 강남구</strong> 도착기준</p>
                    <p>배송 안내</p>
                </div>

                <div className={styles.product__list}>
                    {list.map((item) => (
                        <div key={item.id} className={styles.product__list__item}>
                            <img src={item.image} alt={item.name}/>
                            <h3>{item.name}</h3>
                            <p>{item.price}원</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}