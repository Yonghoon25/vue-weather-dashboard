<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWeatherDetail } from '@/services/weatherApi'

const route = useRoute()
const router = useRouter()
const cityData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

// 컴포넌트가 화면에 연결된 뒤 URL의 cityId를 읽습니다.
onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    cityData.value = await fetchWeatherDetail(String(route.params.cityId))
    if (!cityData.value) {
      router.push({ name: 'NotFound' })
    }
  } catch (error) {
    console.error('상세 날씨 데이터를 불러오는 데 실패했습니다.', error)
    errorMessage.value = '날씨 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <v-progress-linear v-if="isLoading" indeterminate color="blue-darken-2" class="mb-4" />

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <template v-if="cityData">
      <!-- 헤더 -->
      <div class="d-flex align-center mb-4 ga-3">
        <v-icon icon="mdi-map-marker" color="blue-darken-2" size="28" />
        <h2 class="text-h5 font-weight-bold">{{ cityData.name }} 상세 날씨</h2>
      </div>

      <v-row>
        <!-- 오늘 날씨 -->
        <v-col cols="12" md="6">
          <v-card elevation="2" rounded="lg" height="100%">
            <v-card-title class="bg-blue-darken-2 text-white">
              <v-icon icon="mdi-weather-sunny" class="mr-2" />
              오늘
            </v-card-title>
            <v-card-text class="pt-4">
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-thermometer">
                  <template #title>기온</template>
                  <template #append>
                    <strong>{{ cityData.today.temp.toFixed(1) }}℃</strong>
                  </template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-weather-cloudy">
                  <template #title>날씨</template>
                  <template #append>{{ cityData.today.status }}</template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-water-percent">
                  <template #title>습도</template>
                  <template #append>{{ cityData.today.humidity }}%</template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-weather-windy">
                  <template #title>풍속</template>
                  <template #append>{{ cityData.today.wind }}m/s</template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 내일 날씨 -->
        <v-col cols="12" md="6">
          <v-card elevation="2" rounded="lg" height="100%">
            <v-card-title class="bg-blue-lighten-1 text-white">
              <v-icon icon="mdi-weather-partly-cloudy" class="mr-2" />
              내일 (12시 기준)
            </v-card-title>
            <v-card-text class="pt-4">
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-thermometer">
                  <template #title>기온</template>
                  <template #append>
                    <strong>{{ cityData.tomorrow.temp?.toFixed(1) ?? '-' }}℃</strong>
                  </template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-weather-cloudy">
                  <template #title>날씨</template>
                  <template #append>{{ cityData.tomorrow.status }}</template>
                </v-list-item>
                <v-list-item prepend-icon="mdi-umbrella">
                  <template #title>강수확률</template>
                  <template #append>
                    {{ Math.round((cityData.tomorrow.rainProbability ?? 0) * 100) }}%
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 대기질 예보 -->
        <v-col cols="12" md="6">
          <v-card elevation="2" rounded="lg" height="100%">
            <v-card-title class="bg-grey-darken-1 text-white">
              <v-icon icon="mdi-air-filter" class="mr-2" />
              대기질 예보 (미세먼지 PM10)
            </v-card-title>
            <v-card-text class="pt-4">
              <template v-if="cityData.airQuality.cityGrade">
                <div class="d-flex align-center ga-3 mb-3">
                  <span class="text-body-2 text-medium-emphasis">해당 지역 등급</span>
                  <v-chip
                    :color="cityData.airQuality.cityGrade === '좋음' ? 'blue' :
                            cityData.airQuality.cityGrade === '보통' ? 'green' :
                            cityData.airQuality.cityGrade === '나쁨' ? 'orange' : 'red'"
                    label
                  >
                    {{ cityData.airQuality.cityGrade }}
                  </v-chip>
                  <span v-if="cityData.airQuality.dataTime" class="text-caption text-medium-emphasis">
                    {{ cityData.airQuality.dataTime }}
                  </span>
                </div>
                <p v-if="cityData.airQuality.informOverall" class="text-body-2">
                  {{ cityData.airQuality.informOverall }}
                </p>
              </template>
              <v-alert v-else type="info" variant="tonal">대기질 정보가 없습니다.</v-alert>
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>
    </template>

    <v-btn
      class="mt-4"
      color="blue-darken-2"
      variant="tonal"
      prepend-icon="mdi-arrow-left"
      @click="router.push('/')"
    >
      홈으로 돌아가기
    </v-btn>
  </div>
</template>
