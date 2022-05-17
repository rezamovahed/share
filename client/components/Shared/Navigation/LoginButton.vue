<template>
  <div v-if="!$auth.loggedIn" class="relative ml-3 z-10">
    <nuxt-link
      to="/login"
      class="flex items-center max-w-xs px-4 py-2 text-sm bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-primary-100 font-roboto dark:bg-gray-700"
    >
      Log in
    </nuxt-link>
  </div>
</template>
