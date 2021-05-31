<template>
  <div>
    <div
      class="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900"
      @keydown.escape="sidebarHide"
    >
      <AccountMobileSidebar
        :links="links"
        :backto="true"
        backto-link="/dashboard"
        backto-text="Back to Dashboard"
      />
      <AccountDesktopSidebar
        :links="links"
        :backto="true"
        backto-link="/dashboard"
        backto-text="Back to Dashboard"
      />
      <div
        x-init="$el.focus()"
        class="flex-1 overflow-auto focus:outline-none"
        tabindex="0"
      >
        <div
          class="
            sticky
            top-0
            z-10
            flex flex-shrink-0
            h-16
            bg-white
            border border-transparent
            dark:bg-gray-800
          "
        >
          <button
            class="
              px-4
              text-gray-400
              border-r border-gray-200
              focus:outline-none
              focus:ring-2 focus:ring-inset focus:ring-indigo-500
              md:hidden
            "
            @click.stop="sidebarShow"
          >
            <span class="sr-only">Open sidebar</span>
            <HeroIconOutLineMenuAlt2 class="w-6 h-6" />
          </button>
          <div
            class="
              flex
              justify-between
              flex-1
              px-4
              sm:px-6
              lg:max-w-6xl
              lg:mx-auto
              lg:px-8
            "
          >
            <div class="flex items-center justify-end flex-1 ml-4 md:ml-6">
              <SharedNavigationProfileDropdown />
            </div>
          </div>
        </div>
        <main
          class="relative flex-1 overflow-y-auto focus:outline-none"
          tabindex="0"
          x-data=""
          x-init="$el.focus()"
        >
          <Nuxt />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import HeroIconOutLineMenuAlt2 from '@/assets/vectors/heroicon/outline/menu-alt-2.svg?inline'

export default {
  components: {
    HeroIconOutLineMenuAlt2,
  },

  data() {
    return {
      links: [
        {
          url: '/account',
          text: 'Profile',
        },
        {
          url: '/account/personal-information',
          text: 'Personal Information',
        },
        {
          url: '/account/security',
          text: 'Security',
        },
        {
          url: '/account/devices',
          text: 'Devices',
        },
      ],
    }
  },

  methods: {
    async sidebarHide() {
      try {
        await this.$store.commit('account/SET_SIDEBAR_OPEN', false)
      } catch (e) {
        this.$toast.error('Oops.. Something Went Wrong..', {
          position: 'bottom-right',
        })
      }
    },

    async sidebarShow() {
      try {
        await this.$store.commit('account/SET_SIDEBAR_OPEN', true)
      } catch (e) {
        this.$toast.error('Oops.. Something Went Wrong..', {
          position: 'bottom-right',
        })
      }
    },
  },
}
</script>
