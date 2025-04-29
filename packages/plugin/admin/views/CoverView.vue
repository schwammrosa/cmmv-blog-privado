<template>
    <div class="space-y-6">
        <!-- Header with save button -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Cover Manager</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="saveCoverSettings"
                    class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors flex items-center"
                    :disabled="saving">
                    <svg v-if="saving" class="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
                <button @click="resetCoverSettings"
                    class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                </button>
            </div>
        </div>

        <!-- Main content area with layout selection and preview -->
        <div class="bg-neutral-800 rounded-lg p-6">
            <div class="mb-6">
                <label for="layout-type" class="block text-white font-medium mb-2">Cover Layout</label>
                <select id="layout-type" v-model="coverSettings.layoutType"
                    class="bg-neutral-700 border border-neutral-600 text-white rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="full">Full Width Cover (1 post)</option>
                    <option value="carousel">Carousel (3 posts)</option>
                    <option value="split">Split (1 large + 2 small)</option>
                    <option value="dual">Dual Columns (2 equal posts)</option>
                </select>
            </div>

            <div v-if="loading" class="py-20 flex justify-center items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span class="ml-3 text-neutral-400">Loading posts...</span>
            </div>

            <div v-else>
                <!-- Preview Section -->
                <div class="mb-4">
                    <h2 class="text-lg font-medium text-white mb-4">Preview</h2>
                    <div class="bg-neutral-900 p-4 rounded-lg">
                        <!-- Full width layout -->
                        <div v-if="coverSettings.layoutType === 'full'" class="relative overflow-hidden rounded-lg h-[400px]">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                            <img v-if="getPostById(coverSettings.fullCover?.postId)?.featureImage"
                                :src="getPostById(coverSettings.fullCover?.postId)?.featureImage"
                                class="absolute inset-0 w-full h-full object-cover" alt="Cover image">
                            <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                <p class="text-neutral-500">No image selected</p>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 z-20">
                                <div v-if="getPostById(coverSettings.fullCover?.postId)" class="max-w-3xl">
                                    <div class="text-blue-400 text-sm font-semibold mb-2">{{ getCategoryName(getPostById(coverSettings.fullCover?.postId)) }}</div>
                                    <h2 class="text-white text-2xl md:text-3xl font-bold mb-2">{{ getPostById(coverSettings.fullCover?.postId).title }}</h2>
                                    <p class="text-neutral-300 text-sm md:text-base">{{ getPostExcerpt(getPostById(coverSettings.fullCover?.postId)) }}</p>
                                </div>
                                <div v-else class="text-neutral-400">Select a post to display</div>
                            </div>
                            <!-- Edit button -->
                            <button @click="openPostSelector('fullCover')"
                                class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>

                        <!-- Carousel layout -->
                        <div v-else-if="coverSettings.layoutType === 'carousel'" class="space-y-2">
                            <div class="relative overflow-hidden rounded-lg h-[400px]">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                <img v-if="getPostById(coverSettings.carousel?.[carouselIndex]?.postId)?.featureImage"
                                    :src="getPostById(coverSettings.carousel?.[carouselIndex]?.postId)?.featureImage"
                                    class="absolute inset-0 w-full h-full object-cover" alt="Carousel image">
                                <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                    <p class="text-neutral-500">No image selected</p>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 z-20">
                                    <div v-if="getPostById(coverSettings.carousel?.[carouselIndex]?.postId)" class="max-w-3xl">
                                        <div class="text-blue-400 text-sm font-semibold mb-2">{{ getCategoryName(getPostById(coverSettings.carousel?.[carouselIndex]?.postId)) }}</div>
                                        <h2 class="text-white text-2xl md:text-3xl font-bold mb-2">{{ getPostById(coverSettings.carousel?.[carouselIndex]?.postId).title }}</h2>
                                        <p class="text-neutral-300 text-sm md:text-base">{{ getPostExcerpt(getPostById(coverSettings.carousel?.[carouselIndex]?.postId)) }}</p>
                                    </div>
                                    <div v-else class="text-neutral-400">Select posts for the carousel</div>
                                </div>

                                <!-- Edit button -->
                                <button @click="openPostSelector('carousel.' + carouselIndex)"
                                    class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>

                                <!-- Carousel indicators -->
                                <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
                                    <button v-for="(_, index) in 3" :key="index"
                                        @click="carouselIndex = index"
                                        class="w-3 h-3 rounded-full"
                                        :class="carouselIndex === index ? 'bg-blue-500' : 'bg-neutral-500'"></button>
                                </div>

                                <!-- Carousel arrows -->
                                <button @click="prevSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Split layout (1 large + 2 small) -->
                        <div v-else-if="coverSettings.layoutType === 'split'" class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                            <!-- Large post (left) -->
                            <div class="relative overflow-hidden rounded-lg h-full">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                <img v-if="getPostById(coverSettings.split?.main?.postId)?.featureImage"
                                    :src="getPostById(coverSettings.split?.main?.postId)?.featureImage"
                                    class="absolute inset-0 w-full h-full object-cover" alt="Main image">
                                <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                    <p class="text-neutral-500">No image selected</p>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <div v-if="getPostById(coverSettings.split?.main?.postId)" class="max-w-3xl">
                                        <div class="text-blue-400 text-sm font-semibold mb-1">{{ getCategoryName(getPostById(coverSettings.split?.main?.postId)) }}</div>
                                        <h2 class="text-white text-lg md:text-xl font-bold mb-1">{{ getPostById(coverSettings.split?.main?.postId).title }}</h2>
                                        <p class="text-neutral-300 text-xs md:text-sm line-clamp-2">{{ getPostExcerpt(getPostById(coverSettings.split?.main?.postId)) }}</p>
                                    </div>
                                    <div v-else class="text-neutral-400 text-sm">Select a post</div>
                                </div>
                                <!-- Edit button -->
                                <button @click="openPostSelector('split.main')"
                                    class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Two small posts (right column) -->
                            <div class="grid grid-rows-2 gap-4 h-full">
                                <!-- Top right post -->
                                <div class="relative overflow-hidden rounded-lg h-[190px]">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                    <img v-if="getPostById(coverSettings.split?.secondary?.[0]?.postId)?.featureImage"
                                        :src="getPostById(coverSettings.split?.secondary?.[0]?.postId)?.featureImage"
                                        class="absolute inset-0 w-full h-full object-cover" alt="Secondary image 1">
                                    <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                        <p class="text-neutral-500">No image selected</p>
                                    </div>
                                    <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                                        <div v-if="getPostById(coverSettings.split?.secondary?.[0]?.postId)" class="max-w-3xl">
                                            <div class="text-blue-400 text-xs font-semibold mb-1">{{ getCategoryName(getPostById(coverSettings.split?.secondary?.[0]?.postId)) }}</div>
                                            <h2 class="text-white text-base font-bold mb-1 line-clamp-1">{{ getPostById(coverSettings.split?.secondary?.[0]?.postId).title }}</h2>
                                        </div>
                                        <div v-else class="text-neutral-400 text-sm">Select a post</div>
                                    </div>
                                    <!-- Edit button -->
                                    <button @click="openPostSelector('split.secondary.0')"
                                        class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Bottom right post -->
                                <div class="relative overflow-hidden rounded-lg h-[190px]">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                    <img v-if="getPostById(coverSettings.split?.secondary?.[1]?.postId)?.featureImage"
                                        :src="getPostById(coverSettings.split?.secondary?.[1]?.postId)?.featureImage"
                                        class="absolute inset-0 w-full h-full object-cover" alt="Secondary image 2">
                                    <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                        <p class="text-neutral-500">No image selected</p>
                                    </div>
                                    <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                                        <div v-if="getPostById(coverSettings.split?.secondary?.[1]?.postId)" class="max-w-3xl">
                                            <div class="text-blue-400 text-xs font-semibold mb-1">{{ getCategoryName(getPostById(coverSettings.split?.secondary?.[1]?.postId)) }}</div>
                                            <h2 class="text-white text-base font-bold mb-1 line-clamp-1">{{ getPostById(coverSettings.split?.secondary?.[1]?.postId).title }}</h2>
                                        </div>
                                        <div v-else class="text-neutral-400 text-sm">Select a post</div>
                                    </div>
                                    <!-- Edit button -->
                                    <button @click="openPostSelector('split.secondary.1')"
                                        class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Dual column layout (2 equal posts) -->
                        <div v-else-if="coverSettings.layoutType === 'dual'" class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                            <!-- Left post -->
                            <div class="relative overflow-hidden rounded-lg h-full">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                <img v-if="getPostById(coverSettings.dual?.[0]?.postId)?.featureImage"
                                    :src="getPostById(coverSettings.dual?.[0]?.postId)?.featureImage"
                                    class="absolute inset-0 w-full h-full object-cover" alt="Left column image">
                                <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                    <p class="text-neutral-500">No image selected</p>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <div v-if="getPostById(coverSettings.dual?.[0]?.postId)" class="max-w-3xl">
                                        <div class="text-blue-400 text-xs font-semibold mb-1">{{ getCategoryName(getPostById(coverSettings.dual?.[0]?.postId)) }}</div>
                                        <h2 class="text-white text-lg font-bold mb-1">{{ getPostById(coverSettings.dual?.[0]?.postId).title }}</h2>
                                        <p class="text-neutral-300 text-xs line-clamp-2">{{ getPostExcerpt(getPostById(coverSettings.dual?.[0]?.postId)) }}</p>
                                    </div>
                                    <div v-else class="text-neutral-400 text-sm">Select a post</div>
                                </div>
                                <!-- Edit button -->
                                <button @click="openPostSelector('dual.0')"
                                    class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Right post -->
                            <div class="relative overflow-hidden rounded-lg h-full">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                <img v-if="getPostById(coverSettings.dual?.[1]?.postId)?.featureImage"
                                    :src="getPostById(coverSettings.dual?.[1]?.postId)?.featureImage"
                                    class="absolute inset-0 w-full h-full object-cover" alt="Right column image">
                                <div v-else class="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                    <p class="text-neutral-500">No image selected</p>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-4 z-20">
                                    <div v-if="getPostById(coverSettings.dual?.[1]?.postId)" class="max-w-3xl">
                                        <div class="text-blue-400 text-xs font-semibold mb-1">{{ getCategoryName(getPostById(coverSettings.dual?.[1]?.postId)) }}</div>
                                        <h2 class="text-white text-lg font-bold mb-1">{{ getPostById(coverSettings.dual?.[1]?.postId).title }}</h2>
                                        <p class="text-neutral-300 text-xs line-clamp-2">{{ getPostExcerpt(getPostById(coverSettings.dual?.[1]?.postId)) }}</p>
                                    </div>
                                    <div v-else class="text-neutral-400 text-sm">Select a post</div>
                                </div>
                                <!-- Edit button -->
                                <button @click="openPostSelector('dual.1')"
                                    class="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg z-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Usage tip message -->
                <div class="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                    <div class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-blue-300 text-sm">Click the edit button on any cover section to select a post. Your changes will be saved when you click the "Save Changes" button.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Post selector modal -->
    <div v-if="showPostSelector" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div class="bg-neutral-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal header -->
            <div class="bg-neutral-700 px-6 py-4 flex justify-between items-center">
                <h3 class="text-white text-lg font-medium">Select a Post</h3>
                <button @click="showPostSelector = false" class="text-neutral-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Search input -->
            <div class="px-6 py-4 border-b border-neutral-700">
                <div class="relative">
                    <input
                        type="text"
                        v-model="postSearchTerm"
                        placeholder="Search for posts..."
                        class="bg-neutral-700 border border-neutral-600 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 pl-10"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <!-- Posts list -->
            <div class="overflow-y-auto flex-1">
                <div v-if="filteredPosts.length === 0" class="p-6 text-center text-neutral-400">
                    No posts found matching your search
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                    <div
                        v-for="post in paginatedPosts"
                        :key="post.id"
                        @click="selectPostFromModal(post.id)"
                        class="bg-neutral-700 rounded-lg overflow-hidden cursor-pointer hover:bg-neutral-650 transition-colors duration-200"
                    >
                        <div class="aspect-[16/9] bg-neutral-900 relative">
                            <img
                                v-if="post.featureImage"
                                :src="post.featureImage"
                                :alt="post.title"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center text-neutral-500">
                                No image
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="text-blue-400 text-xs font-semibold mb-1">{{ getCategoryName(post) }}</div>
                            <h4 class="text-white font-medium line-clamp-2 mb-1">{{ post.title }}</h4>
                            <p class="text-neutral-400 text-xs line-clamp-2">{{ getPostExcerpt(post) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="bg-neutral-700 px-6 py-3 flex justify-between items-center">
                <button
                    @click="currentPage > 1 ? currentPage-- : null"
                    :disabled="currentPage <= 1"
                    class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span class="text-neutral-300">Page {{ currentPage }} of {{ totalPages }}</span>
                <button
                    @click="currentPage < totalPages ? currentPage++ : null"
                    :disabled="currentPage >= totalPages"
                    class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    </div>

    <!-- Toast notification -->
    <div v-if="notification.show"
        class="fixed bottom-4 right-4 flex items-center p-4 rounded-md shadow-lg text-white z-50"
        :class="notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ notification.message }}</span>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAdminClient } from '@cmmv/blog/admin/client';

const adminClient = useAdminClient();

const coverSettings = ref({
    layoutType: 'full',

    fullCover: {
        postId: ''
    },

    carousel: [
        { postId: '' },
        { postId: '' },
        { postId: '' }
    ],

    split: {
        main: { postId: '' },
        secondary: [
            { postId: '' },
            { postId: '' }
        ]
    },

    dual: [
        { postId: '' },
        { postId: '' }
    ]
});

const loading = ref(true);
const saving = ref(false);
const posts = ref([]);
const carouselIndex = ref(0);
const notification = ref({
    show: false,
    type: 'success',
    message: ''
});

const showPostSelector = ref(false);
const currentTarget = ref(null);
const postSearchTerm = ref('');
const currentPage = ref(1);
const postsPerPage = 10;

const publishedPosts = computed(() => {
    return posts.value.filter(post => post.status === 'published');
});

const filteredPosts = computed(() => {
    if (!postSearchTerm.value) return publishedPosts.value;

    return publishedPosts.value.filter(post =>
        post.title.toLowerCase().includes(postSearchTerm.value.toLowerCase())
    );
});

const totalPages = computed(() => {
    return Math.ceil(filteredPosts.value.length / postsPerPage);
});

const paginatedPosts = computed(() => {
    const startIndex = (currentPage.value - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.value.slice(startIndex, endIndex);
});

function openPostSelector(target) {
    currentTarget.value = target;
    postSearchTerm.value = '';
    currentPage.value = 1;
    showPostSelector.value = true;
}

function selectPostFromModal(postId) {
    if (!currentTarget.value) return;

    const parts = currentTarget.value.split('.');

    if (parts.length === 1)
        coverSettings.value[parts[0]].postId = postId;
    else if (parts.length === 2)
        coverSettings.value[parts[0]][parts[1]].postId = postId;
    else if (parts.length === 3)
        coverSettings.value[parts[0]][parts[1]][parts[2]].postId = postId;

    showPostSelector.value = false;
    showNotification('success', 'Post selected');
}

async function loadPosts() {
    try {
        loading.value = true;

        const response = await adminClient.posts.get({
            limit: 100,
            sortBy: 'publishedAt',
            sort: 'desc',
            status: 'published'
        });

        if (response && response.posts) {
            posts.value = response.posts.map(post => {
                const authorData = response.authors?.find(author =>
                    author.user === post.author ||
                    (post.authors && post.authors.includes(author.user))
                );

                return {
                    ...post,
                    author: authorData?.name || 'Unknown',
                    authorImage: authorData?.image || null,
                    categories: Array.isArray(post.categories) ? post.categories : [post.categories],
                    categoryNames: Array.isArray(post.categories)
                        ? response.categories
                            .filter(category => post.categories.includes(category.id))
                            .map(category => category.name)
                        : post.categories?.name ? [post.categories.name] : [],
                    tags: post.tags || []
                }
            });
        }
    } catch (error) {
        console.error('Failed to load posts:', error);
        showNotification('error', 'Failed to load posts');
    } finally {
        loading.value = false;
    }
}

async function loadCoverSettings() {
    try {
        loading.value = true;

        const settings = await adminClient.settings.get();

        if (settings) {
            const savedSettings = JSON.parse(settings['blog.cover']);

            coverSettings.value = {
                ...coverSettings.value,
                ...savedSettings
            };
        }
    } catch (error) {
        console.error('Failed to load cover settings:', error);
        showNotification('error', 'Failed to load cover settings');
    } finally {
        loading.value = false;
    }
}

async function saveCoverSettings() {
    try {
        saving.value = true;
        await adminClient.settings.set('blog.cover', JSON.stringify(coverSettings.value));
        showNotification('success', 'Cover settings saved successfully');
    } catch (error) {
        console.error('Failed to save cover settings:', error);
        showNotification('error', 'Failed to save cover settings');
    } finally {
        saving.value = false;
    }
}

function resetCoverSettings() {
    if (confirm('Are you sure you want to reset all cover settings? This cannot be undone.')) {
        coverSettings.value = {
            layoutType: 'full',
            fullCover: { postId: '' },
            carousel: [{ postId: '' }, { postId: '' }, { postId: '' }],
            split: {
                main: { postId: '' },
                secondary: [{ postId: '' }, { postId: '' }]
            },
            dual: [{ postId: '' }, { postId: '' }]
        };
        showNotification('success', 'Cover settings reset to defaults');
    }
}

function showNotification(type, message) {
    notification.value = {
        show: true,
        type,
        message
    };

    setTimeout(() => {
        notification.value.show = false;
    }, 3000);
}

function nextSlide() {
    carouselIndex.value = (carouselIndex.value + 1) % 3;
}

function prevSlide() {
    carouselIndex.value = (carouselIndex.value - 1 + 3) % 3;
}

function getPostById(id) {
    if (!id) return null;
    return posts.value.find(post => post.id === id) || null;
}

function getPostExcerpt(post) {
    if (!post) return '';
    return post.excerpt || post.content?.substring(0, 150) + '...' || '';
}

function getCategoryName(post) {
    if (!post || !post.categories || post.categories.length === 0) return '';

    const category = post.categories[0];

    if (typeof category === 'string') {
        const categoryObj = posts.value.find(p => p.id === post.id)?.categoryNames?.[0];
        return categoryObj || 'Uncategorized';
    } else if (category && category.name) {
        return category.name;
    }

    return 'Uncategorized';
}

watch(postSearchTerm, () => {
    currentPage.value = 1;
});

onMounted(async () => {
    await Promise.all([loadPosts(), loadCoverSettings()]);
});
</script>

<style>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Additional styling for the cover layouts */
.bg-neutral-750 {
    background-color: rgb(31, 31, 36);
}

.bg-neutral-650 {
    background-color: rgb(45, 45, 50);
}
</style>
