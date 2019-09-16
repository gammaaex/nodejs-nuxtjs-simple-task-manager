import axios from 'axios'
const url = 'http://localhost:3000/api/tasks'

export const state = () => ({
  action: 'create',
  taskList: [],
  editedTask: {
    id: 0,
    title: '',
    description: ''
  }
})

export const mutations = {
  setAction(state, action) {
    state.action = action
  },

  setTaskList(state, taskList) {
    state.taskList = taskList
  },

  setEditedTask(state, editedTask) {
    state.editedTask = editedTask
  }
}

export const actions = {
  async getTask({ commit, state }) {
    const { data } = await axios.get(`${url}/${state.editedTask.id}`)

    commit('setEditedTask', data)
  },

  async getTaskList({ commit }) {
    const { data } = await axios.get(url)

    commit('setTaskList', data)
  },

  async postTask({ state }) {
    await axios.post(url, state.editedTask)
  },

  async putTask({ state }) {
    await axios.put(`${url}/${state.editedTask.id}`, state.editedTask)
  },

  async deleteTask({ state }) {
    await axios.delete(`${url}/${state.editedTask.id}`)
  }
}
