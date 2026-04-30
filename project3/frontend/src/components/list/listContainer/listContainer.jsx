"use client"
import styles from "./listContainer.module.css";
import {useState, useEffect} from "react";
import Link from "next/link";
import LoadData from "@/lib/loadData"
import {AdListItem, BestListItem, LiveListItem, DefaultListItem} from "@/components/list/listItem/listItem";
import {BestSubBanner, LiveSubBanner, ProductSubBanner} from "@/components/subBanner/subBanner";

function renderListItem(ui, list) {
    switch (ui) {
        case "best":
            return <BestListItem list={list} />
        case "live":
            return <LiveListItem list={list} />
        case "ad":
            return <AdListItem list={list} />
        case "cart":
            return null;
        default:
            return <DefaultListItem list={list} />
    }
}

function renderBanner(ui) {
    switch (ui) {
        case "best":
            return <BestSubBanner />;
        case "live":
            return <LiveSubBanner />;
        case "cart":
        case "ad":
            return null;
        default:
            return <ProductSubBanner />;
    }
}

export default function ListContainer({label, type, ui}) {
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        let isMounted = true;

        setError(null);
        LoadData(
            (data) => {
                if (!isMounted) return;
                setList(data);
                setIsLoading(false);
            },
            (err) => {
                if (!isMounted) return;
                setError(err);
                setIsLoading(false);
            },
            type
        );

        return () => {
            isMounted = false;
        };
    }, []);

    if (error) return <>{error.message}</>

    if (!type) {
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
            {renderBanner(ui)}
            {isLoading ? (<DefaultListItem list={list}/>) : renderListItem(ui, list)}
        </section>
    )
}