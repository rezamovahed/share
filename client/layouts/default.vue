<template>
  <div>
    <portal to="destination"></portal>
    <div class="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900">
      <main id="content" role="main" class="flex-grow">
        <SharedOfflineBanner v-if="$nuxt.isOffline" />
        <Nuxt />
      </main>
    </div>
  </div>
</template>
