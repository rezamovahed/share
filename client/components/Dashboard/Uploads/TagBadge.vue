<template>
  <span
    class="m-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
  >
    {{ displayName }}
  </span>
</template>

<script>
export default {
  props: {
    displayName: {
      type: String,
      required: true,
    },
  },
}
</script>
