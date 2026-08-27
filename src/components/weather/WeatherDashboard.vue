<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import { useRouter } from 'vue-router'
import { fetchWeatherList } from '@/services/weatherApi'

const router = useRouter()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const snackbar = ref(false)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 대기질 데이터는 모든 도시가 공통이므로 첫 번째 도시에서 꺼냄
const airQualityInfo = computed(() => weatherList.value[0]?.airQuality ?? null)

// informGrade 문자열 → [{ region, grade }] 배열로 파싱
// 예: "서울 : 좋음,부산 : 보통" → [{ region: '서울', grade: '좋음' }, ...]
const gradeList = computed(() => {
  const informGrade = airQualityInfo.value?.informGrade
  if (!informGrade) return []
  return informGrade.split(',').map((part) => {
    const [region, grade] = part.split(':').map((s) => s.trim())
    return { region, grade }
  })
})

// 등급에 따른 Vuetify 색상
function gradeColor(grade) {
  if (grade === '좋음') return 'blue'
  if (grade === '보통') return 'green'
  if (grade === '나쁨') return 'orange'
  if (grade === '매우나쁨') return 'red'
  return 'grey'
}

watch(selectedCityInfo, (newInfo) => {
  console.log('[watch] 선택 상태:', newInfo)
  snackbar.value = true
})

watchEffect(() => {
  console.log('[watchEffect] 검색어:', searchQuery.value)
})

const hottestCity = computed(() => {
  if (weatherList.value.length === 0) return null
  return weatherList.value.reduce((hottest, city) => {
    return city.today.temp > hottest.today.temp ? city : hottest
  })
})

watch(
  hottestCity,
  (newCity, oldCity) => {
    if (newCity) {
      console.log(`가장 더운 도시가 ${oldCity?.name}에서 ${newCity.name}으로 변경되었습니다.`)
    }
  },
  {
    immediate: true,
  },
)

function goDetail(cityId) {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    weatherList.value = await fetchWeatherList()
  } catch (error) {
    console.error('날씨 데이터를 불러오는 데 실패했습니다.', error)
    errorMessage.value = '날씨 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <!-- 로딩 바 -->
    <v-progress-linear v-if="isLoading" indeterminate color="blue-darken-2" class="mb-4" />

    <!-- 도시 검색 -->
    <BaseDashboardCard>
      <template #title>🔍 도시 검색</template>

      <SearchBar :current-query="searchQuery" @update-query="(value) => (searchQuery = value)" />

      <div v-if="searchQuery" class="mt-2 text-caption text-medium-emphasis">
        "<strong>{{ searchQuery }}</strong>" 검색 중
      </div>
    </BaseDashboardCard>

    <!-- 가장 더운 도시 -->
    <BaseDashboardCard>
      <template #title>오늘 가장 핫한 도시 🔥</template>

      <div v-if="isLoading" class="text-medium-emphasis">데이터 로딩 중...</div>
      <div v-else-if="hottestCity" class="d-flex align-center ga-2">
        <v-icon icon="mdi-fire" color="red" size="32" />
        <span class="text-h5 font-weight-bold">{{ hottestCity.name }}</span>
        <v-chip color="red-lighten-1" label>{{ hottestCity.today.temp.toFixed(1) }}℃</v-chip>
      </div>
      <div v-else class="text-medium-emphasis">데이터 없음</div>
    </BaseDashboardCard>

    <!-- 지역별 날씨 -->
    <BaseDashboardCard>
      <template #title>지역별 날씨 현황</template>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-3">
        {{ errorMessage }}
      </v-alert>

      <template v-if="!isLoading && !errorMessage">
        <v-row>
          <v-col
            v-for="city in filteredWeatherList"
            :key="city.id"
            cols="12"
            sm="6"
            md="4"
          >
            <WeatherCard
              :city-item="city"
              @select-card="(message) => (selectedCityInfo = message)"
              @click-detail="goDetail"
            />
          </v-col>
        </v-row>

        <v-alert v-if="filteredWeatherList.length === 0" type="info" variant="tonal">
          검색 결과가 없습니다.
        </v-alert>
      </template>
    </BaseDashboardCard>

    <!-- 대기질 예보(미세먼지) -->
    <BaseDashboardCard>
      <template #title>대기질 예보 (미세먼지 PM10) 🌫️</template>

      <div v-if="isLoading" class="text-medium-emphasis">대기질 데이터를 불러오는 중입니다...</div>
      <template v-else-if="airQualityInfo">
        <div v-if="airQualityInfo.dataTime" class="text-caption text-medium-emphasis mb-1">
          📢 {{ airQualityInfo.dataTime }}
        </div>
        <p v-if="airQualityInfo.informOverall" class="mb-3">
          {{ airQualityInfo.informOverall }}
        </p>

        <v-row class="flex-nowrap" style="min-height: 0">
          <!-- 왼쪽: 전국 예보 이미지 -->
          <v-col cols="12" md="7">
            <v-img
              v-if="airQualityInfo.imageUrl"
              :src="airQualityInfo.imageUrl"
              alt="전국 미세먼지 예보 이미지"
              rounded="lg"
            />
            <div v-else class="text-medium-emphasis">예보 이미지가 없습니다.</div>
          </v-col>

          <!-- 세로 구분선 -->
          <v-divider vertical class="my-2" />

          <!-- 오른쪽: 지역별 등급 목록 -->
          <v-col
            v-if="gradeList.length"
            cols="12"
            md="5"
            class="d-flex flex-column pl-4 pt-0"
          >
            <div class="text-subtitle-2 font-weight-bold mb-2">지역별 대기질 등급</div>
            <v-row dense class="flex-grow-1">
              <v-col
                v-for="(item, idx) in gradeList"
                :key="item.region"
                cols="6"
                class="grade-cell"
                :class="{ 'grade-cell--left': idx % 2 === 0 }"
              >
                <div class="d-flex align-center justify-space-between pa-2">
                  <span class="text-body-2">{{ item.region }}</span>
                  <v-chip :color="gradeColor(item.grade)" size="x-small" label>
                    {{ item.grade }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>

      <div v-else class="text-medium-emphasis">대기질 데이터 없음</div>
    </BaseDashboardCard>


    <!-- 선택 상태 스낵바 -->
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="blue-darken-2"
      location="bottom"
    >
      {{ selectedCityInfo }}
    </v-snackbar>
  </div>
</template>

<style scoped>
/* 지역별 대기질 등급 - 행/열 구분선 */
.grade-cell {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.grade-cell--left {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

/* 마지막 두 항목은 border-bottom 제거 */
.grade-cell:nth-last-child(-n+2) {
  border-bottom: none;
}
</style>
