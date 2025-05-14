<template>
    <div class="w-full max-w-[1400px] mx-auto px-4">
        <div v-if="error" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Erro ao carregar posts</h2>
            <p class="text-gray-600 mb-4">Não foi possível carregar os posts. Por favor, tente novamente.</p>
            <button @click="loadPosts" class="px-4 py-2 bg-[#ff0030] text-white rounded-md hover:bg-[#cc0028] transition-colors">
                Tentar novamente
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="posts.length === 0" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Nenhum post encontrado</h2>
            <p class="text-gray-600">Volte mais tarde para novos conteúdos!</p>
        </div>

        <div v-else class="w-full">
            <!-- Cover Section -->
            <section v-if="posts.length > 0" class="mb-8 md:block hidden">
                <!-- Full Layout (default) -->
                <div v-if="coverSettings.layoutType === 'full' || !coverSettings.layoutType" class="bg-white rounded-lg overflow-hidden shadow-md">
                    <a v-if="coverPosts.full" :href="`/post/${coverPosts.full.slug}`" class="block">
                        <div class="relative h-[500px] md:h-[400px] sm:h-[300px]">
                            <img
                                v-if="coverPosts.full && coverPosts.full.featureImage"
                                :src="coverPosts.full.featureImage"
                                :alt="coverPosts.full.title"
                                class="w-full h-full object-cover"
                                loading="lazy"
                                width="890"
                                height="606"
                                :title="coverPosts.full.title"
                                aria-label="Cover Image"
                                fetchpriority="high"
                            />
                            <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                                <div v-if="coverPosts.full && coverPosts.full.categories && coverPosts.full.categories.length > 0" class="mb-2">
                                    <span class="bg-[#ff0030] text-white px-3 py-1 rounded-md text-sm font-medium">
                                        {{ coverPosts.full.categories[0].name }}
                                    </span>
                                </div>
                                <h2 v-if="coverPosts.full" class="text-3xl md:text-2xl sm:text-xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{{ coverPosts.full.title }}</h2>
                                <p v-if="coverPosts.full" class="text-base sm:text-sm mb-5 sm:mb-3 max-w-2xl mx-auto text-gray-100 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                    {{ coverPosts.full.excerpt || stripHtml(coverPosts.full.content).substring(0, 150) + '...' }}
                                </p>
                                <span class="inline-block bg-[#ff0030] hover:bg-[#cc0028] text-white px-4 py-2 sm:px-3 sm:py-1.5 rounded text-sm font-medium transition-colors mb-6 sm:mb-3">
                                    Continuar lendo
                                </span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Carousel Layout -->
                <div v-else-if="coverSettings.layoutType === 'carousel'" class="bg-white rounded-lg overflow-hidden shadow-md">
                    <div class="relative h-[500px] md:h-[400px] sm:h-[300px]">
                        <div v-for="(post, index) in coverPosts.carousel" :key="post.id"
                             class="absolute w-full h-full transition-opacity duration-500 ease-in-out"
                             :class="{ 'opacity-100': currentCarouselIndex === index, 'opacity-0': currentCarouselIndex !== index }">
                            <a :href="`/post/${post.slug}`" class="block h-full">
                                <img
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                    width="890"
                                    height="606"
                                    :title="post.title"
                                    aria-label="Cover Image"
                                    fetchpriority="high"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                                    <div v-if="post.categories && post.categories.length > 0" class="mb-2">
                                        <span class="bg-[#ff0030] text-white px-3 py-1 rounded-md text-sm font-medium">
                                            {{ post.categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 class="text-3xl md:text-2xl sm:text-xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{{ post.title }}</h2>
                                    <p class="text-base sm:text-sm mb-5 sm:mb-3 max-w-2xl mx-auto text-gray-100 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                        {{ post.excerpt || stripHtml(post.content).substring(0, 150) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#ff0030] hover:bg-[#cc0028] text-white px-4 py-2 sm:px-3 sm:py-1.5 rounded text-sm font-medium transition-colors mb-6 sm:mb-3">
                                        Continuar lendo
                                    </span>
                                </div>
                            </a>
                        </div>

                        <!-- Carousel Controls -->
                        <div class="absolute top-0 bottom-0 left-0 flex items-center">
                            <button @click="prevCarouselSlide" class="bg-black/50 hover:bg-[#ff0030]/80 text-white w-10 h-10 rounded-full flex justify-center items-center transition-all p-2 focus:outline-none z-10 mx-5">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                        <div class="absolute top-0 bottom-0 right-0 flex items-center">
                            <button @click="nextCarouselSlide" class="bg-black/50 hover:bg-[#ff0030]/80 text-white w-10 h-10 rounded-full flex justify-center items-center transition-all p-2 focus:outline-none z-10 mx-5">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Carousel Indicators -->
                        <div class="absolute bottom-5 left-0 right-0 flex justify-center space-x-3 z-10">
                            <button
                                v-for="(_, index) in coverPosts.carousel"
                                :key="index"
                                @click="currentCarouselIndex = index"
                                class="w-3.5 h-3.5 rounded-full bg-white/50 border-2 border-transparent hover:scale-110 cursor-pointer transition-all"
                                :class="{ 'bg-[#ff0030] border-white scale-110': currentCarouselIndex === index }"
                            ></button>
                        </div>
                    </div>
                </div>

                <!-- Split Layout (1 large, 2 small) -->
                <div v-else-if="coverSettings.layoutType === 'split'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2 bg-white rounded-lg overflow-hidden shadow-md">
                        <a v-if="coverPosts.splitMain" :href="`/post/${coverPosts.splitMain.slug}`" class="block h-full">
                            <div class="relative h-full">
                                <img
                                    v-if="coverPosts.splitMain && coverPosts.splitMain.featureImage"
                                    :src="coverPosts.splitMain.featureImage"
                                    :alt="coverPosts.splitMain.title"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                    width="890"
                                    height="606"
                                    :title="coverPosts.splitMain.title"
                                    aria-label="Cover Image"
                                    fetchpriority="high"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    <div v-if="coverPosts.splitMain && coverPosts.splitMain.categories && coverPosts.splitMain.categories.length > 0" class="mb-2">
                                        <span class="bg-[#ff0030] text-white px-3 py-1 rounded-md text-sm font-medium">
                                            {{ coverPosts.splitMain.categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 v-if="coverPosts.splitMain" class="text-xl md:text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{{ coverPosts.splitMain.title }}</h2>
                                    <p v-if="coverPosts.splitMain" class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                        {{ coverPosts.splitMain.excerpt || stripHtml(coverPosts.splitMain.content).substring(0, 150) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#ff0030] hover:bg-[#cc0028] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                        Continuar lendo
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="md:col-span-1 flex flex-col gap-4">
                        <div v-for="(post, index) in coverPosts.splitSide" :key="post.id" class="flex-1 bg-white rounded-lg overflow-hidden shadow-md">
                            <a :href="`/post/${post.slug}`" class="block h-full">
                                <div class="relative h-full">
                                    <img
                                        v-if="post.featureImage"
                                        :src="post.featureImage"
                                        :alt="post.title"
                                        class="w-full h-full object-cover"
                                    />
                                    <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                        <div v-if="post.categories && post.categories.length > 0" class="mb-2">
                                            <span class="bg-[#ff0030] text-white px-2 py-1 rounded-md text-xs font-medium">
                                                {{ post.categories[0].name }}
                                            </span>
                                        </div>
                                        <h3 class="text-base font-bold mb-2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{{ post.title }}</h3>
                                        <span class="text-sm text-white hover:text-[#ff0030] transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 px-2 py-1 rounded inline-block">
                                            Continuar lendo &rarr;
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Dual Layout (2 equal columns) -->
                <div v-else-if="coverSettings.layoutType === 'dual'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="post in coverPosts.dual" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-md">
                        <a :href="`/post/${post.slug}`" class="block">
                            <div class="relative h-[350px]">
                                <img
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                    width="890"
                                    height="606"
                                    :title="post.title"
                                    aria-label="Cover Image"
                                    fetchpriority="high"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    <div v-if="post.categories && post.categories.length > 0" class="mb-2">
                                        <span class="bg-[#ff0030] text-white px-3 py-1 rounded-md text-sm font-medium">
                                            {{ post.categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 class="text-xl md:text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{{ post.title }}</h2>
                                    <p class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                        {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#ff0030] hover:bg-[#cc0028] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                                        Continuar lendo
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <!-- Latest News Section - Full Width -->
            <section class="mb-10 w-full">
                <h2 class="text-left text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                    Últimas Notícias
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <article
                        v-for="post in posts.slice(featuredPost ? 1 : 0, featuredPost ? 4 : 3)"
                        :key="post.id"
                        class="bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-300 flex flex-col h-full"
                    >
                        <a :href="`/post/${post.slug}`" class="block">
                            <div class="h-[180px] overflow-hidden relative">
                                <img
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                />
                                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                        <div class="p-4 flex-grow flex flex-col">
                            <span v-if="post.categories && post.categories.length > 0" class="inline-block bg-[#ff0030] text-white text-xs px-2 py-1 rounded mb-2">
                                {{ post.categories[0].name }}
                            </span>
                            <a :href="`/post/${post.slug}`" class="block">
                                <h3 class="text-lg font-semibold mb-2 hover:text-[#ff0030] transition-colors">
                                    {{ post.title }}
                                </h3>
                            </a>
                            <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                                {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                            </p>
                            <div class="flex justify-between text-gray-500 text-xs mt-auto">
                                <span v-if="getAuthor(post)">Por: {{ getAuthor(post).name }}</span>
                                <span>{{ formatDate(post.publishedAt) }}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Two Column Layout: Mais Conteúdo (left) and Sidebar (right) -->
            <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                <!-- More Posts Section - Left Column -->
                <section v-if="posts.length > (featuredPost ? 4 : 3)" class="mb-10">
                    <h2 class="text-left text-2xl font-bold text-gray-800 border-b-2 border-[#ff0030] pb-2 mb-6 relative">
                        Mais Conteúdo
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <article
                            v-for="post in posts.slice(featuredPost ? 4 : 3)"
                            :key="post.id"
                            class="bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-5px] transition-transform duration-300 flex flex-col h-full"
                        >
                            <a :href="`/post/${post.slug}`" class="block">
                                <div class="h-[180px] overflow-hidden relative">
                                    <img
                                        v-if="post.featureImage"
                                        :src="post.featureImage"
                                        :alt="post.title"
                                        class="w-full h-full object-cover"
                                    />
                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <div class="p-4 flex-grow flex flex-col">
                                <span v-if="post.categories && post.categories.length > 0" class="inline-block bg-[#ff0030] text-white text-xs px-2 py-1 rounded mb-2">
                                    {{ post.categories[0].name }}
                                </span>
                                <a :href="`/post/${post.slug}`" class="block">
                                    <h3 class="text-lg font-semibold mb-2 hover:text-[#ff0030] transition-colors">
                                        {{ post.title }}
                                    </h3>
                                </a>
                                <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                                    {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                                </p>
                                <div class="flex justify-between text-gray-500 text-xs mt-auto">
                                    <span v-if="getAuthor(post)">Por: {{ getAuthor(post).name }}</span>
                                    <span>{{ formatDate(post.publishedAt) }}</span>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- Loading More Indicator -->
                    <div v-if="loadingMore" class="mt-8 flex justify-center items-center py-6">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff0030]"></div>
                        <span class="ml-3 text-gray-600">Carregando mais posts...</span>
                    </div>

                    <!-- Infinite Scroll Observer Target -->
                    <div ref="observerTarget" class="h-4 w-full"></div>
                </section>

                <!-- Sidebar - Right Column -->
                <aside>
                    <!-- Popular Posts Widget -->
                    <div class="bg-white rounded-lg shadow-md p-5 mb-6">
                        <h2 class="text-lg font-bold mb-4 pb-2 text-gray-800 border-b-2 border-[#ff0030] inline-block">
                            Mais Populares
                        </h2>

                        <div class="space-y-4 mt-4">
                            <div
                                v-for="post in popularPosts"
                                :key="post.id"
                                class="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                            >
                                <div class="w-20 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                    <a :href="`/post/${post.slug}`">
                                        <img
                                            v-if="post.image"
                                            :src="post.image"
                                            :alt="post.title"
                                            class="w-full h-full object-cover"
                                        />
                                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </a>
                                </div>
                                <div class="flex-grow">
                                    <a :href="`/post/${post.slug}`" class="block">
                                        <h4 class="text-sm font-semibold text-gray-800 hover:text-[#ff0030] transition-colors line-clamp-2">
                                            {{ post.title }}
                                        </h4>
                                    </a>
                                    <span class="text-xs text-gray-500 mt-1 block">
                                        {{ formatDate(post.publishedAt) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Categories Widget -->
                    <div class="bg-white rounded-lg shadow-md p-5 mb-6">
                        <h2 class="text-lg font-bold mb-4 pb-2 text-gray-800 border-b-2 border-[#ff0030] inline-block">
                            Categorias
                        </h2>

                        <ul class="space-y-2 mt-4">
                            <li v-for="category in categories" :key="category.id" class="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                <a
                                    :href="`/category/${category.slug}`"
                                    class="flex justify-between items-center text-gray-700 hover:text-[#ff0030] transition-colors"
                                >
                                    {{ category.name }}
                                    <span class="bg-[#ff0030] text-white px-2 py-1 rounded-full text-xs font-medium">
                                        {{ category.postCount }}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import { usePostsStore } from '../../store/posts';
import { useMostAccessedPostsStore } from '../../store/mostaccessed';
import { formatDate, stripHtml } from '../../composables/useUtils';

const settingsStore = useSettingsStore();
const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();
const mostAccessedPostsStore = useMostAccessedPostsStore();
const blogAPI = vue3.useBlog();

// State
const settings = ref<any>(settingsStore.getSettings);
const categories = ref<any[]>(categoriesStore.getCategories || []);
const posts = ref<any[]>(postsStore.getPosts || []);
const popularPosts = ref<any[]>(mostAccessedPostsStore.getMostAccessedPosts || []);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(0);
const hasMorePosts = ref(true);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const currentCarouselIndex = ref(0);
const carouselInterval = ref<number | null>(null);

const coverSettings = computed(() => {
    try {
        const config = settings.value['blog.cover'];
        return config ? JSON.parse(config) : { layoutType: 'full' };
    } catch (err) {
        console.error('Error parsing cover settings:', err);
        return { layoutType: 'full' };
    }
});

const hasCoverConfig = computed(() => {
    return !!settings.value['blog.cover'] && Object.keys(coverSettings.value).length > 0;
});

const coverPosts = computed(() => {
    if (!posts.value.length) return {};

    const result: any = {
        full: posts.value[0],
        carousel: posts.value.slice(0, 3),
        splitMain: posts.value[0],
        splitSide: posts.value.slice(1, 3),
        dual: posts.value.slice(0, 2)
    };

    if (hasCoverConfig.value) {
        const config = coverSettings.value;
        const shouldRespectSelectedPosts = config.respectSelectedPosts !== false;

        if (shouldRespectSelectedPosts) {
            // Handle "full" layout
            if (config.layoutType === 'full' && config.fullCover?.postId) {
                const configPost = posts.value.find(p => p.id === config.fullCover.postId);
                if (configPost) result.full = configPost;
            }

            // Handle "carousel" layout
            if (config.layoutType === 'carousel' && Array.isArray(config.carousel)) {
                const carouselPostIds = config.carousel
                    .filter(item => item && item.postId)
                    .map(item => item.postId);

                if (carouselPostIds.length) {
                    const configPosts = carouselPostIds
                        .map((id: string) => posts.value.find(p => p.id === id))
                        .filter(Boolean);

                    if (configPosts.length) result.carousel = configPosts;
                }
            }

            // Handle "split" layout
            if (config.layoutType === 'split') {
                // Main post
                if (config.split?.main?.postId) {
                    const mainPost = posts.value.find(p => p.id === config.split.main.postId);
                    if (mainPost) result.splitMain = mainPost;
                }

                // Secondary posts
                if (Array.isArray(config.split?.secondary)) {
                    const secondaryPostIds = config.split.secondary
                        .filter(item => item && item.postId)
                        .map(item => item.postId);

                    if (secondaryPostIds.length) {
                        const secondaryPosts = secondaryPostIds
                            .map((id: string) => posts.value.find(p => p.id === id))
                            .filter(Boolean);

                        if (secondaryPosts.length) result.splitSide = secondaryPosts;
                    }
                }
            }

            // Handle "dual" layout
            if (config.layoutType === 'dual' && Array.isArray(config.dual)) {
                const dualPostIds = config.dual
                    .filter(item => item && item.postId)
                    .map(item => item.postId);

                if (dualPostIds.length) {
                    const configPosts = dualPostIds
                        .map((id: string) => posts.value.find(p => p.id === id))
                        .filter(Boolean);

                    if (configPosts.length) result.dual = configPosts;
                }
            }
        }
    }

    return result;
});

const startCarouselInterval = () => {
    if (coverSettings.value.layoutType === 'carousel' && coverPosts.value.carousel?.length > 1) {
        carouselInterval.value = window.setInterval(() => {
            nextCarouselSlide();
        }, 5000);
    }
};

const stopCarouselInterval = () => {
    if (carouselInterval.value) {
        clearInterval(carouselInterval.value);
        carouselInterval.value = null;
    }
};

const nextCarouselSlide = () => {
    stopCarouselInterval();
    if (coverPosts.value.carousel?.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value + 1) % coverPosts.value.carousel.length;
    }
    startCarouselInterval();
};

const prevCarouselSlide = () => {
    stopCarouselInterval();
    if (coverPosts.value.carousel?.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value - 1 + coverPosts.value.carousel.length) % coverPosts.value.carousel.length;
    }
    startCarouselInterval();
};

const headData = ref({
    title: settings.value['blog.title'],
    meta: [
        { name: 'description', content: settings.value['blog.description'] },
        { name: 'keywords', content: settings.value['blog.keywords'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: settings.value['blog.title'] },
        { property: 'og:description', content: settings.value['blog.description'] },
        { property: 'og:image', content: settings.value['blog.logo'] }
    ],
    link: [
        { rel: 'canonical', href: settings.value['blog.url'] },
        { rel: 'alternate', href: `${settings.value['blog.url']}/feed`, type: 'application/rss+xml', title: settings.value['blog.title'] }
    ]
});

useHead(headData);

const pagination = ref({
    total: 0,
    limit: 12,
    offset: 0
});

const featuredPost = computed(() => {
    return posts.value.length > 0 ? posts.value[0] : null;
});

const reviewPosts = computed(() => {
    const reviewCategory = categories.value.find(cat =>
        cat.name.toLowerCase() === 'review' ||
        cat.name.toLowerCase() === 'reviews' ||
        cat.name.toLowerCase() === 'análise' ||
        cat.name.toLowerCase() === 'análises');

    if (reviewCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === reviewCategory.id)
        ).slice(0, 2);
    } else {
        const middleIndex = Math.min(Math.floor(posts.value.length / 2), 5);
        return posts.value.slice(middleIndex, middleIndex + 2);
    }
});

const loadPosts = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response: any = await blogAPI.posts.getAll(currentPage.value * pagination.value.limit);

        if (response) {
            posts.value = response.posts;

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 12,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;

            if (!categories.value.length) {
                try {
                    const categoriesResponse = await blogAPI.categories.getAll();
                    if (categoriesResponse) {
                        categories.value = categoriesResponse;
                    }
                } catch (err) {
                    console.error('Failed to load categories:', err);
                }
            }
        }
    } catch (err: any) {
        console.error('Failed to load posts:', err);
        error.value = err;
    } finally {
        loading.value = false;
    }
};

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response: any = await blogAPI.posts.getAll(posts.value.length);

        if (response && response.posts && response.posts.length > 0) {
            posts.value = [...posts.value, ...response.posts];

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 12,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;
        } else {
            hasMorePosts.value = false;
        }
    } catch (err: any) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;

            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value)
                loadMorePosts();
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.id === post.author);
};

onMounted(async () => {
    await Promise.all([
        loadPosts()
    ]);
    setupIntersectionObserver();
    startCarouselInterval();
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
    stopCarouselInterval();
});

watch(() => settings.value['blog.cover'], () => {
    stopCarouselInterval();
    startCarouselInterval();
}, { deep: true });
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Section styling to match Index.html */
section {
    margin-bottom: 40px;
    padding: 10px 0;
}

/* Section title styling */
.section-title, h2 {
    position: relative;
}

h2::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 4px;
    background-color: #ff0030;
}
</style>


