import List from "@/components/list/list";
import {LiveSubBanner, BestSubBanner, ProductSubBanner} from "@/components/subBanner/subBanner";
import {BestListItem, LiveListItem, AdListItem} from "@/components/list/listItem/listItem";

export const LIST = {
    best: List,
    live: List,
    ad: List
}

export const FILE_MAP = {
    best: "bestList.json",
    live: "liveList.json",
    ad: "ad.json",
    nav: "nav.json"
}

export const TYPE = {
    live: LiveSubBanner,
    best: BestSubBanner,
    products: ProductSubBanner
}

export const ITEMS = {
    best: BestListItem,
    live: LiveListItem,
    ad: AdListItem
}