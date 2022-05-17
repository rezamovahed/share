<template>
  <div>
    <SharedNavigation />
    <div class="mx-auto py-6 sm:px-6 lg:px-8 max-w-6xl">
      <img :src="`/u/${params.id}`" class="mx-auto px-4 md:px-0" />
      <div class="overflow-hidden sm:rounded-lg">
        <div
          class="px-4 py-5 sm:px-6 text-lg font-bold truncate leading-6 text-gray-900 dark:text-white"
        >
          {{ upload.displayName || upload.fileName }}
        </div>

        <div
          class="border-t border-gray-700 dark:border-gray-200 px-4 py-5 sm:px-6"
        >
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <ShareDetailsPanel title="Uploaded" :description="uploaded" />
            </div>
            <div class="sm:col-span-1">
              <ShareDetailsPanel
                title="Size"
                :description="$filesize(upload.fileSize).toString()"
              />
            </div>
            <div class="sm:col-span-1">
              <ShareDetailsPanel
                title="By"
                :description="upload.uploader.username"
              />
            </div>
            <div class="sm:col-span-1">
              <dd class="mt-4 text-sm text-gray-900">
                <button
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="downloadFile"
                >
                  Download
                  <fa
                    :icon="['fas', 'cloud-download-alt']"
                    class="ml-2 -mr-1 h-5 w-5 text-white"
                  />
                </button>
                <button
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="copyURL"
                >
                  Copy Link
                  <fa
                    :icon="['fas', 'clipboard']"
                    class="ml-2 -mr-1 h-5 w-5 text-white"
                  />
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    <SharedFooter />
  </div>
</template>

<script>
export default {
  async asyncData({ $route, params, $axios }) {
    const { upload } = await $axios.$get(`/api/upload/${params.id}`)
    return { $route, params, upload }
  },
  data() {
    return {
      hover: false,
      tooltipActive: false,
    }
  },

  head({ $config: { title } }) {
    return {
      title: `${this.upload.displayName || this.upload.fileName} | ${title}`,
      meta: [
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.upload.displayName || this.upload.fileName,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: `Powered by ${title}`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `/u/${this.params.id}`,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'image',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${
            this.upload.displayName || this.upload.fileName
          } | ${title}`,
        },
      ],
    }
  },

  computed: {
    uploaded() {
      const { createdAt } = this.upload

      if (this.$dayjs(createdAt).isToday()) {
        return this.$dayjs(createdAt).fromNow()
      }
      return this.$dayjs(createdAt).format('MMMM Do YYYY, h:mm:ss a')
    },
  },

  methods: {
    async copyURL() {
      try {
        await this.$copyText(window.location.origin + this.$route.fullPath)
        this.$toast.success('Share has been copied to your clipboard.', {
          position: 'bottom-right',
        })
      } catch (e) {
        return this.$toast.error(
          'There was a error copying Share to your clipboard.',
          {
            position: 'bottom-right',
          },
          5000
        )
      }
    },
    downloadFile() {
      this.$axios({
        url: `/u/${this.params.id}`,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute(
          'download',
          `${this.upload.fileName}${this.upload.fileExtension}`
        )
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
  },
}
</script>
