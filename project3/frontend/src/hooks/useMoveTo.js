export default function useMoveTo({
    array,
    pendingJumpRef,
    isAnimatingRef,
    setIndex,
    setPrevIndex,
    isSlide,
    fallbackRef
    }) {
    return (next, {force = false} = {}) => {
        if (array?.length <= 1) return;

        if (pendingJumpRef.current !== null) {
            pendingJumpRef.current = null;
        }

        if (!force && isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        setIndex(prev => {
            setPrevIndex(prev);

            let nextIndex =
                typeof next === "function" ? next(prev) : next;

            // slide 의 경우 cloneList 이기 때문에
            // max 가 array.length + 1
            // fade 의 경우 cloneList 가 아니기 때문에
            // max 가 array.length - 1
            if (isSlide) {
                const max = array?.length + 1;
                const min = 0;

                if (nextIndex < min) nextIndex = min;
                if (nextIndex > max) nextIndex = max;

                if (nextIndex === 0) {
                    pendingJumpRef.current = array?.length;
                } else if (nextIndex === array?.length + 1) {
                    pendingJumpRef.current = 1;
                } else {
                    pendingJumpRef.current = null;
                }
            } else {
                const max = array?.length - 1;
                const min = 0;

                // 이전 버튼으로 인덱스가 0보다 작아지면 max 로 이동
                // 다음 버튼으로 인덱스가 max 보다 커지면 min 으로 이동
                if (nextIndex < min) nextIndex = max;
                if (nextIndex > max) nextIndex = min;
            }

            return nextIndex;
        });

        fallbackRef.current = requestAnimationFrame(() => {
            fallbackRef.current = requestAnimationFrame(() => {
                isAnimatingRef.current = false;
            });
        });
    }
}