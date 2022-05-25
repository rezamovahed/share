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
      <form @submit.prevent="editUpload">
        <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
          <div class="my-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div>
              <h3 class="text-xl font-medium leading-6 text-primary-500">
                Editing <i>{{ upload.displayName }}</i> token
              </h3>
            </div>
            <div>
              <div class="my-3">
                <div>
                  <label
                    for="displayName"
                    class="block text-sm font-medium text-gray-700"
                    >Display Name
                  </label>
                  <div class="mt-1">
                    <input
                      id="displayName"
                      v-model="displayName"
                      type="text"
                      name="displayName"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Default"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="submit"
                class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-primary-600 border rounded-md order-transparent hover:bg-primary-500 focus:outline-none focus:ring"
              >
                Save Changes
              </button>
            </span>
            <span
              class="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto"
            >
              <button
                type="button"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-primary-300 focus:ring sm:text-sm sm:leading-5"
                @click.prevent="hideEditUploadModal"
                @keydown.esc="hideEditUploadModal"
              >
                Cancel
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
  data() {
    return {
      displayName: '',
    }
  },
  computed: {
    upload() {
      return this.$store.state.upload.editUploadModalData
    },
  },
  mounted() {
    this.popupItem = this.$refs.background

    const close = (e) => {
      const ESC = 27
      if (e.keyCode !== ESC) return
      this.hideEditUploadModal()
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

    /**
     * Set DisplayName to store
     */
    this.displayName = this.upload.displayName
  },
  methods: {
    async hideEditUploadModal() {
      await this.$store.dispatch('upload/GET_DATA')
      await this.$store.commit(
        'account/SET_SHOW_EDIT_INTERGRATION_TOKEN_MODAL',
        false
      )
      await this.$store.commit('upload/SET_SHOW_EDIT_UPLOAD_MODAL', false)
      await this.$store.commit('upload/SET_MESSAGE_SUCCESS', null)
      await this.$store.commit('upload/SET_MESSAGE_ERROR', null)
    },
  },
}
</script>
