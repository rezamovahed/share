<template>
  <div>
    <portal-target name="dashboard" />
    <div
      class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900"
      @keydown.escape="sidebarHide"
    >
      <DashboardMobileSidebar :links="links" />
      <DashboardDesktopSidebar :links="links" />

      <div
        x-init="$el.focus()"
        class="flex-1 overflow-auto focus:outline-none"
        tabindex="0"
      >
        <div
          class="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 dark:bg-gray-800 md:border-none"
        >
          <button
            class="px-4 text-gray-400 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            @click.stop="sidebarShow"
          >
            <span class="sr-only">Open sidebar</span>
            <HeroIconOutLineMenuAlt2 class="w-6 h-6" />
          </button>
          <!-- Search bar -->
          <div
            class="flex justify-between flex-1 px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8"
          >
            <div class="flex flex-1">
              <form class="flex w-full md:ml-0" action="#" method="GET">
                <label for="search_field" class="sr-only">Search</label>
                <div
                  class="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-700 dark:text-gray-500"
                >
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <HeroIconSoildSearch class="w-5 h-5" />
                  </div>
                  <input
                    id="search_field"
                    name="search_field"
                    class="block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm md:text-lg dark:placeholder-black darl:text-black dark:bg-gray-200"
                    placeholder="Search shares"
                    type="search"
                  />
                </div>
              </form>
            </div>
            <div class="flex items-center justify-end ml-4 md:ml-6">
              <SharedNavigationProfileDropdown />
            </div>
          </div>
        </div>
        <main class="relative z-0 flex-1 pb-8 overflow-y-auto">
          <Nuxt />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import HeroIconOutLineMenuAlt2 from '@/assets/vectors/heroicon/outline/menu-alt-2.svg?inline'
import HeroIconSoildSearch from '@/assets/vectors/heroicon/solid/search.svg?inline'

export default {
  components: {
    HeroIconOutLineMenuAlt2,
    HeroIconSoildSearch,
  },

  data() {
    return {
      links: [
        {
          url: '/dashboard',
          text: 'Stats',
        },
        {
          url: '/dashboard/uploads',
          text: 'Uploads',
        },
      ],
    }
  },

  methods: {
    async sidebarHide() {
      try {
        await this.$store.commit('dashboard/SET_SIDEBAR_OPEN', false)
      } catch (e) {
        this.$toast.error('Oops.. Something Went Wrong..', {
          position: 'bottom-right',
          duration: 5000,
        })
      }
    },

    async sidebarShow() {
      try {
        await this.$store.commit('dashboard/SET_SIDEBAR_OPEN', true)
      } catch (e) {
        this.$toast.error('Oops.. Something Went Wrong..', {
          position: 'bottom-right',
          duration: 5000,
        })
      }
    },
  },
}
</script>
