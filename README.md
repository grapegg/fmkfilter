# FM Korea 포텐/인기글 키워드 필터

FM Korea의 포텐 게시판 혹은 인기글 게시판의 게시물 목록에서 원하지 않는 콘텐츠를 필터링하는 간단한 브라우저 확장 프로그램입니다.

## 설치 방법

### PC (Edge 브라우저)

- https://microsoftedge.microsoft.com/addons/detail/fmk-content-filter/fmjidaeahkfiokjlmjlcfelbccjfdnla

### PC (Firefox 브라우저)

- https://addons.mozilla.org/en-US/firefox/addon/fmkfilter/

### PC (Chrome 브라우저 혹은 Edge 브라우저 다른 방법) 

- 여기서 fmkfilter.zip을 다운받고 압축을 풀기
- 주소 창에 chrome://extensions/ 혹은 edge://extensions/ 입력
- "개발자 모드" 켜기 (우측 상단 혹은 좌측 패널에 위치)
- 좌측 상단의 "압축해제된 확장 프로그램을 로드합니다." 눌러서 압축 푼 폴더 선택
  
### 아이폰 혹은 아이패드 (오리온 브라우저)

- 앱스토어에서 Orion Browser by Kagi 설치
- 여기서 fmkfilter.zip 다운로드하기
- 우측 하단의 메뉴버튼 누르고 Extensions 누르기
- 좌측 하단의 + 표시 누르고 "Install from File" 누르기
- 우측 하단의 Browse 누르고 fmkfilter.zip 선택 (Browse를 한 번 더 눌러버렸다면, Locations의 On My iPhone 누르고 Orion 폴더 들어가기)
- Add 누르기

### 안드로이드 (Edge Canary 브라우저)

- 플레이 스토어에서 Edge Canary 설치. (Edge의 실험 버전임)
- 여기서 fmkfilter.crx 다운로드하기
- 좌측 하단의 메뉴버튼 누르고 설정버튼 누르기
- 제일 아래의 Microsoft Edge 정보 누르기
- "개인 정보 및 사용 약관" 누르기
- 제일 아래의 "Edge Canary 숫자.숫자.숫자.숫자" 다섯 번 눌러 개발자 모드 들어가기
- 다시 메뉴로 나가서 "개발자 옵션" 메뉴 누르기
- "Extension install by crx" 누르기 (or "Extension install by id" 누르고 fmjidaeahkfiokjlmjlcfelbccjfdnla 입력)
- "Choose .crx file" 누르고 fmkfilter.crx 선택
- "확인" 누르기

## 사용 방법

- 확장 프로그램 아이콘을 클릭해서 열기
- "FMK Content Filter" 누르기
- 텍스트 입력하는 곳에 한 줄씩 원하는 필터링 문구를 쓰기
- 저장 누르기

### 예시

- `스포` - 포텐/인기글 목록에서 "스포"가 제목에 포함된 모든 게시물 숨김
- `ㄷㄷㄷ:유머` - 포텐/인기글 목록에서 "ㄷㄷㄷ"이 제목에 포함된 게시물 중 출처 게시판의 이름에 "유머"가 포함된 게시물 숨김

## 참고

- 알파벳 대소문자를 구분하지 않음
- 문구 앞뒤 중간의 띄어쓰기까지 포함해서 검사함 (예를 들어, "스타"는 "어제 스타함"과 "카스타드" 모두 필터. 앞에 띄어써서 " 스타"로 하면 "어제 스타함"만 필터)
- 빈 줄이 있어도 괜찮음

## 한계

- 제목이 길어서 ...으로 축약된 곳에 해당 문구가 있는 경우 거르지 못함
- 낚시성 제목인 경우 거르지 못함
- 해당 단어가 한 글자거나 다른 주제에서도 많이 쓰이는 경우에 필터링 문구로 사용하기 곤란


# Regex 버전

fmkfilterRegex.zip 파일은 /패턴/ 형태로 정규식 필터가 사용 가능. 예: /\[.*?vs.*?\]/ 로 [어쩌고vs저쩌고] 필터링

