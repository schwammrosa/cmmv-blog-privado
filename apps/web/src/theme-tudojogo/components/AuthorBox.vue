<template>
    <div v-if="author"
        class="mb-10 p-6 bg-[#0d1117] rounded-lg border border-[#303443] mt-8 text-gray-100 shadow-md">
        <div class="flex items-center mb-4">
            <!-- Author Avatar -->
            <div
                class="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 border-2 border-white shadow">
                                <OptimizedImage v-if="author.image" :src="author.image" :alt="author.name"
                    class="w-full h-full object-cover imgix-lazy" width="44" height="44" icon-size="sm" />
                <div v-else
                    class="w-full h-full flex items-center justify-center bg-[#6600cc] text-white font-bold text-lg">
                    {{ authorInitials }}
                </div>
            </div>

            <!-- Author Info -->
            <div class="flex-1 min-w-0">
                <span class="text-md font-semibold text-white mb-1 break-words">
                    <a :href="`/author/${author.slug}`" class="hover:underline">
                        {{ author.name }}
                    </a>
                </span>
                <p v-if="author.location"
                    class="text-xs text-gray-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="truncate">{{ author.location }}</span>
                </p>
            </div>
        </div>

        <!-- Author Bio -->
        <div v-if="author.bio" class="text-sm leading-relaxed text-gray-300 mb-4">
            {{ author.bio }}
        </div>

        <!-- Social Links -->
        <div class="flex flex-wrap gap-3">
            <a v-if="author.website" :href="author.website" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1.5 bg-[#0d1117] hover:bg-[#6600cc]/30 border border-[#303443] rounded-full text-sm text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
            </a>
            <a v-if="author.twitter" :href="`https://twitter.com/${author.twitter}`" target="_blank"
                rel="noopener noreferrer"
                class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            </a>
            <a v-if="author.facebook" :href="`https://facebook.com/${author.facebook}`" target="_blank"
                rel="noopener noreferrer"
                class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            </a>
            <a v-if="author.instagram" :href="`https://instagram.com/${author.instagram}`" target="_blank"
                rel="noopener noreferrer"
                class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            </a>
            <a v-if="author.linkedin" :href="`https://linkedin.com/in/${author.linkedin}`" target="_blank"
                rel="noopener noreferrer"
                class="gamer-button w-8 h-8 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                    LinkedIn
            </a>
            <a v-if="author.github" :href="`https://github.com/${author.github}`" target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1.5 bg-[#0d1117] hover:bg-[#6600cc]/30 border border-[#303443] rounded-full text-sm text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1.5" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Github
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import OptimizedImage from '../../components/OptimizedImage.vue';

const props = defineProps({
  author: {
    type: Object as () => any,
    required: true,
  },
});

const { author } = toRefs(props);

const authorInitials = computed(() => {
    return author.value?.name
        ? author.value.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
        : '?'
});
</script> 