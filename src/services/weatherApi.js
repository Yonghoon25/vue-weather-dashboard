import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const AIR_API_KEY = import.meta.env.VITE_AIRKOREA_API_KEY

// 오늘 현재 날씨 API
const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 7000,
})

// 5일 / 3시간 예보 API
const forecastClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/forecast',
  timeout: 7000,
})

// 에어코리아 대기질 예보 API
const airQualityClient = axios.create({
  baseURL: 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc',
  timeout: 7000,
})

const CITY_LIST = [
  { id: 'city_01', name: '성남', lat: 37.4386, lon: 127.1378, gradeKey: '경기남부' },
  { id: 'city_02', name: '창원', lat: 35.2281, lon: 128.6811, gradeKey: '경남' },
  { id: 'city_03', name: '서울', lat: 37.5665, lon: 126.978, gradeKey: '서울' },
  { id: 'city_04', name: '부산', lat: 35.1796, lon: 129.0756, gradeKey: '부산' },
  { id: 'city_05', name: '대전', lat: 36.3504, lon: 127.3845, gradeKey: '대전' },
  { id: 'city_06', name: '인천', lat: 37.4563, lon: 126.7052, gradeKey: '인천' },
]

function assertApiKey() {
  if (!API_KEY) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.')
  }

  if (!AIR_API_KEY) {
    throw new Error('VITE_AIRKOREA_API_KEY가 설정되지 않았습니다.')
  }
}

// 오늘 날짜 YYYY-MM-DD
function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 내일 날짜 YYYY-MM-DD
function getTomorrowDate() {
  const tomorrow = new Date()

  tomorrow.setDate(tomorrow.getDate() + 1)

  const year = tomorrow.getFullYear()
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const day = String(tomorrow.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// AirKorea 대기질 예보 조회
// .env의 serviceKey가 URL 인코딩된 상태이므로, axios가 이중 인코딩하지 않도록 미리 디코딩합니다.
async function requestAirQuality() {
  const decodedKey = decodeURIComponent(AIR_API_KEY)
  const response = await airQualityClient.get('/getMinuDustFrcstDspth', {
    params: {
      serviceKey: decodedKey,
      returnType: 'json',
      searchDate: getTodayDate(),
      informCode: 'PM10',
    },
  })

  return response.data
}

// AirKorea 응답에서 오늘 날짜 기준 대기질 예보 정보 가져오기
function normalizeAirQuality(airQualityData) {
  // 실제 응답 구조: response.body.items → 바로 배열 (items.item 아님)
  const items = airQualityData?.response?.body?.items

  if (!Array.isArray(items) || items.length === 0) {
    return {
      imageUrl: null,
      informGrade: null,
      informOverall: null,
      informCause: null,
      dataTime: null,
    }
  }

  // imageUrl1이 존재하는 첫 번째 항목 사용 (오늘 예보)
  const item = items.find((i) => i.imageUrl1) ?? items[0]

  return {
    imageUrl: item.imageUrl1 ?? null,
    informGrade: item.informGrade ?? null,   // "서울 : 좋음,경기남부 : 좋음,..." 형태
    informOverall: item.informOverall ?? null, // 전체 예보 요약
    informCause: item.informCause ?? null,    // 발생 원인
    dataTime: item.dataTime ?? null,          // 발표 시각
  }
}

// informGrade 문자열에서 특정 도시(gradeKey)의 등급만 추출
// 예: "서울 : 좋음,경기남부 : 보통" → gradeKey='경기남부' → '보통'
function getGradeForCity(informGrade, gradeKey) {
  if (!informGrade || !gradeKey) return null

  const parts = informGrade.split(',').map((s) => s.trim())
  const matched = parts.find((p) => p.startsWith(gradeKey))

  return matched ? matched.split(':')[1]?.trim() ?? null : null
}

// 특정 도시의 날씨 조회
async function requestWeather(city) {
  const [currentResponse, forecastResponse] = await Promise.all([
    // 현재 날씨
    weatherClient.get('', {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    }),

    // 5일 / 3시간 예보
    forecastClient.get('', {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    }),
  ])

  return {
    current: currentResponse.data,
    forecast: forecastResponse.data,
  }
}

// 내일 12시 예보 찾기
function getTomorrowForecast(forecastData) {
  const tomorrowDate = getTomorrowDate()

  return forecastData.list.find((item) => item.dt_txt === `${tomorrowDate} 12:00:00`)
}

// 날씨 데이터를 화면에서 사용하기 좋은 형태로 변환
function normalizeWeather(city, currentData, forecastData, airQualityData) {
  const tomorrow = getTomorrowForecast(forecastData)

  return {
    id: city.id,
    name: city.name,

    // 오늘
    today: {
      temp: currentData.main.temp,

      status: currentData.weather?.[0]?.description ?? '정보 없음',

      humidity: currentData.main.humidity,

      wind: currentData.wind.speed,
    },

    // 내일
    tomorrow: {
      temp: tomorrow?.main?.temp ?? null,

      status: tomorrow?.weather?.[0]?.description ?? '정보 없음',

      rainProbability: tomorrow?.pop ?? 0,
    },

    // 대기질 예보 (전국 이미지 + 해당 도시 등급 포함)
    airQuality: {
      ...airQualityData,
      cityGrade: getGradeForCity(airQualityData.informGrade, city.gradeKey),
    },
  }
}

// 도시 목록 조회
export async function fetchWeatherList() {
  assertApiKey()

  // AirKorea는 도시별로 호출하지 않고 딱 한 번만 호출
  const airQualityResponse = await requestAirQuality()

  const airQuality = normalizeAirQuality(airQualityResponse)

  // 성남, 창원, 서울, 부산, 대전 날씨를 병렬 조회
  return Promise.all(
    CITY_LIST.map(async (city) => {
      const data = await requestWeather(city)

      return normalizeWeather(city, data.current, data.forecast, airQuality)
    }),
  )
}

// 도시 상세 조회
export async function fetchWeatherDetail(cityId) {
  assertApiKey()

  const city = CITY_LIST.find((item) => item.id === cityId)

  if (!city) {
    return null
  }

  // 해당 도시 날씨 조회
  const weatherData = await requestWeather(city)

  // 대기질 예보 조회
  const airQualityResponse = await requestAirQuality()

  const airQuality = normalizeAirQuality(airQualityResponse)

  return normalizeWeather(city, weatherData.current, weatherData.forecast, airQuality)
}
