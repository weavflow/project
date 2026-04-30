export default function CreateCurrentIndex({length, index}) {
    if (index === 0) return length - 1;
    if (index === length + 1) return 0;

    return index - 1;
}