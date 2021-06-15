<template>
  <footer class="z-0 bg-white dark:bg-gray-800" aria-labelledby="footerHeading">
    <h2 id="footerHeading" class="sr-only">Footer</h2>
    <div
      class="
        px-4
        py-6
        mx-auto
        max-w-7xl
        sm:px-6
        md:flex
        md:items-center
        md:justify-between
        lg:px-8
      "
    >
      <div class="flex justify-center space-x-6 md:order-2">
        <button
          type="button"
          aria-label="Color Theme"
          class="
            inline-flex
            items-center
            px-3
            py-2
            mt-4
            text-sm
            font-medium
            leading-4
            text-gray-500
            border border-transparent
            rounded-md
            shadow-sm
            bg-primary-100
            hover:bg-primary-400
            hover:text-white
            focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          "
          @click="
            $colorMode.value === 'dark'
              ? ($colorMode.preference = 'light')
              : ($colorMode.preference = 'dark')
          "
        >
          <fa
            v-if="$colorMode.value === 'dark'"
            :icon="['fas', 'sun']"
            class="w-4 h-4 text-xl align-middle"
          />
          <fa
            v-else
            :icon="['far', 'moon']"
            class="w-4 h-4 text-xl align-middle"
          />
        </button>
      </div>
      <div class="mt-8 md:mt-0 md:order-1">
        <p class="text-base text-center text-gray-400 dark:text-gray-200">
          &copy; {{ year }}
          <a class="font-bold" :href="$config.copyrightLink">{{
            $config.copyright
          }}</a
          >. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data: () => ({
    year: new Date().getFullYear(),
  }),
}
</script>
