<template>
  <div
    role="dialog"
    aria-modal="true"
    class="z-20 fixed inset-x-0 bottom-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
  >
    <div class="fixed inset-0">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
    <div
      class="overflow-hidden transition-all transform bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full"
      @click.stop
    >
      <form @submit.prevent="accountGenerateIntegrationToken">
        <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
          <div class="my-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div>
              <h3
                v-if="!showToken"
                class="text-xl font-medium leading-6 text-primary-500"
              >
                Generate a token for a 3rd party ingeration
              </h3>
              <h3 v-else class="text-xl font-medium leading-6 text-primary-500">
                Token Created
              </h3>
            </div>
            <div v-if="!showToken">
              <div class="my-3">
                <div>
                  <label
                    for="displayName"
                    class="block text-sm font-medium text-gray-700"
                    >Display Name
                  </label>
                  <div class="mt-1">
                    <input
                      v-model="displayName"
                      type="text"
                      name="displayName"
                      id="displayName"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Default"
                    />
                  </div>
                </div>
              </div>
              <div class="my-3">
                <label
                  for="expires"
                  class="block text-sm font-medium text-gray-700"
                  >Expires</label
                >
                <select
                  id="expires"
                  v-model="expires"
                  name="expires"
                  class="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="never">never</option>
                  <option value="month" selected>one month</option>
                  <option value="week">a week</option>
                  <option value="day">a day</option>
                </select>
              </div>
            </div>
            <div v-else>
              <div class="font-medium leading-5 text-gray-700">
                Please copy this key and save it somewhere safe.
              </div>
              <div class="font-medium leading-5 text-red-700">
                For security reasons, we cannot show it to you again
              </div>

              <div
                type="text"
                name="newToken"
                id="newToken"
                class="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-t-md break-words"
              >
                {{ $store.state.account.newToken }}
              </div>
              <button
                @click.prevent="copyNewToken"
                type="button"
                class="w-full items-center px-4 py-2 border border-transparent text-sm font-medium rounded-b-sm shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Copy
              </button>
            </div>
          </div>

          <div
            v-if="!showToken"
            class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="submit"
                class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-primary-600 border rounded-md order-transparent hover:bg-primary-500 focus:outline-none focus:ring"
              >
                Generate
              </button>
            </span>
            <span
              class="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto"
            >
              <button
                type="button"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-primary-300 focus:ring sm:text-sm sm:leading-5"
                @click.prevent="hideGenerateIntegrationTokenModal"
                @keydown.esc="hideGenerateIntegrationTokenModal"
              >
                Cancel
              </button>
            </span>
          </div>
          <div
            v-else
            class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <span
              class="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto"
            >
              <button
                type="button"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-primary-300 focus:ring sm:text-sm sm:leading-5"
                @click.prevent="hideGenerateIntegrationTokenModal"
                @keydown.esc="hideGenerateIntegrationTokenModal"
              >
                Close
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.popupItem = this.$refs.background

    const close = (e) => {
      const ESC = 27
      if (e.keyCode !== ESC) return
      this.hideRevokeAllSessionsModal()
    }
    this.scrollPosition = window.pageYOffset

    /**
     * Disable scrolling
     */
    const $body = document.querySelector('body')
    $body.style.overflow = 'hidden'
    $body.style.position = 'fixed'
    $body.style.top = `-${this.scrollPosition}px`
    $body.style.width = '100%'

    document.addEventListener('keyup', close)
    this.$on('hook:destroyed', () => {
      document.removeEventListener('keyup', close)

      /**
       * Enable  scrolling
       */
      const $body = document.querySelector('body')
      $body.style.removeProperty('overflow')
      $body.style.removeProperty('position')
      $body.style.removeProperty('top')
      $body.style.removeProperty('width')

      window.scrollTo(0, this.scrollPosition)
    })
  },
  computed: {
    showToken() {
      return this.$store.state.account.showToken
    },
  },
  data() {
    return {
      displayName: 'Default Token Label',
      expires: 'month',
    }
  },
  methods: {
    async toggleGenerateIntegrationTokenModal() {
      await this.$store.dispatch(
        'account/TOGGLE_SHOW_GENERATE_INTERGRATION_MODAL'
      )
    },
    async hideGenerateIntegrationTokenModal() {
      await this.$store.commit(
        'account/SET_SHOW_GENERATE_INTERGRATION_MODAL',
        false
      )
      await this.$store.commit('account/SET_MESSAGE_SUCCESS', null)
      await this.$store.commit('account/SET_MESSAGE_ERROR', null)
      await this.$store.commit('account/SET_SHOW_TOKEN', false)
    },
    async accountGenerateIntegrationToken() {
      try {
        await this.$store.dispatch('account/GENERATE_INTERGATION_TOKEN', {
          label: this.displayName,
          expires: this.expires,
        })
        if (this.$store.state.account.messages.error) {
          return this.$toast.error(
            this.$store.state.account.messages.error,
            {
              position: 'bottom-right',
            },
            5000
          )
        }
        await this.$store.commit('account/SET_SHOW_TOKEN', true)
        await this.$store.dispatch('account/FETCH_TOKENS')
      } catch (e) {
        this.hideGenerateIntegrationTokenModal()
        this.$toast.error(
          'Oops.. Something Went Wrong..',
          {
            position: 'bottom-right',
          },
          5000
        )
      }
    },
    async copyNewToken() {
      try {
        await this.$copyText(this.$store.state.account.newToken)
        await this.$toast.success(
          'Integration Token Copied to Clipboard',
          {
            position: 'bottom-right',
          },
          5000
        )
      } catch (e) {
        this.$toast.error(
          'Oops.. Something Went Wrong..',
          {
            position: 'bottom-right',
          },
          5000
        )
      }
    },
  },
}
</script>
