# 🌤️ Weather Dashboard

지역별 현재 날씨와 예보 정보를 제공하는 웹 서비스

## 프로젝트 소개

OpenWeatherMap API와 에어코리아(AirKorea) API를 활용하여 성남, 창원, 서울, 부산, 대전, 인천의 현재 날씨와 내일 날씨, 그리고 미세먼지 현황을 조회할 수 있는 웹 서비스입니다.

## 주요 기능

- 지역별 현재 날씨 조회
- 내일 날씨 및 강수확률 조회
- 기온 / 습도 / 풍속 조회
- 날씨 상세정보 조회 (Vue Router 동적 라우팅)
- 대기질(미세먼지 PM10) 정보 및 전국 예보 이미지 조회
- 검색 기능을 통한 특정 도시 날씨 필터링
- 섭씨(℃) / 화씨(℉) 단위 변환

## 기술 스택

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

## 프로젝트 구조

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

### Hands on - Weather Mockup
**▪ 과제 요구사항**
1. **배열 렌더링 (v-for)**<br><br>
<img width="432" height="113" alt="image" src="https://github.com/user-attachments/assets/004bb19e-d1ae-40f1-b3d9-53e1ce52e295" /><br>
   - weatherList에 있는 값들을 id를 key값으로 name을 출력하게끔 v-for를 사용하여 배열 렌더링을 구성하였다.

2. **조건부 렌더링 (v-if)**<br><br>
<img width="325" height="50" alt="image (2)" src="https://github.com/user-attachments/assets/9a8e29bc-6b71-4c3c-bf73-b2594d44ce1a" /><br>
   - 기온이 25도 이상이면 더움, 25도 미만이면 선선함을 표시하도록 v-if와 v-else를 적용하였다.

3. **양방향 바인딩 및 한글 처리 (:value, @input)**<br><br>
<img width="207" height="27" alt="image (3)" src="https://github.com/user-attachments/assets/73b589c0-3a06-4764-8709-509c36c88c4f" /> <br><br>
<img width="339" height="109" alt="image (4)" src="https://github.com/user-attachments/assets/6f655660-328c-4ad4-9b50-e7ff0ba8c892" /><br>
   - 검색어를 ref로 관리하고 입력 요소의 :value와 @input을 연결하였다. 사용자가 도시명을 입력하면 searchQuery가 갱신되고, 검색 결과가 화면에 반영된다.

4. **이벤트 및 수식어 (@click, .stop)**<br><br>
   - 지역별 날씨 현황 카드를 클릭하면 `selectedCityInfo` 값이 갱신되어 상태바에 “{도시}이 선택되었습니다.” 문구가 표시되도록 `@click` 이벤트를 연결하였다.

   - 카드 내부의 [상세보기] 버튼에는 `@click.stop`을 적용하여, 버튼 클릭 시 카드 전체의 클릭 이벤트로 버블링되지 않도록 처리하였다. 버튼을 누르면 `window.alert`로 해당 도시의 이름과 날씨 상태가 표시된다.<br><br>
<img width="535" height="26" alt="image 6" src="https://github.com/user-attachments/assets/d26dd7b4-fb47-4302-9966-7dc3777fa053" /><br>

5. **본인만의 데이터를 추가하고 이를 기초로 Mockup을 추가한다.**<br><br>
   - 기존 도시(성남, 창원, 서울, 부산) 외에 **대전**을 `weatherList`에 직접 추가하여 데이터를 확장하였다.
   - 추가한 데이터에도 동일한 v-for, v-if/v-else, 클릭 이벤트 로직이 그대로 적용되어 새 카드가 자연스럽게 렌더링되는 것을 확인하였다.<br><br>
<img width="441" height="186" alt="image 8" src="https://github.com/user-attachments/assets/5f44201d-7276-4922-b069-5802e05a38bc" /><br>

   > ⚠️ 참고: `weatherList`에 대전을 추가하면서 `id`를 `city_03`으로 서울과 동일하게 입력한 부분이 있는데, 추후 'city_05'로 수정하였다.

### Hands on - Weather Composition (Composition API)
**▪ 과제 요구사항**

1. **반응형 상태 관리:** `searchQuery`, `selectedCityInfo`, `weatherList`를 각각 `ref`로 선언하여 반응형 상태로 관리하였다.
2. **검색 도시 (computed 활용):** `searchQuery`를 `trim()`하여 빈 값이면 원본 리스트를, 값이 있으면 `weatherList`에서 `item.name.includes(query)`로 필터링한 배열을 반환하는 `filteredWeatherList`를 computed로 구성하였다.
3. **반응형 변수 변화 감시 (watch, watchEffect):**
   - `watch(selectedCityInfo, ...)`로 상태바 문구가 바뀔 때마다 `[watch] 선택 상태:` 로그를 콘솔에 출력하도록 하였다.<br><br>
<img width="480" height="45" alt="image 9" src="https://github.com/user-attachments/assets/4d335c28-9cd8-4b49-bee3-2d1c7d8b3342" /><br><br>
   - `watchEffect(...)`로 `searchQuery`가 변할 때마다 `[watchEffect] 검색어:` 로그가 자동으로 출력되도록 하였다.<br><br>
<img width="479" height="28" alt="image 10" src="https://github.com/user-attachments/assets/b66e9ad1-efce-4a61-bbab-47070f3738c7" /><br>

4. **검색 결과 표시 (Template 영역):**
   - `searchQuery`가 비어있으면 원본 `weatherList`를 출력한다.
   - `filteredWeatherList`에 일치하는 데이터가 있으면 해당 목록을 출력한다.
   - 일치하는 데이터가 없으면 “검색 결과가 일치하는 도시가 없습니다.” 안내 문구를 출력하도록 v-if/v-else 분기를 구성하였다.

5. **본인만의 반응형 상태 변수, Computed, Watcher를 추가한다.**
   - **`hottestCity` (computed):** `weatherList`를 `reduce`로 순회하여 현재 기온이 가장 높은 도시 객체를 반환하는 계산된 속성을 추가하였다.
   - **`hottestCity` 감시 (watch, immediate: true):** 가장 더운 도시가 바뀔 때마다 “가장 더운 도시가 {이전 도시}에서 {새 도시}으로 변경되었습니다.” 로그를 콘솔에 출력하도록 하였다. `immediate: true` 옵션을 주어 컴포넌트가 처음 마운트될 때도 초기값을 기준으로 한 번 실행되도록 하였다.<br><br>
<img width="432" height="101" alt="image 12" src="https://github.com/user-attachments/assets/d059f53c-f162-49b1-9362-dc0511e34a7c" /><br><img width="479" height="27" alt="image 14" src="https://github.com/user-attachments/assets/da40e898-0d63-42af-a86f-741434e66246" /><br><br>

### Hands on - Weather Component (Vue Components)
**▪ 과제 요구사항 : 기능 변경 없이 4개의 Component 파일로 분리**
1. **WeatherParent.vue:** 기존 `WeatherDashboard.vue`에 있던 `weatherList`, `searchQuery`, `selectedCityInfo`, `filteredWeatherList`, `hottestCity` 등 모든 반응형 데이터와 로직을 그대로 유지하고, 자식 컴포넌트에 필요한 데이터만 props/slot으로 내려주도록 구성하였다.<br><br>

2. **BaseDashboardCard.vue:**
   - 검색박스와 리스트박스에서 공통으로 쓰이는 카드 레이아웃(테두리, 여백, 배경)을 `<style scoped>`로 공통화하였다.
   - `<slot name="title">`과 기본 `<slot>`을 배치하여 부모 컴포넌트가 제목과 내부 콘텐츠(도시 검색, 날씨 현황)를 자유롭게 주입할 수 있도록 하였다.<br><br><img width="482" height="702" alt="image 7" src="https://github.com/user-attachments/assets/9a12e1a8-3c27-493f-91af-e7440283b371" />

3. **SearchBar.vue:**
   - 부모로부터 검색어(`currentQuery`)를 `props`로 전달받아 입력창의 `:value`에 바인딩하였다.
   - 사용자가 도시명을 입력하면 `emit('update-query', $event.target.value')`를 통해 `update-query` 이벤트를 발생시키고, 검색어를 부모에게 전달하도록 구성하였다.<br><br><img width="468" height="353" alt="image 17" src="https://github.com/user-attachments/assets/1120102f-f919-4584-8b30-0d13c1e2b2de" />

4. **WeatherCard.vue:**
   - 부모로부터 선택된 도시 객체(`cityItem`)를 `props`로 전달받아 도시명, 현재 기온, 날씨 상태를 표시하고, 기온에 따라 v-if/v-else로 “더움/선선함”을 표시하였다.
   - 카드 클릭 시 `emit('select-card', ...)`로 `select-card` 이벤트를, [상세보기] 버튼 클릭 시 `@click.stop`과 함께 `emit('click-detail', props.cityItem.id)`로 `click-detail` 이벤트를 부모에게 전달하도록 구성하였다.<br><br><img width="719" height="404" alt="image 18" src="https://github.com/user-attachments/assets/45d09229-b84d-4612-b26e-36e6e348a7d9" />

5. **각 컴포넌트로 분리하면서 Component에 해당되는 디자인은 `<style scoped>`로 각각 분리**
   - `BaseDashboardCard.vue`, `SearchBar.vue`, `WeatherCard.vue` 각 파일 내부에 필요한 스타일만 `<style scoped>`로 작성하여 다른 컴포넌트의 스타일에 영향을 주지 않도록 하였다.
   - *(참고) 슬롯으로 전달되는 자식 컴포넌트(SearchBar, WeatherCard)는 스크립트적으로 부모 스코프에서 평가되므로, `WeatherParent.vue`의 반응형 데이터와 직접 바인딩/통신이 가능함을 확인하였다.*

6. **본인의 Mockup 부분에서 추가로 Component화하거나 위의 Component를 더 분리하여 추가 Component를 만든다.**<br><br>
   - 대기질(미세먼지) 예보 영역을 별도의 컴포넌트로 분리하는 것을 고려 중이며, `BaseDashboardCard.vue`를 재사용하여 동일한 카드 레이아웃으로 구성할 예정이다.

### Hands on - Weather Router (Vue Router)
**▪ 과제 요구사항**
1. **Vue Router 설정:** `router/index.js`에서 각 View를 `() => import('...')` 형태의 동적 import로 불러와 라우터 지연 로딩(Lazy Loading)을 적용하였다. 존재하지 않는 경로에 대해서는 `path: '/:pathMatch(.*)*'` Catch-all Route를 설정하여 `NotFoundView.vue`로 연결하였다.

2. **App.vue:** 상단에 `RouterLink`를 이용한 Navigation Bar(`Home`, `About`)를 추가하고, 그 아래에 실제 페이지 콘텐츠가 렌더링되는 `RouterView` 영역을 배치하였다.

3. **WeatherHomeView.vue:**
   - 기존 `WeatherParent`(대시보드 로직)를 `/` 경로에 맞게 옮겨와 작성하였다.
   - [상세보기] 버튼 클릭 시 기존 `window.alert()` 호출을 제거하고, `router.push('/weather/' + id)`로 해당 도시의 상세 페이지로 이동하는 Programmatic Navigation을 적용하였다.

4. **WeatherDetailView.vue:**
   - 지역별 상세 기상관측 정보(현재 기온, 습도, 풍속, 내일 기온, 내일 강수확률 등)를 보여주는 페이지로 구성하였다.
   - `useRoute()`를 통해 동적 경로 매칭에 해당되는 도시 ID(`cityId`)를 가져오고, `onMounted` 시점에 Mock Data(`weatherList`)에서 해당 ID와 일치하는 도시 객체를 찾아 화면에 표시하도록 하였다.

5. **WeatherAboutView.vue:** 프로젝트 소개 및 사용 기술 스택에 대한 간단한 설명을 작성하고, 하단에 메인 대시보드(`/`)로 돌아가는 `RouterLink`를 배치하였다.

6. **상기 정의된 view 이외에 본인의 추가 view를 작성하고 Routing 한다.**
   - 대기질(미세먼지) 예보 정보를 별도로 보여주는 View를 추가하여 `/air-quality` 경로로 라우팅하는 것을 계획 중이다.

### Hands on - Weather Store (Pinia)
**▪ 과제 요구사항**
1. **UnitToggler.vue:** 대시보드 상단에 배치되어 현재 온도 단위(℃ / ℉)를 표시하고, 클릭 시 단위를 토글하는 UI 버튼을 구성하였다.

2. **Navigation Bar 옆에 UnitToggler.vue 배치**
   - `App.vue`의 Navigation Bar 하단에 “현재 단위: ℃ 단위 변경” 형태로 `UnitToggler.vue`를 배치하여 어느 페이지에서든 단위를 변경할 수 있도록 하였다.

3. **메인과 상세 날씨에 단위 설정 변경 적용**
   - `stores/configStore.js`에 `unit`(state, 초기값 `'celsius'`), `unitSymbol`(getter, 현재 단위에 맞는 ℃/℉ 기호 반환), `toggleUnit`(action, `'celsius'`와 `'fahrenheit'`를 토글) 을 정의하였다.
   - 메인 대시보드와 상세 페이지 각각에서 `configStore.unit` 값을 참조하여 화씨일 경우 `Math.round((rawTemp * 9) / 5 + 32)` 공식으로 변환된 기온을 표시하도록 적용하였다.
   - *(참고) 메인/상세 페이지의 단위 변환 로직이 유사하게 중복되는 부분은 추후 Composable로 분리하여 재사용할 예정이다.*<br><br>
<img width="586" height="881" alt="image 20" src="https://github.com/user-attachments/assets/5a289012-db99-4d16-b186-452b93a37132" /><br><br>

4. **본인만의 추가 Store를 작성하고 활용하거나, configStore에서 state, getter, action을 추가한다.**
   - `configStore`에 오늘 가장 더운 도시를 표시하는 로직과 연계하여, 추후 즐겨찾기 도시를 저장하는 `favoriteCities` state와 `addFavorite`/`removeFavorite` action을 추가하는 것을 계획 중이다.

### Hands on - Weather Axios
**▪ 과제 요구사항**
1. **Axios 라이브러리 설치 및 API 연동:** `npm install axios`로 라이브러리를 설치하고, OpenWeatherMap에 가입하여 발급받은 API Key를 `.env` 파일에 저장한 뒤 `services/weatherApi.js`에서 `import.meta.env`로 불러와 실제 날씨 데이터를 조회하도록 구현하였다. 성남, 창원, 서울, 부산, 대전, 인천 6개 도시의 현재 기온, 날씨 상태, 습도, 풍속을 실시간으로 가져와 화면에 반영하였다.

2. **OpenWeatherMap에서 제공되는 API를 추가하여 Application 기능을 확장한다.**
   - 현재 날씨 API 외에 예보(Forecast) API를 추가로 연동하여 “내일 기온”, “내일 강수확률” 정보를 각 도시 카드에 함께 표시하도록 기능을 확장하였다.

3. **기타 외부 API를 추가하여 Application 기능을 확장한다.** (에어코리아 대기질 API 적용)
   - 공공데이터포털의 에어코리아(AirKorea) 대기질 예보 API를 연동하여 미세먼지(PM10) 전국 예보 이미지와 발표 시각, 권역별 예보 요약(“좋음/보통” 등)을 대시보드 하단에 표시하였다.
   - 지역별 대기질 등급을 서울/경기/강원/충청/전라/경상/제주 등 권역별로 나열하여 확인할 수 있도록 구성하였다.<br><br>
<img width="513" height="567" alt="image 21" src="https://github.com/user-attachments/assets/fee8d645-90b2-4b2a-bb3d-feb956e874a1" /><br><br>
### Hands on - Weather UI Library (UI Libraries)
**▪ 과제 요구사항**

1. **외부 UI Library 적용:** `Vuetify 3`를 UI Library로 선정하고 3일차 과제에 자유롭게 적용하였다.
   - 기존 HTML/CSS 기반 UI를 Vuetify 3의 컴포넌트로 구성하여 카드, 버튼, 입력창 등의 UI를 구현하였다.
   - `Vuetify 3`를 활용하여 일관된 디자인과 반응형 UI를 구성하였다.<br><br>
<img width="622" height="923" alt="image 22" src="https://github.com/user-attachments/assets/09a54f4a-686f-445c-96e6-e64287300155" /><br><br>

### Hands on - Weather Deployment (Vite Build & Deployment)
**▪ Source Code 품질관리**
1. ESLint로 프로젝트 전체를 점검하여 Error가 없는 것을 확인한 뒤 제출하였다.
2. OpenWeatherMap, 에어코리아 API 키는 `.env` 파일의 환경 변수로 분리하고, `.gitignore`에 `.env`를 추가하여 Git에 업로드되지 않도록 처리하였다.

**▪ Build & Deployment**
1. `npm run build` 명령어로 프로젝트를 빌드하여 `dist/` 폴더에 정적 파일(HTML, JS, CSS, 폰트, favicon 등)을 생성하였다.<br><br>
<img width="233" height="290" alt="image 23" src="https://github.com/user-attachments/assets/2156e9ef-eb62-42cc-ad08-c2a9ce113b64" /><br><br>

2. 빌드된 정적 파일들을 본인의 서버에 Hosting한 후 정상적으로 동작하는지 확인하였다.
