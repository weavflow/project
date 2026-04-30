export default function CreateCloneList(array) {
    if (array.length <= 1) {
        return array;
    }

    const first = array[array.length - 1];
    const last = array[0];

    return [first, ...array, last];
}