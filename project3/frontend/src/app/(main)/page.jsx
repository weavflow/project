import styles from "./page.module.css";

export default function Home() {
  // 1. 쇼핑몰 CRUD
  // React Query 학습용 설계
  // 상품목록과 장바구니 분리
  // 메인 페이지에선 광고과 상단바를 통해서 각 상품목록 페이지로 이동
  // 광고 화면 안에 상단바 배치
  // 전체에서 hover시 하단 리스트 열기

    // 1차 수정
    // Header와 SubHeader로 나누어서
    // 메인에는 광고이미지가 들어오는 Header
    // 서브에는 광고이미지가 없는 Header
    // 서브에서 새로고침 시 css 적용이 풀리는 문제 발생.

    // global.css가 layout.jsx에서 풀리면서 발생하는 문제로 보임.
    // 따라서 메인과 서브에 각각 layout.jsx를 지정하고 상위에는
    // page없이 루트 layout.jsx를 지정하는 방식으로 수정.

    // 루트 layout.jsx없이 진행할 경우 메인과 서브의 layout이 서로 중첩되어 표시될 수 있음.

    // 2차 수정
    // Header와 SubHeader간의 css 처리에서 중복된 곳에 대한 수정 중 의문점이 제기됨.
    // Header로 공통으로 적용하고 광고 유무만 boolean값으로 전달받아서
    // true면 광고의 영역을 설정하여 광고를 표시하고
    // false면 광고의 영역을 제외하여 광고를 표시하지 않는 Header로 수정
    // 단순히 광고 영역만 설정하고 나머지 부분은 공통적으로 같기 때문에
    // SubHeader를 안고 갈 이유가 존재하지 않음.
  return (
      <>
        <main className={styles.shop__main}>
          본문 광고화면
        </main>
      </>
  );
}
