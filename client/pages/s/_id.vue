<template>
  <div>
    <SharedNavigation />
    <div class="mx-auto py-6 sm:px-6 lg:px-8 max-w-6xl">
      <img :src="`/u/${params.id}`" class="mx-auto px-6" />
      <div class="overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <nuxt-link
            :to="`/u/${params.id}`"
            class="
              text-lg
              leading-6
              font-medium
              text-gray-900
              dark:text-white
              hover:text-gray-800
              dark:hover:text-gray-300
              hover:underline
            "
          >
            {{ upload.displayName || upload.fileName }}
          </nuxt-link>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-white">
                Uploaded
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {{ $dayjs(upload.createdAt) }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-white">
                File Size
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {{ $filesize(upload.fileSize) }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-white">
                By
              </dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {{ upload.uploader.username }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dd class="mt-1 text-sm text-gray-900">
                <button
                  type="button"
                  class="
                    inline-flex
                    items-center
                    px-4
                    py-2
                    border border-transparent
                    shadow-sm
                    text-sm
                    font-medium
                    rounded-md
                    text-white
                    bg-indigo-600
                    hover:bg-indigo-700
                    focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  "
                >
                  Download
                  <!-- Heroicon name: solid/mail -->
                  <svg
                    class="ml-2 -mr-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    />
                    <path
                      d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                    />
                  </svg>
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
  async asyncData({ params, $axios }) {
    const { upload } = await $axios.$get(`/api/upload/${params.id}`)
    return { params, upload }
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
}
</script>
