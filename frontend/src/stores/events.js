import { defineStore } from 'pinia'
import { eventsAPI, categoriesAPI, venuesAPI } from '../services/api'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    categories: [],
    venues: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchEvents() {
      this.loading = true
      try {
        const res = await eventsAPI.getAll()
        this.events = res.data
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async fetchCategories() {
      const res = await categoriesAPI.getAll()
      this.categories = res.data
    },
    async fetchVenues() {
      const res = await venuesAPI.getAll()
      this.venues = res.data
    }
  }
})
