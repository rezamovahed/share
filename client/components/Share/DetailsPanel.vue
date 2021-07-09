<template>
  <div>
    <dt class="font-medium text-gray-900 dark:text-gray-100 text-lg">
      {{ title }}
    </dt>
    <dd class="mt-1 text-base text-gray-800 dark:text-gray-100">
      {{ description }}
    </dd>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
}
</script>
