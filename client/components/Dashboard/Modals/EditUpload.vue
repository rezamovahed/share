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
      <form>
        <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
          <div class="my-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div>
              <h3 class="text-xl font-medium leading-6 text-primary-500">
                Editing <i>{{ displayName }}</i> upload
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
              <div class="my-3">
                <div>
                  <label
                    for="newTag"
                    class="block text-sm font-medium text-gray-700"
                    >New Tag
                  </label>
                  <div class="mt-1">
                    <input
                      id="newTag"
                      v-model="newTag"
                      type="text"
                      name="newTag"
                      :disabled="tags.length > 5"
                      class="disabled:border-red-500 disabled:border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      @keydown.enter="addTag"
                      @keydownn.space="addTag"
                    />
                    <p v-if="tags.length > 5" class="mt-2 text-sm text-red-600">
                      You can only have up to 5 tag per upload'
                    </p>
                  </div>
                  <DashboardUploadsTagBadgeWithButton
                    class="inline-flex mt-2"
                    v-for="(tag, index) in tags"
                    :key="index"
                    :display-name="tag"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
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
      newTag: '',
    }
  },
  computed: {
    _id() {
      return this.$store.state.upload.editUploadModalData._id
    },
    displayName() {
      return this.$store.state.upload.editUploadModalData.displayName
    },
    tags() {
      return this.$store.state.upload.editUploadModalData.tags
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
  },
  methods: {
    async hideEditUploadModal() {
      await this.$store.commit('upload/SET_SHOW_EDIT_UPLOAD_MODAL', false)

      await this.$store.commit('upload/SET_MESSAGE_SUCCESS', null)
      await this.$store.commit('upload/SET_MESSAGE_ERROR', null)

      await this.$store.commit('upload/SET_EDIT_UPLOAD_MODAL_DATA', {
        _id: '',
        displayName: '',
        tags: [],
      })
    },
    async addTag() {
      if (this.newTag.length === 0) return

      if (this.tags.length > 5) {
        this.$toast.error('You can only have up to 5 tags per upload', {
          position: 'bottom-right',
          duration: 5000,
        })

        this.newTag = ''

        return await this.$store.commit('upload/SET_MESSAGE_SUCCESS', null)
      }
      this.$store.commit('upload/ADD_TAG', this.newTag)
    },
    async editUpload() {
      await this.$store.dispatch('upload/EDIT_UPLOAD', {
        id: this._id,
        displayName: this.displayName,
        tags: this.tags,
      })
    },
  },
}
</script>
