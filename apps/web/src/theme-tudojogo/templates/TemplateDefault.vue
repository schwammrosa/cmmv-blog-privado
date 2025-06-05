<template>
    <div class="flex flex-col min-h-screen" :class="{ 'dark': isDarkMode }" style="background-color: var(--bg-color); color: var(--text-color);">
        <!-- Header -->
        <header class="bg-[#000000] sticky top-0 z-50 shadow-md">
            <div class="max-w-[1200px] mx-auto px-4">
                <div class="flex justify-between items-center h-14">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <a href="/" class="text-2xl font-bold text-white">
                            <img src="../assets/Logo.png" width="147" height="32" alt="Logo" title="Logo">
                        </a>
                    </div>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex items-center space-x-2">
                        <template v-for="category in mainNavCategories.rootCategories" :key="category.id">
                            <div v-if="mainNavCategories.childrenMap[category.id]" class="relative group">
                                <button class="flex items-center px-4 py-2 text-white bg-transparent hover:bg-[#1a1a1a] hover:text-[#00B8D4] rounded-lg transition-all duration-300 ease-in-out relative z-10 group-hover:bg-[#1a1a1a] group-hover:rounded-b-none border border-[#00B8D4] shadow-sm">
                                    {{ category.name }}
                                    <svg class="ml-2 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <!-- Elemento ponte para evitar lacuna -->
                                <div class="hidden group-hover:block h-2 w-full absolute -bottom-1 left-0 bg-[#1a1a1a] z-20"></div>
                                <div class="absolute hidden group-hover:block left-0 top-[calc(100%-1px)] w-56 rounded-t-none rounded-b-lg shadow-xl bg-[#1a1a1a] border border-t-0 border-[#333333] z-10 transition-all duration-300 origin-top hover:block" style="pointer-events: auto;">
                                    <div class="py-1">
                                        <a v-for="child in mainNavCategories.childrenMap[category.id]" :key="child.id" :href="`/category/${child.slug}`" class="block px-4 py-3 text-white hover:bg-[#2a2a2a] hover:text-[#ffd700] transition-colors duration-200 border-b border-[#333333]">
                                            {{ child.name }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <a v-else :href="`/category/${category.slug}`" class="text-white hover:bg-[#000000] dark:hover:bg-[#000000] hover:text-[#00B8D4] px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors border border-[#00B8D4] shadow-sm">{{ category.name }}</a>
                        </template>
                    </nav>

                    <!-- Social and Search -->
                    <div class="hidden md:flex items-center space-x-3">
                        <SocialIcons 
                          :settings="settings" 
                          size="sm"
                          spacing="md"
                          text-color="text-white"
                          hover-color="hover:text-[#00B8D4]"
                          :show-labels="true"
                        />

                        <!-- Theme Toggle Button -->
                        <button @click="toggleTheme" class="text-white hover:text-[#00B8D4] transition-colors mr-3" title="Alterar tema" aria-label="Alterar tema">
                            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <!-- Sun icon -->
                                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <!-- Moon icon -->
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        </button>
                        
                        <!-- Search Button -->
                        <button @click="openSearchModal" class="text-white hover:text-[#00B8D4] transition-colors" title="Pesquisar" aria-label="Pesquisar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Mobile Menu Button -->
                    <div class="md:hidden flex items-center space-x-3">
                        <!-- Theme Toggle Button (Mobile) -->
                        <button @click="toggleTheme" class="text-white hover:text-[#00B8D4] transition-colors" title="Alterar tema" aria-label="Alterar tema">
                            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <!-- Sun icon -->
                                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <!-- Moon icon -->
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        </button>
                        
                        <button @click="openSearchModal" class="text-white hover:text-[#00B8D4] transition-colors" title="Pesquisar" aria-label="Pesquisar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white" title="Navbar" aria-label="Navbar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div v-show="mobileMenuOpen" class="md:hidden py-3 mt-2">
                    <div class="flex flex-col gap-1">
                        <template v-for="category in mainNavCategories.rootCategories" :key="category.id">
                            <div v-if="mainNavCategories.childrenMap[category.id]" class="w-full">
                                <button
                                    @click="(e) => toggleDropdown(category.id, e)"
                                    class="dropdown-toggle flex items-center justify-between w-full text-white hover:bg-[#1a1a1a] hover:text-[#00B8D4] rounded-lg px-4 py-2 text-sm border border-[#00B8D4] shadow-sm mb-1"
                                    :class="{'bg-[#000000] text-[#00B8D4]': openDropdowns[category.id]}"
                                >
                                    {{ category.name }}
                                    <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div v-show="openDropdowns[category.id]" class="pl-4 py-1 bg-[#000000] rounded mt-1">
                                    <a
                                        v-for="child in mainNavCategories.childrenMap[category.id]"
                                        :key="child.id"
                                        :href="`/category/${child.slug}`"
                                        class="block px-4 py-2 text-sm text-white hover:bg-[#000000] hover:text-[#00B8D4] rounded"
                                    >
                                        {{ child.name }}
                                    </a>
                                </div>
                            </div>
                            <a
                                v-else
                                :href="`/category/${category.slug}`"
                                class="block text-white hover:bg-[#1a1a1a] hover:text-[#00B8D4] rounded-lg px-4 py-2 text-sm border border-[#00B8D4] shadow-sm mb-1"
                            >
                                {{ category.name }}
                            </a>
                        </template>
                    </div>

                    <!-- Social Icons for Mobile -->
                    <div class="flex justify-center space-x-6 mt-3 pt-3 border-t border-[#00B8D4]">
                        <a href="#" class="text-white hover:text-[#00B8D4] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" class="text-white hover:text-[#00B8D4] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a href="#" class="text-white hover:text-[#00B8D4] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main content -->
        <main class="flex-grow container mx-auto md:px-4 md:py-6" style="color: var(--text-color);">
            <div class="flex flex-col lg:flex-row gap-6">
                <router-view />
            </div>
        </main>

        <!-- Newsletter Section -->
        <section class="dark-newsletter py-10 text-white mt-8" :class="{ 'dark-mode': isDarkMode }" :style="isDarkMode ? 'background-color: #1e2636 !important; background: #1e2636 !important;' : 'background-color: var(--bg-tertiary);'">
            <div class="max-w-[1200px] mx-auto px-4">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="md:w-1/2">
                        <h3 class="text-2xl font-bold mb-2">Inscreva-se em nossa Newsletter</h3>
                        <p class="text-gray-200 mb-4">
                            Receba as últimas notícias e atualizações diretamente no seu e-mail.
                            Fique por dentro de tudo sobre o universo gamer.
                        </p>
                    </div>
                    <div class="md:w-1/2 w-full">
                        <form class="flex w-full">
                            <input type="email" placeholder="Seu email"
                                class="flex-grow px-4 py-3 rounded-l-md border-0 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00B8D4]">
                            <button type="submit" class="bg-[#00B8D4] text-[#333333] font-medium px-6 py-3 rounded-r-md hover:bg-[#0095a8] transition-colors whitespace-nowrap">
                                Assinar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="text-white" :class="{ 'dark-mode': isDarkMode }" :style="isDarkMode ? 'background-color: #1e2636 !important; background: linear-gradient(180deg, #1e2636, #131b29) !important;' : 'background: linear-gradient(180deg, var(--bg-secondary), var(--bg-tertiary));'">
            <div class="max-w-[1200px] mx-auto px-4 py-12">
                <div class="grid grid-cols-1 gap-10">
                    <div class="dark-footer-box bg-black/20 p-6 rounded-lg shadow-lg border-l-4 border-[#00A079]" :class="{ 'dark-mode': isDarkMode }" :style="isDarkMode ? 'background-color: #333333 !important; background: #333333 !important;' : ''">
                        <h3 class="text-xl font-bold mb-5 relative pb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#00A079]" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
                            </svg>
                            Sobre o Tudo Jogo
                            <span class="absolute bottom-0 left-0 w-16 h-1 bg-[#00A079]"></span>
                        </h3>
                        <p class="text-sm mb-5 leading-relaxed" style="color: var(--footer-text, #bbbbbb)">
                            Portal especializado em notícias, reviews e conteúdo sobre o mundo dos games.
                            Trazendo as informações mais atualizadas do universo gamer.
                        </p>
                        <ul class="space-y-3 mb-5">
                            <li class="transition-transform hover:translate-x-1">
                                <a href="/" class="hover:text-[#00B8D4] flex items-center" style="color: var(--footer-text, #bbbbbb)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-[#00A079]" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li class="transition-transform hover:translate-x-1">
                                <a href="/terms-of-service" class="hover:text-[#00B8D4] flex items-center" style="color: var(--footer-text, #bbbbbb)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-[#00A079]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM1 10a1 1 0 012 0v6a1 1 0 11-2 0V10zm2 0a1 1 0 012 0v2a1 1 0 11-2 0V10zM1 7a1 1 0 012 0v3a1 1 0 11-2 0V7zM5 7a1 1 0 012 0v3a1 1 0 11-2 0V7z" clip-rule="evenodd" />
                                    </svg>
                                    Termos de Uso
                                </a>
                            </li>
                            <li class="transition-transform hover:translate-x-1">
                                <a href="/terms-of-privacy" class="hover:text-[#00B8D4] flex items-center" style="color: var(--footer-text, #bbbbbb)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-[#00A079]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm.5 0a11.954 11.954 0 017.834 3.056 11.954 11.954 0 008.334 0c.109-.652.166-1.32.166-2.001a10.004 10.004 0 00-10-10c-5.523 0-10 4.477-10 10 0 .681.057 1.35.166 2.001zm3.937 6.534c.22-.375.494-.792.904-1.206a8.001 8.001 0 0110.963-.75.75.75 0 10.74-1.303 9.501 9.501 0 00-13.362 1.489.75.75 0 10.904 1.204l-.149.16z" clip-rule="evenodd" />
                                    </svg>
                                    Política de Privacidade
                                </a>
                            </li>
                            <li class="transition-transform hover:translate-x-1">
                                <a href="/contato" class="hover:text-[#00B8D4] flex items-center" style="color: var(--footer-text, #bbbbbb)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-[#00A079]" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Fale Conosco
                                </a>
                            </li>
                            </ul>
                        </div>
                        
                        <div class="flex justify-center md:justify-start my-4 md:my-0">
                            <SocialIcons 
                              :settings="settings" 
                              size="md"
                              spacing="md"
                              text-color="text-gray-100"
                              hover-color="hover:text-[#00B8D4]"
                              :show-labels="false"
                              style="color: #ffffff;"
                            />
                        </div>
                    </div>

                <div class="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p class="text-sm" style="color: var(--footer-text, #bbbbbb)">
                        &copy; 2025 Tudo Jogo - Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>

        <!-- Search Modal -->
        <div v-if="searchModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="search-modal" role="dialog" aria-modal="true">
            <div class="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" @click="closeSearchModal" style="backdrop-filter: blur(4px);"></div>

                <!-- Modal panel -->
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10">
                    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="w-full">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Pesquisar
                                    </h3>
                                    <button @click="closeSearchModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="mb-4 relative">
                                    <div class="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                                        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="search"
                                        v-model="searchQuery"
                                        @input="debouncedSearch"
                                        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-[#0a5d28] focus:border-[#0a5d28]"
                                        placeholder="Pesquisar posts..."
                                        autocomplete="off"
                                        ref="searchInput"
                                    />
                                </div>

                                <div class="mt-4 max-h-[70vh] overflow-y-auto">
                                    <div v-if="isSearching" class="flex justify-center items-center py-8">
                                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a5d28]"></div>
                                    </div>

                                    <div v-else-if="searchResults.length === 0 && searchQuery.length > 1" class="py-8 text-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>Nenhum resultado encontrado para "{{ searchQuery }}"</p>
                                    </div>

                                    <div v-else-if="searchQuery.length > 1" class="space-y-4">
                                        <p v-if="searchResults.length > 0" class="text-sm text-gray-500 mb-2">
                                            {{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }} encontrado{{ searchResults.length !== 1 ? 's' : '' }}
                                        </p>
                                        <a
                                            v-for="post in searchResults"
                                            :key="post.id"
                                            :href="`/post/${post.slug}`"
                                            class="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div class="flex flex-col sm:flex-row">
                                                <div v-if="post.featureImage" class="w-full sm:w-32 h-40 sm:h-24 flex-shrink-0">
                                                    <img :src="post.featureImage" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
                                                </div>
                                                <div class="p-4 flex-grow">
                                                    <h4 class="font-bold text-gray-900 mb-1">{{ post.title }}</h4>
                                                    <p v-if="post.excerpt" class="text-sm text-gray-600 line-clamp-2">
                                                        {{ post.excerpt }}
                                                    </p>
                                                    <div class="mt-2 text-xs text-gray-500 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {{ formatDate(post.publishedAt || post.updatedAt) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CookieConsent />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { vue3 } from '@cmmv/blog/client';
import { useHead } from '@unhead/vue'
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';

import CookieConsent from '../../components/CookieConsent.vue';
import SocialIcons from '../components/SocialIcons.vue';

const blogAPI = vue3.useBlog();
const categoriesStore = useCategoriesStore();
const settingsStore = useSettingsStore();

// Garantir que settings nunca seja undefined, mesmo durante a hidratação em produção
const settings = computed(() => {
  // Usa optional chaining para evitar erros de acesso a propriedades de undefined
  try {
    // Tenta obter as configurações da store
    const settingsData = settingsStore?.getSettings;
    return settingsData || {};
  } catch (error) {
    console.warn('Erro ao acessar configurações:', error);
    return {}; // Retorna um objeto vazio para evitar erros de undefined
  }
});

const scripts = computed(() => {
    const baseScripts = [];
    return [...baseScripts, ...settingsStore.googleAnalyticsScripts];
});

useHead({
    meta: computed(() => settingsStore.allMetaTags),

    link: [
        {
            rel: 'stylesheet',
            href: '/src/theme-tudojogo/style.css'
        },
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/src/theme-tudojogo/assets/favicon.ico?v=2'
        },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com/' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'preconnect', href: 'https://connect.facebook.net/' },
        { rel: 'preconnect', href: 'https://securepubads.g.doubleclick.net/' },
        { rel: 'preconnect', href: 'https://tpc.googlesyndication.com/' },
        { rel: 'preconnect', href: 'https://www.googletag.com/' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com/' },
        { rel: 'dns-prefetch', href: 'https://securepubads.g.doubleclick.net' }
    ],

    script: scripts
})

const isDarkMode = ref(false);
const popularPosts = ref<any[]>([]);
const loadingPopularPosts = ref(true);

// Função para verificar e carregar a preferência de tema salva
const loadSavedTheme = () => {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verificar preferência do sistema se não houver tema salvo
    if (!savedTheme && window.matchMedia) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode.value = prefersDarkMode;
    } else {
        // Usar a preferência salva se existir
        isDarkMode.value = savedTheme === 'dark';
    }
    
    // Aplicar o tema definido
    applyTheme();
};

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    applyTheme();
};

const applyTheme = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const searchModalOpen = ref(false);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const searchTimeout = ref<any>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const mobileMenuOpen = ref(false);

const categories = ref<any[]>(categoriesStore.getCategories || []);

const footerCategories = computed(() => {
    return categories.value.slice(0, 6);
});

const mainNavCategories = computed(() => {
    const navCategories = categories.value?.filter((category: any) => category.mainNav) || [];
    navCategories.sort((a: any, b: any) => (a.mainNavIndex ?? 999) - (b.mainNavIndex ?? 999));

    const rootCategories = navCategories.filter((cat: any) => !cat.parentCategory);
    const childCategories = navCategories.filter((cat: any) => cat.parentCategory);

    return {
        rootCategories,
        childrenMap: childCategories.reduce((map: Record<string, any[]>, child: any) => {
            if (!map[child.parentCategory]) {
                map[child.parentCategory] = [];
            }
            map[child.parentCategory].push(child);
            return map;
        }, {} as Record<string, any[]>),
    };
});

const openDropdowns = ref<Record<string, boolean>>({});

const toggleDropdown = (categoryId: string, event: Event) => {
    event.stopPropagation();
    if (openDropdowns.value[categoryId]) {
        openDropdowns.value = {
            ...openDropdowns.value,
            [categoryId]: false
        };
    } else {
        const newDropdownState: Record<string, boolean> = {};
        Object.keys(openDropdowns.value).forEach(key => {
            newDropdownState[key] = false;
        });
        newDropdownState[categoryId] = true;
        openDropdowns.value = newDropdownState;
    }
};

const openSearchModal = () => {
    searchModalOpen.value = true;
    setTimeout(() => {
        searchInput.value?.focus();
    }, 100);
};

const closeSearchModal = () => {
    searchModalOpen.value = false;
    searchQuery.value = '';
    searchResults.value = [];
};

const debouncedSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
    }

    searchTimeout.value = setTimeout(() => {
        performSearch();
    }, 300);
};

const performSearch = async () => {
    if (searchQuery.value.trim().length < 2) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;

    try {
        const response = await blogAPI.posts.search(searchQuery.value);

        if (Array.isArray(response)) {
            searchResults.value = response;
        } else if (response && typeof response === 'object') {
            const typedResponse = response as { posts?: any[] };
            searchResults.value = Array.isArray(typedResponse.posts) ? typedResponse.posts : [];
        } else {
            searchResults.value = [];
        }
    } catch (error) {
        console.error('Search error:', error);
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

const categoriesColumns = computed(() => {
    const allCategories = categories.value;
    const columnSize = Math.ceil(allCategories.length / 3);

    return [
        allCategories.slice(0, columnSize),
        allCategories.slice(columnSize, columnSize * 2),
        allCategories.slice(columnSize * 2)
    ];
});

onMounted(async () => {
    await Promise.all([
        (async () => {
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
        })()
    ]);

    // Carregar preferência de tema salva
    loadSavedTheme();
    document.addEventListener('click', closeDropdownsOnClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdownsOnClickOutside);
});

const closeDropdownsOnClickOutside = (event: Event) => {
    const dropdownElements = document.querySelectorAll('.dropdown-menu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    let clickedInsideDropdown = false;

    dropdownElements.forEach(el => {
        if (el.contains(event.target as Node)) {
            clickedInsideDropdown = true;
        }
    });

    dropdownToggles.forEach(el => {
        if (el.contains(event.target as Node)) {
            clickedInsideDropdown = true;
        }
    });

    if (!clickedInsideDropdown) {
        openDropdowns.value = {};
    }
};

watch(isDarkMode, () => {
    applyTheme();
});
</script>

<style>
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>
