<template>
  <v-data-table
    :headers="headerList"
    :items="taskList"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <task-detail-dialog
        v-model="isOpenDetailDialog"
        title="Task Detail"
        @close="closeDetailDialog()"
      >
        <task-form v-model="editedTask" readonly title="Detail Task" />
      </task-detail-dialog>
      <task-input-dialog
        v-model="isOpenInputDialog"
        button
        button-text="New Task"
        @submit="handleSubmit()"
        @cancel="closeInputDialog()"
      >
        <task-form v-model="editedTask" :title="formTitle" />
      </task-input-dialog>
      <v-toolbar flat color="grey">
        <v-toolbar-title>My Task List</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <div class="flex-grow-1" />
        <v-btn color="primary" dark class="mb-2" @click="getTaskList()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
        <v-divider class="mx-4" inset vertical />
        <v-btn color="primary" dark class="mb-2" @click="openCreateDialog()">
          New Task
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn icon dark @click="openDetailDialog(item)">
        <v-icon>mdi-file-document</v-icon>
      </v-btn>
      <v-btn icon dark class="ml-2" @click="openEditDialog(item)">
        <v-icon>mdi-grease-pencil</v-icon>
      </v-btn>
      <v-btn icon dark class="ml-2" @click="deleteTask(item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import TaskForm from '../components/TaskForm'
import TaskDetailDialog from '../components/TaskDetailDialog'
import TaskInputDialog from '../components/TaskInputDialog'

const url = 'http://localhost:3000/api/tasks'

export default {
  components: {
    TaskForm,
    TaskDetailDialog,
    TaskInputDialog
  },
  data() {
    return {
      headerList: [
        { text: 'ID', value: 'id' },
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      taskList: [],
      isOpenDetailDialog: false,
      isOpenInputDialog: false,
      editedTask: {
        id: 0,
        title: '',
        description: ''
      },
      defaultTask: {
        id: 0,
        title: '',
        description: ''
      },
      action: 'create'
    }
  },

  computed: {
    formTitle() {
      return this.action === 'create' ? 'New Task' : 'Edit Task'
    }
  },

  async created() {
    await this.getTaskList()
  },

  methods: {
    async openDetailDialog(item) {
      this.editedTask = Object.assign({}, item)
      await this.getTask()
      this.isOpenDetailDialog = true
      this.action = 'detail'
    },

    closeDetailDialog() {
      this.editedTask = Object.assign({}, this.defaultTask)
      this.isOpenDetailDialog = false
      this.action = ''
    },

    openCreateDialog() {
      this.isOpenInputDialog = true
      this.action = 'create'
    },

    openEditDialog(item) {
      this.editedTask = Object.assign({}, item)
      this.isOpenInputDialog = true
      this.action = 'edit'
    },

    closeInputDialog() {
      this.editedTask = Object.assign({}, this.defaultTask)
      this.isOpenInputDialog = false
      this.action = ''
    },

    async handleSubmit() {
      if (this.action === 'create') {
        await this.postTask()
      } else if (this.action === 'edit') {
        await this.putTask()
      }
    },

    async getTask() {
      const { data } = await axios.get(`${url}/${this.editedTask.id}`)
      this.editedTask = data
    },

    async getTaskList() {
      const { data } = await axios.get(url)
      this.taskList = data
    },

    async postTask() {
      await axios.post(url, this.editedTask)
      await this.getTaskList()

      this.closeInputDialog()
    },

    async putTask() {
      await axios.put(`${url}/${this.editedTask.id}`, this.editedTask)
      await this.getTaskList()

      this.closeInputDialog()
    },

    async deleteTask(item) {
      if (!confirm('Are you sure you want to delete this item?')) {
        return
      }
      await axios.delete(`${url}/${item.id}`)
      await this.getTaskList()
    }
  }
}
</script>
