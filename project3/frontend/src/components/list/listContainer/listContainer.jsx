"use client"
import styles from "./listContainer.module.css";
import {SubBanner} from "@/components/subBanner/subBanner";
import {ITEMS} from "@/data/fileMap";
import {useState, useEffect} from "react";
import Link from "next/link";
import LoadData from "@/lib/loadData"

export default function ListContainer({label, type}) {
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);

    const ListItem = ITEMS[type];

    useEffect( () => {
        let isMounted = true;

        setError(null);
        LoadData(
            (data) => isMounted && setList(data),
            (err) => isMounted && setError(err),
            type
        );

        return () => {
            isMounted = false;
        };
    }, [type]);

    if (error) return <>{error.message}</>

    if (!ListItem) {
        return <>잘못된 타입입니다.</>
    }

    return (
        <section className={styles.product__container}>
            <div className={styles.product__label}>
                <h2
                    className={styles.product__subLogo}
                >{label}</h2>
                <p><Link href={"/"}>홈</Link> {`>`} <strong>{label} (총 {list.length}개)</strong></p>
            </div>
            <SubBanner type={type} />

            <ListItem list={list} />
        </section>
    )
}