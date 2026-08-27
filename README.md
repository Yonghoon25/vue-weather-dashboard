# 🌤️ Weather Dashboard

지역별 현재 날씨와 예보 정보를 제공하는 웹 서비스

## 📌 프로젝트 소개

OpenWeatherMap API와 에어코리아(AirKorea) API를 활용하여 성남, 창원, 서울, 부산, 대전, 인천의 현재 날씨와 내일 날씨, 그리고 미세먼지 현황을 조회할 수 있는 웹 서비스입니다.

## ✨ 주요 기능

- 지역별 현재 날씨 조회
- 내일 날씨 및 강수확률 조회
- 기온 / 습도 / 풍속 조회
- 날씨 상세정보 조회 (Vue Router 동적 라우팅)
- 대기질(미세먼지 PM10) 정보 및 전국 예보 이미지 조회
- 검색 기능을 통한 특정 도시 날씨 필터링
- 섭씨(℃) / 화씨(℉) 단위 변환

## 🛠️ 기술 스택

### Frontend

- Vue 3 (Composition API)
- JavaScript
- Vite
- Vuetify 3 (UI Framework)
- Vue Router
- Pinia (State Management)
- Axios

### API

- OpenWeatherMap API (기상 관측 데이터)
- AirKorea 대기질 예보 API (공공데이터포털 미세먼지 데이터)

## 📁 프로젝트 구조

```text
src/
├── assets/
├── components/
│   └── weather/
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       ├── UnitToggler.vue
│       ├── WeatherCard.vue
│       └── WeatherDashboard.vue
├── router/
│   └── index.js
├── services/
│   └── weatherApi.js
├── stores/
│   └── configStore.js
├── views/
│   ├── NotFoundView.vue
│   ├── WeatherAboutView.vue
│   ├── WeatherDetailView.vue
│   └── WeatherHomeView.vue
├── App.vue
└── main.js
```

---

## 📝 과제 요구사항 및 실습 내용 (Hands-on)

### Hands on - Weather Mockup
**▪ 과제 요구사항**
1. **배열 렌더링 (v-for)**
   - 임의의 날씨 데이터 배열을 활용해 화면에 날씨 카드를 반복 출력한다.
   - `:key`에 id 바인딩 필수
2. **조건부 렌더링 (v-if)**
   - 기온이 25도 이상인 도시는 "🔥 더움 (25도 이상)", 25도 미만인 도시는 "❄️ 선선함 (25도 미만)" 라벨을 붙인다. (조건 커스텀 가능)
3. **양방향 바인딩 및 한글 처리 (:value, @input)**
   - 도시 이름을 한글로 검색하는 input을 만든 후 한글 입력 후 입력한 도시명을 출력한다.
4. **이벤트 및 수식어**
   - 지역별 날씨 현황 카드를 누르면 상태바에 “{도시}이 선택되었습니다.” 표기
   - 지역별 날씨 현황 카드 내부의 [상세보기] 버튼을 누르면 버블링 없이 해당 도시의 날씨 내용을 `window.alert`로 띄운다.
5. **본인만의 데이터를 추가하고 이를 기초로 Mockup을 추가한다.**

### Hands on - Weather Composition (Composition API)
**▪ 과제 요구사항**
1. **반응형 상태 관리:** 검색어(`searchQuery`), 선택된 도시(`selectedCityInfo`), 그리고 지역별 날씨 데이터 배열(`weatherList`)을 반응형 상태로 정의.
2. **검색 도시 (computed 활용):** 전체 날씨 리스트 중에서 사용자가 입력한 검색어가 도시 이름에 포함된 항목만 필터링하여 Computed 배열에 담아 놓는다. (`filteredWeatherList`)
3. **반응형 변수 변화 감시 (watch, watchEffect):**
   - `selectedCityInfo` 감시 (watch 이용): 상태바 문구가 바뀔 때마다 콘솔로그 작성
   - `searchQuery` 감시 (watchEffect 이용): 도시 검색어를 타이핑할 때마다 변하는 `searchQuery`를 추적하여 콘솔로그 작성
4. **검색 결과 표시 (Template 영역):**
   - 검색어가 비었을 때는 원본 데이터를 출력
   - 검색어와 일치하는 데이터가 있을 때는 해당 데이터 출력
   - 검색어와 일치하는 데이터가 없으면 검색 결과가 일치하는 도시가 없다고 안내
5. **본인만의 반응형 상태 변수, Computed, Watcher를 추가한다.**

### Hands on - Weather Component (Vue Components)
**▪ 과제 요구사항 : 기능 변경 없이 4개의 Component 파일로 분리**
1. **WeatherParent.vue:** 모든 반응형 데이터 유지
2. **BaseDashboardCard.vue:**
   - 검색박스와 리스트박스의 디자인을 공통화.
   - `<slot>` 배치하여 부모 컴포넌트가 도시 검색, 날씨 현황 주입
3. **SearchBar.vue:**
   - 부모로부터 검색도시 반응형 데이터를 전달받아 표시 (props)
   - 도시 검색 시 `update-query` 이벤트를 발생하면서 검색어를 부모에게 전달 (emits)
4. **WeatherCard.vue:**
   - 선택된 도시 객체를 전달받아 표시 (props)
   - 카드를 선택하는 것(`select-card` 이벤트)과 상세보기(`click-detail` 이벤트)를 부모에게 전달 (emits)
5. **각 컴포넌트로 분리하면서 Component에 해당되는 디자인은 `<style scoped>`로 각각 분리**
   - *(참고) Slot으로 전달되는 자식 컴포넌트는 스크립트적으로 부모 스코프에서 평가되므로 부모와 직접 바인딩/통신 가능.*
6. **본인의 Mockup 부분에서 추가로 Component화하거나 위의 Component를 더 분리하여 추가 Component를 만든다.**

### Hands on - Weather Router (Vue Router)
**▪ 과제 요구사항**
1. **Vue Router 설정:** 라우터 지연 로딩(Lazy Loading) 적용, Catch-all Route 적용
2. **App.vue:** Navigation Bar 추가 (`RouterLink`) 및 메인 콘텐츠 영역 배치 (`RouterView`)
3. **WeatherHomeView.vue:** 
   - WeatherParent 대체 (`/` 경로에 맞게 작성)
   - 상세보기 버튼 클릭 시 `window.alert()`를 제거하고 Programmatic Navigation 처리 (`router.push('/weather/' + id)`)
4. **WeatherDetailView.vue:** 
   - 지역별 상세 기상관측 정보를 보여주는 페이지
   - Router 동적 경로 매칭에 해당되는 도시 ID (`cityId`)를 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택
5. **WeatherAboutView.vue:** 적당한 내용 작성 및 메인 대시보드로 돌아가기 작성
6. **상기 정의된 view 이외에 본인의 추가 view를 작성하고 Routing 한다.**

### Hands on - Weather Store (Pinia)
**▪ 과제 요구사항**
1. **UnitToggler.vue:** 대시보드 상단에 배치되어 단위 설정을 변경하는 UI 버튼과 영역
2. **Navigation Bar 옆에 UnitToggler.vue 배치**
3. **메인과 상세 날씨에 단위 설정 변경 적용**
   - *(참고) 메인/상세 공통 로직은 Composable로 해결 가능*
4. **본인만의 추가 Store를 작성하고 활용하거나, configStore에서 state, getter, action을 추가한다.**

### Hands on - Weather Axios
**▪ 과제 요구사항**
1. **Axios 라이브러리 설치 및 API 연동:** OpenWeatherMap API에 가입 및 Key를 발급받아 실제 날씨 데이터를 가져와 적용한다.
2. **OpenWeatherMap에서 제공되는 API를 추가하여 Application 기능을 확장한다.**
3. **기타 외부 API를 추가하여 Application 기능을 확장한다.** (에어코리아 대기질 API 적용)

### Hands on - Weather Deployment (Vite Build & Deployment)
**▪ Source Code 품질관리**
1. ESLint로 점검하여 제출 과제의 Error가 없도록 한다.
2. API 키는 환경 변수로 조정하고 Git에 업로드되지 않도록 한다.

**▪ Build & Deployment**
1. Project를 Build 한다. (`npm run build`)
2. Build 된 정적 파일들을 본인의 서버에 Hosting 한 후 확인한다.
