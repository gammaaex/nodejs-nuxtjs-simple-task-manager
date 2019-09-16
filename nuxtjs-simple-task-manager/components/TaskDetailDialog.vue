<template>
  <v-dialog v-model="internalValue" max-width="500px">
    <v-card>
      <slot />
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn color="blue darken-1" @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean
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
