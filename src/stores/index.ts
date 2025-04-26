import { defineStore } from 'pinia'
import { type ApiResponse, type FetchPersonsParams } from '../@types'
import instance from '../services/api'

interface State {
  count: ApiResponse['info']['count']
  pages: ApiResponse['info']['pages']
  next: ApiResponse['info']['next']
  prev: ApiResponse['info']['prev']
  persons: ApiResponse['results']
}

export const useStore = defineStore('store', {
  state: (): State => ({
    count: 0,
    pages: 1,
    next: null,
    prev: null,
    persons: [],
  }),

  getters: {},

  actions: {
    setDefaultInfo() {
      this.count = 0
      this.pages = 1
      this.next = null
      this.prev = null
      this.persons = []
    },

    setInfo(info: ApiResponse['info']) {
      this.count = info.count
      this.pages = info.pages
      this.next = info.next
      this.prev = info.prev
    },

    setPersons(persons: ApiResponse['results']) {
      this.persons = persons
    },

    async fetchPersons({ name, page, status }: FetchPersonsParams) {
      const result = await instance.request<ApiResponse>({
        method: 'GET',
        params: {
          page,
          name,
          status,
        },
      })

      if (result.data && result.status === 200) {
        const { info, results } = result.data
        this.setInfo(info)
        this.setPersons(results)
      }

      console.log('result', result.status)

      if (result.status === 404) {
        this.setDefaultInfo()
      }

      return {
        status: result.status,
      }
    },
  },
})
