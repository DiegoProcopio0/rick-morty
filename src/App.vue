<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from '../src/stores'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const store = useStore()

const statusOptions = ref([
  { name: 'Vivo', code: 'alive' },
  { name: 'Morto', code: 'dead' },
  { name: 'Desconhecido', code: 'unknown' },
])

const name = ref('')
const status = ref<(typeof statusOptions.value)[0]>({ name: '', code: '' })
const page = ref(1)
const loading = ref(false)
const modal = ref(false)
const person = ref<(typeof store.persons)[0]>()

const showSuccess = () => {
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Sucesso ao buscar personagens',
    life: 3000,
  })
}

const showError = () => {
  toast.add({
    severity: 'error',
    summary: 'Erro',
    detail: 'Erro ao buscar personagens',
    life: 3000,
  })
}

const showWarn = () => {
  toast.add({
    severity: 'warn',
    summary: 'Cuidado',
    detail: 'Nenhum personagem encontrado',
    life: 3000,
  })
}

const changePage = (ev: { page: number }) => {
  page.value = ev.page + 1
  fetchPersons()
}

const fetchPersons = async () => {
  loading.value = true

  const result = await store.fetchPersons({
    page: page.value,
    name: name.value.trim(),
    status: status.value.code,
  })

  if (result.status === 200) {
    showSuccess()
  } else if (result.status === 404) {
    showWarn()
  } else {
    showError()
  }

  loading.value = false
}

const openPerson = (id: number) => {
  modal.value = true
  person.value = store.persons.find((person) => person.id === id)
}

const getStatusClass = (status: string | undefined) => {
  if (status === 'Alive') return 'bg-green-500'
  if (status === 'Dead') return 'bg-red-500'
  return 'bg-gray-500'
}

onMounted(async () => {
  await fetchPersons()
})
</script>

<template>
  <div class="min-h-dvh h-full bg-gray-900">
    <Toast />
    <div
      class="flex flex-col items-center 2xl:max-w-[80rem] mx-auto py-5 lg:py-10 max-w-[80%]"
    >
      <h1
        class="text-emerald-500 font-bold text-xl mb-4 md:text-3xl xl:text-4xl"
      >
        Personagens de Rick and Morty
      </h1>

      <h2 class="text-gray-400 text-base md:text-xl" v-if="store.count !== 0">
        Total de {{ store.count }} personagens encontrados
      </h2>

      <h2 class="text-gray-400 text-base md:text-xl" v-else>
        Já acabou Jessica?
      </h2>

      <div
        class="w-full flex flex-col md:flex-row gap-4 justify-center mt-5 mb-5 mx-auto"
      >
        <InputText
          class="w-full"
          type="text"
          v-model="name"
          variant="filled"
          @blur="fetchPersons"
          @keyup.enter="fetchPersons"
          placeholder="Buscar por nome..."
        />

        <Select
          v-model="status"
          :options="statusOptions"
          optionLabel="name"
          placeholder="Todos os status"
          class="w-full md:w-[40%]"
          @change="fetchPersons"
        />
      </div>

      <Skeleton v-if="loading" width="100%" height="150px" />

      <Dialog v-model:visible="modal" modal :header="person?.name">
        <div class="flex flex-col lg:flex-row min-w-[600px]">
          <img
            :src="person?.image"
            alt="personagem"
            class="max-w-64 mb-5 md:mb-0 pl-3 md:pl-0 md:max-w-full h-48 md:h-auto object-cover"
          />

          <div class="px-3 ml-2">
            <p class="font-semibold text-xl">Estado</p>
            <div class="flex items-center gap-2 mt-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="getStatusClass(person?.status)"
              ></div>
              <span> {{ person?.status }} - </span>
              <span>
                {{ person?.species }}
              </span>
            </div>

            <p class="font-semibold text-xl mt-4">Localização</p>
            <div class="mt-2">
              {{ person?.location.name }}
            </div>

            <p class="font-semibold text-xl mt-4">Origem</p>
            <div class="mt-2">
              {{ person?.origin.name }}
            </div>

            <p class="font-semibold text-xl mt-4">Episódios</p>
            <div class="mt-2">
              Aparece em {{ person?.episode.length }} episódios
            </div>
          </div>
        </div>
      </Dialog>

      <ul
        class="text-gray-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
        v-if="!loading && store.count !== 0"
      >
        <li
          @click="openPerson(person.id)"
          v-for="person in store.persons"
          :key="person.id"
          class="flex flex-col pb-4 bg-gray-800 rounded-xl shadow-2xl shadow-gray-700 hover:shadow-emerald-500 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <img
            :src="person.image"
            alt="personagem"
            class="w-full h-48 object-cover"
          />
          <div class="px-3 pt-3">
            <p class="font-semibold text-xl">{{ person.name }}</p>

            <div class="flex items-center gap-2 mt-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="getStatusClass(person?.status)"
              ></div>
              <span> {{ person.status }} - </span>
              <span>
                {{ person.species }}
              </span>
            </div>
          </div>
        </li>
      </ul>

      <div
        v-if="!loading && store.count === 0"
        class="shadow-emerald-500 shadow-lg p-10 rounded-2xl text-center"
      >
        <i
          class="pi pi-thumbs-down-fill"
          style="color: red; font-size: 2rem"
        ></i>

        <h3 class="text-xl md:text-2xl text-emerald-500 font-semibold my-4">
          Não encontramos nenhum personagem com esse nome ou status
        </h3>
        <p class="text-gray-400 text-base md:text-xl">
          Na humildade memo, ficou fazendo a pose de quebrada!
        </p>
      </div>

      <Paginator
        v-if="!loading && store.count !== 0"
        class="mt-10"
        :rows="20"
        @page="changePage"
        :totalRecords="store.count"
        :rowsPerPageOptions="[10, 20, 30]"
      />
    </div>
  </div>
</template>
