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
  async getTask({ commit, dispatch, state }) {
    const { data } = await axios.get(`${url}/${state.editedTask.id}`)

    commit('setEditedTask', data)
  },

  async getTaskList({ commit, dispatch, state }) {
    const { data } = await axios.get(url)

    commit('setTaskList', data)
  },

  async postTask({ commit, dispatch, state }) {
    await axios.post(url, state.editedTask)
  },

  async putTask({ commit, dispatch, state }) {
    await axios.put(`${url}/${state.editedTask.id}`, state.editedTask)
  },

  async deleteTask({ commit, dispatch, state }) {
    await axios.delete(`${url}/${state.editedTask.id}`)
  }
}
