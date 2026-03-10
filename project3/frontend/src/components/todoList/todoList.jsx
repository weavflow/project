export default function TodoList() {

    return (
        <table>
            <thead>
                <th>No.</th>
                <th>일정명</th>
                <th>상태</th>
                <th>상세보기</th>
                <th>삭제</th>
            </thead>
            <tbody>
                <td>1</td>
                <td>임시</td>
                <td>비활성화</td>
                <td><button>자세히</button></td>
                <td><button>삭제</button></td>
            </tbody>
        </table>
    )
}