import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://rickandmortyapi.com/api/character',
})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return error.response
  }
)

export default instance
