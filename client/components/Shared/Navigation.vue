<template>
  <nav class="bg-white dark:bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Logo
              class="h-8 w-8 text-primary-500 dark:text-white"
              alt="Workflow"
            />
          </div>
        </div>
        <SharedNavigationLoginButton />
        <SharedNavigationProfileDropdown />
      </div>
    </div>
  </nav>
</template>

<script>
import Logo from '@/assets/vectors/logo.svg?inline'
export default {
  components: { Logo },
}
</script>
