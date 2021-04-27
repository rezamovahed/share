<template>
  <main class="relative z-0 flex-1 pb-8 overflow-y-auto">
    <!-- Page header -->
    <div class="bg-white shadow dark:bg-gray-600">
      <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div
          class="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200 dark:border-transparent"
        >
          <div class="flex-1 min-w-0">
            <!-- Profile -->
            <div class="flex items-center">
              <div>
                <div class="flex items-center">
                  <h1
                    class="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate dark:text-white"
                  >
                    Good morning,
                    <span class="text-primary-500 dark:text-primary-300">{{
                      $auth.user.username
                    }}</span>
                  </h1>
                </div>
                <dl
                  class="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap"
                >
                  <dt class="sr-only">Role</dt>
                  <dd
                    class="flex items-center text-sm font-medium text-gray-500 capitalize dark:text-white sm:mr-6"
                  >
                    <svg
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-100"
                      x-description="Heroicon name: solid/office-building"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {{ $auth.user.role }}
                  </dd>
                  <dt v-if="$auth.user.isVerified" class="sr-only">
                    Verified Account
                  </dt>
                  <dd
                    v-if="$auth.user.isVerified"
                    class="flex items-center mt-3 text-sm font-medium text-gray-500 capitalize sm:mr-6 sm:mt-0"
                  >
                    <svg
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                      x-description="Heroicon name: solid/check-circle"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Verified account
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="flex mt-6 space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:bg-grat-200"
            >
              Quick Upload
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:border-white"
            >
              Quick Link
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <h2 class="text-lg font-medium leading-6 text-gray-900">Overview</h2>
        <div
          class="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3"
          x-max="1"
        >
          <!-- Card -->

          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-gray-400"
                    x-description="Heroicon name: outline/scale"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Account balance
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        $30,659.45
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="px-5 py-3 bg-gray-50">
              <div class="text-sm">
                <a
                  href="#"
                  class="font-medium text-cyan-700 hover:text-cyan-900"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-gray-400"
                    x-description="Heroicon name: outline/refresh"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Pending
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        -$19,500.00
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="px-5 py-3 bg-gray-50">
              <div class="text-sm">
                <a
                  href="#"
                  class="font-medium text-cyan-700 hover:text-cyan-900"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div class="overflow-hidden bg-white rounded-lg shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg
                    class="w-6 h-6 text-gray-400"
                    x-description="Heroicon name: outline/check-circle"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div class="flex-1 w-0 ml-5">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Processed (last 30 days)
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900">
                        $20,000
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="px-5 py-3 bg-gray-50">
              <div class="text-sm">
                <a
                  href="#"
                  class="font-medium text-cyan-700 hover:text-cyan-900"
                >
                  View all
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2
        class="max-w-6xl px-4 mx-auto mt-8 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8"
      >
        Recent activity
      </h2>

      <!-- Activity list (smallest breakopoint only) -->
      <div class="shadow sm:hidden">
        <ul
          class="mt-2 overflow-hidden divide-y divide-gray-200 shadow sm:hidden"
          x-max="1"
        >
          <li>
            <a href="#" class="block px-4 py-4 bg-white hover:bg-gray-50">
              <span class="flex items-center space-x-4">
                <span class="flex flex-1 space-x-2 truncate">
                  <svg
                    class="flex-shrink-0 w-5 h-5 text-gray-400"
                    x-description="Heroicon name: solid/cash"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="flex flex-col text-sm text-gray-500 truncate">
                    <span class="truncate">Payment to Molly Sanders</span>
                    <span
                      ><span class="font-medium text-gray-900">$20,000</span>
                      USD</span
                    >
                    <span>July 11, 2020</span>
                  </span>
                </span>
                <svg
                  class="flex-shrink-0 w-5 h-5 text-gray-400"
                  x-description="Heroicon name: solid/chevron-right"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </a>
          </li>
        </ul>

        <nav
          class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200"
          aria-label="Pagination"
        >
          <div class="flex justify-between flex-1">
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:text-gray-500"
            >
              Previous
            </a>
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:text-gray-500"
            >
              Next
            </a>
          </div>
        </nav>
      </div>

      <!-- Activity table (small breakopoint and up) -->
      <div class="hidden sm:block">
        <div class="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div class="flex flex-col mt-2">
            <div
              class="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50"
                    >
                      Transaction
                    </th>
                    <th
                      class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50"
                    >
                      Amount
                    </th>
                    <th
                      class="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 md:block"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200" x-max="1">
                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Molly Sanders
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$20,000 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      July 11, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Doug Mann
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$19,500 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize"
                      >
                        processing
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      July 5, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Erica Frost
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$8,750 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      July 4, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Miley Davis
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$300 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      July 1, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Molly Sanders
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$20,000 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize"
                      >
                        failed
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      June 17, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Doug Mann
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$19,500 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize"
                      >
                        processing
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      June 14, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Erica Frost
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$8,750 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      June 3, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Miley Davis
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$300 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      May 8, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Molly Sanders
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$20,000 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      May 5, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Doug Mann
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$19,500 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize"
                      >
                        processing
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      May 1, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Erica Frost
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$8,750 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize"
                      >
                        failed
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      April 14, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Miley Davis
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$300 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      April 11, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Molly Sanders
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$20,000 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      April 3, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Doug Mann
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$19,500 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize"
                      >
                        processing
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      April 2, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Erica Frost
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$8,750 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      March 29, 2020
                    </td>
                  </tr>

                  <tr class="bg-white">
                    <td
                      class="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap"
                    >
                      <div class="flex">
                        <a
                          href="#"
                          class="inline-flex space-x-2 text-sm truncate group"
                        >
                          <svg
                            class="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            x-description="Heroicon name: solid/cash"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          <p
                            class="text-gray-500 truncate group-hover:text-gray-900"
                          >
                            Payment to Miley Davis
                          </p>
                        </a>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <span class="font-medium text-gray-900">$300 </span>
                      USD
                    </td>
                    <td
                      class="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block"
                    >
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                      >
                        success
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      March 15, 2020
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Pagination -->
              <nav
                class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                aria-label="Pagination"
              >
                <div class="hidden sm:block">
                  <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">1</span>
                    to
                    <span class="font-medium">10</span>
                    of
                    <span class="font-medium">20</span>
                    results
                  </p>
                </div>
                <div class="flex justify-between flex-1 sm:justify-end">
                  <a
                    href="#"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
              </nav>
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
}
</script>
