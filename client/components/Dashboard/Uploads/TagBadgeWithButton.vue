<template>
  <div
    class="bg-primary-100 dark:bg-primary-800 inline-flex items-center text-sm rounded mt-2 mr-1 overflow-hidden"
  >
    <span
      class="ml-2 mr-1 px-1 rounded-md text-sm font-medium text-primary-800 dark:text-primary-100"
      x-text="tag"
      >{{ displayName }}</span
    >
    <button
      class="w-6 h-8 inline-block align-middle text-primary-800 bg-primary-50 dark:bg-primary-200 focus:outline-none"
    >
      <svg
        class="w-6 h-6 fill-current mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
        />
      </svg>
    </button>
  </div>
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
