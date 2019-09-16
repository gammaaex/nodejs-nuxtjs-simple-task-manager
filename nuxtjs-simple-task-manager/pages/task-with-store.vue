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
        <task-form v-model="localEditedTask" readonly title="Detail Task" />
      </task-detail-dialog>
      <task-input-dialog
        v-model="isOpenInputDialog"
        button
        button-text="New Task"
        @submit="handleSubmit()"
        @cancel="closeInputDialog()"
      >
        <task-form v-model="localEditedTask" :title="formTitle" />
      </task-input-dialog>
      <v-toolbar flat color="grey">
        <v-toolbar-title>My Task List</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <div class="flex-grow-1" />
        <v-btn color="primary" dark class="mb-2" @click="handleReload()">
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
      <v-btn icon dark class="ml-2" @click="handleDelete(item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import TaskForm from '../components/TaskForm'
import TaskDetailDialog from '../components/TaskDetailDialog'
import TaskInputDialog from '../components/TaskInputDialog'

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
      isOpenDetailDialog: false,
      isOpenInputDialog: false,
      localEditedTask: {},
      defaultTask: {
        id: 0,
        title: '',
        description: ''
      }
    }
  },

  computed: {
    ...mapState('task', {
      action: 'action',
      taskList: 'taskList',
      editedTask: 'editedTask'
    }),

    formTitle() {
      return this.action === 'create' ? 'New Task' : 'Edit Task'
    }
  },

  async created() {
    await this.getTaskList()
  },

  methods: {
    ...mapMutations('task', ['setAction', 'setTaskList', 'setEditedTask']),

    ...mapActions('task', [
      'getTask',
      'getTaskList',
      'postTask',
      'putTask',
      'deleteTask'
    ]),

    async openDetailDialog(task) {
      this.localEditedTask = Object.assign({}, task)
      this.setEditedTask(Object.assign({}, task))
      await this.getTask()
      this.isOpenDetailDialog = true
      this.setAction('detail')
    },

    closeDetailDialog() {
      this.localEditedTask = Object.assign({}, this.defaultTask)
      this.setEditedTask(Object.assign({}, this.defaultTask))
      this.isOpenDetailDialog = false
      this.setAction('')
    },

    openCreateDialog() {
      this.localEditedTask = Object.assign({}, this.defaultTask)
      this.isOpenInputDialog = true
      this.setAction('create')
    },

    openEditDialog(task) {
      this.localEditedTask = Object.assign({}, task)
      this.setEditedTask(Object.assign({}, task))
      this.isOpenInputDialog = true
      this.setAction('edit')
    },

    closeInputDialog() {
      this.localEditedTask = Object.assign({}, this.defaultTask)
      this.setEditedTask(Object.assign({}, this.defaultTask))
      this.isOpenInputDialog = false
      this.setAction('')
    },

    async handleReload() {
      await this.getTaskList()
    },

    async handleDelete(task) {
      this.setAction('delete')
      if (!confirm('Are you sure you want to delete this item?')) {
        this.setAction('')
        return
      }

      this.setEditedTask(Object.assign({}, task))
      await this.deleteTask()
      await this.getTaskList()
      this.setAction('')
    },

    async handleSubmit() {
      this.setEditedTask(Object.assign({}, this.localEditedTask))
      if (this.action === 'create') {
        await this.postTask()
        await this.getTaskList()
      } else if (this.action === 'edit') {
        await this.putTask()
        await this.getTaskList()
      }
      this.closeInputDialog()
    }
  }
}
</script>
