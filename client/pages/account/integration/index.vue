<template>
  <div
    class="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8 overflow-auto shadow-md md:px-8 bg-gray-50 dark:bg-gray-200"
  >
    <div class="my-0 sm:my-5">
      <div
        class="mt-5 md:mt-0 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200 dark:border-transparent"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <div>
              <h3 class="text-xl font-bold leading-8 text-gray-900">
                Integrations
              </h3>
              <p class="text-sm leading-5 text-gray-500">
                Manage integration tokens.
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="tokens.length !== 0"
          class="flex mt-6 space-x-3 md:mt-0 md:ml-4"
        >
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-200"
          >
            Revoke All
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click.prevent="toggleGenerateIntegrationTokenModal"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
    <div v-if="tokens.length === 0" class="my-4 sm:my-6 lg:my-8 text-center">
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        No integrations tokens
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by generating a token.
      </p>
      <div class="mt-6">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click.prevent="toggleGenerateIntegrationTokenModal"
        >
          <fa :icon="['fas', 'plus']" class="-ml-1 mr-2 h-5 w-5 text-lg" />
          Generate
        </button>
      </div>
    </div>

    <div v-else class="my-4 sm:my-6 lg:my-8">
      <div
        class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg"
      >
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Display Name
              </th>
              <th
                scope="col"
                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Created
              </th>
              <th
                scope="col"
                class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Expire
              </th>

              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(token, index) in tokens" :key="index">
              <td
                class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6"
              >
                {{ token.label }}
                <dl class="font-normal lg:hidden">
                  <dt class="sr-only">Created</dt>
                  <dd class="mt-1 truncate text-gray-700">
                    <time
                      v-if="!token.isNever"
                      :datetime="$dayjs(token.createdAt).format('lll')"
                      >{{ $dayjs(token.createdAt).format('lll') }}</time
                    >
                    <span v-else>Never</span>
                  </dd>
                  <dt class="sr-only sm:hidden">Expire</dt>
                  <dd class="mt-1 truncate text-gray-500 sm:hidden">
                    <time :datetime="$dayjs(token.expireAt).format('lll')">{{
                      $dayjs(token.expireAt).fromNow()
                    }}</time>
                  </dd>
                </dl>
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                <time :datetime="$dayjs(token.createdAt).format('lll')">{{
                  $dayjs(token.createdAt).format('lll')
                }}</time>
              </td>
              <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                <time
                  v-if="!token.isNever"
                  :datetime="$dayjs(token.expireAt).format('lll')"
                  >{{ $dayjs(token.expireAt).fromNow() }}</time
                >
                <span v-else>Never</span>
              </td>
              <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  type="button"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark-hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <fa
                    :icon="['fas', 'gear']"
                    class="text-lg text-white m-auto"
                  />
                </button>
                <button
                  type="button"
                  class="mt-2 md:mt-0 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark-hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  @click.prevent="revokeToken(index)"
                >
                  <fa
                    :icon="['fas', 'trash']"
                    class="text-lg text-white m-auto"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <portal to="account">
      <transition name="fade">
        <AccountModalGenerateIntegrationToken
          v-if="$store.state.account.showGenerateIntegrationTokenModal"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
export default {
  layout: 'account',

  middleware: ['auth'],

  data() {
    return {}
  },
  async fetch({ store }) {
    try {
      await store.dispatch('account/FETCH_TOKENS')
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
  computed: {
    tokens() {
      return this.$store.state.account.tokens
    },
  },

  methods: {
    async toggleGenerateIntegrationTokenModal() {
      await this.$store.dispatch(
        'account/TOGGLE_SHOW_GENERATE_INTERGRATION_MODAL'
      )
    },
    async revokeToken(index) {
      try {
        await this.$store.dispatch('account/REVOKE_INTERGATION_TOKEN', index)
        if (this.$store.state.account.messages.success) {
          switch (this.$store.state.account.messages.success) {
            case 'REVOKED':
              this.$toast.success('Token has been revoked.', {
                position: 'bottom-right',
              })
              break
            default:
          }
        } else {
          switch (this.$store.state.account.messages.error) {
            case 'NOT_FOUND':
              this.$toast.error(
                'That token might be already revoked.',
                {
                  position: 'bottom-right',
                },
                5000
              )
              break

            default:
              this.$toast.error(
                'Oops.. Something Went Wrong..',
                {
                  position: 'bottom-right',
                },
                5000
              )
              break
          }
        }
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
    async revokeAllTokens() {},
  },
}
</script>

<style lang="postcss" scoped>
.fade-enter-active {
  @apply duration-150 ease-out;
}
.fade-enter {
  @apply opacity-0;
}
.fade-enter-to {
  @apply opacity-100;
}
.fade-leave-active {
  @apply duration-150 ease-in;
}
.fade-leave {
  @apply opacity-100;
}
.fade-leave-to {
  @apply opacity-0;
}
</style>
