import {useState} from 'react';

// 범용적 요청 실행 훅
// 낙관적 업데이트 존재
// 성공과 실패의 콜백이 분리되어야 함.
export default function useServiceMutation({
    setData,
    request,
    updater,
    onError,
    onSuccess,
}) {
    const [defering, setDefering] = useState(false);

    return async function handleMutate(payload) {
        if (defering) return;

        setDefering(true);
        let prevData;

        if (updater && setData) {
            setData(prev => {
                prevData = prev;
                return updater(prev, payload);
            });
        }
        // 구조에 따라 updater를 선택 옵션으로 변경.

        try {
            const res = await request(payload);

            if (updater && setData) {
                setData(prev => updater(prev, res));
            }

            onSuccess?.(payload);
        } catch (e) {
            if (updater && setData) {
                setData(() => prevData);
            }

            onError(e);
        } finally {
            setDefering(false);
        }
    };
}