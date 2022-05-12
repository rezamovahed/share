<template>
  <main class="relative z-0 flex-1 pb-8 overflow-y-auto">
    <div class="bg-white shadow dark:bg-gray-600">
      <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div
          class="py-6 lg:border-t lg:border-gray-200 dark:border-transparent"
        >
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h2
                class="
                  text-2xl
                  font-bold
                  leading-7
                  text-white
                  sm:text-3xl sm:truncate
                "
              >
                Manage Uploads
              </h2>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-5">
              <button
                type="button"
                class="
                  inline-flex
                  items-center
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  bg-white
                  border border-gray-300
                  rounded-md
                  shadow-sm
                  hover:bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-indigo-500
                  dark:bg-gray-200
                "
              >
                Edit
              </button>
              <button
                type="button"
                class="
                  inline-flex
                  items-center
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  border border-transparent
                  rounded-md
                  shadow-sm
                  bg-primary-600
                  hover:bg-primary-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-indigo-500
                "
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex flex-col mt-2">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div
                class="
                  shadow
                  overflow-hidden
                  border-b border-gray-200
                  sm:rounded-lg
                "
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-medium
                          text-gray-500
                          uppercase
                          tracking-wider
                        "
                      >
                        File Name & Size
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-medium
                          text-gray-500
                          uppercase
                          tracking-wider
                        "
                      >
                        Tags
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-medium
                          text-gray-500
                          uppercase
                          tracking-wider
                        "
                      >
                        Created At
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(upload, index) in uploads" :key="index">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-24 w-24">
                            <img
                              class="h-24 w-24"
                              :src="`/u/${upload.fileName}${upload.fileExtension}`"
                              alt=""
                            />
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                              {{ upload.displayName }}
                            </div>
                            <div class="text-sm text-gray-500">
                              {{ $filesize(upload.fileSize) }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-900">
                          <DashboardUploadsTag
                            v-for="tag in upload.tags"
                            :key="tag"
                            :display-name="tag"
                          />
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <time
                          class="
                            px-6
                            py-4
                            whitespace-nowrap
                            text-sm text-gray-500
                          "
                          :datetime="$dayjs(upload.updatedAt).format('lll')"
                          >{{ $dayjs(upload.createdAt).format('lll') }}</time
                        >
                      </td>

                      <td
                        class="
                          px-6
                          py-4
                          text-right text-sm
                          font-medium
                          flex flex-col
                          space-y-2
                        "
                      >
                        <button
                          type="button"
                          class="
                            inline-flex
                            items-center
                            px-1
                            py-1.5
                            border border-transparent
                            rounded
                            shadow-sm
                            text-white
                            bg-green-600
                            hover:bg-green-700
                            dark:bg-green-500
                            dark-hover:bg-green-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-green-500
                          "
                        >
                          <fa
                            :icon="['fas', 'eye']"
                            class="text-lg text-white m-auto"
                          />
                        </button>
                        <button
                          type="button"
                          class="
                            inline-flex
                            items-center
                            px-2.5
                            py-1.5
                            border border-transparent
                            text-xs
                            font-medium
                            rounded
                            shadow-sm
                            text-white
                            bg-indigo-600
                            hover:bg-indigo-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-indigo-500
                          "
                        >
                          <fa
                            :icon="['fas', 'arrow-up-right-from-square']"
                            class="text-lg text-white m-auto"
                          />
                        </button>
                        <button
                          type="button"
                          class="
                            inline-flex
                            items-center
                            px-2.5
                            py-1.5
                            border border-transparent
                            text-xs
                            font-medium
                            rounded
                            shadow-sm
                            text-white
                            bg-red-600
                            hover:bg-red-700
                            dark:bg-red-500
                            dark-hover:bg-red-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-red-500
                          "
                        >
                          <fa
                            :icon="['fas', 'trash']"
                            class="text-lg text-white m-auto"
                          />
                        </button>
                      </td>
                    </tr>

                    <!-- More people... -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  layout: 'dashboard',

  middleware: ['auth'],

  async fetch() {
    await this.$store.dispatch('upload/GET_DATA')
  },
  computed: {
    uploads() {
      return this.$store.state.upload.data
    },
  },
}
</script>
