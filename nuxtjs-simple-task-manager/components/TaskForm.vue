<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="internalValue.title"
              label="Title"
              :readonly="readonly"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="internalValue.description"
              label="Description"
              :readonly="readonly"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      required: true
      // title: {
      //   type: String,
      //   required: true
      // },
      // description: {
      //   type: String,
      //   required: true
      // }
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
