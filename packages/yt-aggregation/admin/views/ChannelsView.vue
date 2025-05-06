<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">YouTube Channels</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <!-- Add search dropdown button -->
                <div class="relative">
                    <button @click="toggleSearchDropdown" data-search-toggle
                        class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center relative">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                        <!-- Indicator dot for active search -->
                        <span
                            v-if="filters.search.trim()"
                            class="absolute -top-1 -right-1 h-2.5 w-2.5 bg-blue-500 rounded-full"
                            title="Search filter active">
                        </span>
                    </button>
                    <!-- Search dropdown -->
                    <div v-if="showSearchDropdown" class="absolute right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
                        <div class="p-3 space-y-3">
                            <div class="relative">
                                <input
                                    v-model="filters.search"
                                    type="text"
                                    placeholder="Search channels..."
                                    class="bg-neutral-700 h-9 border border-neutral-600 text-white pl-3 pr-8 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @keydown.esc="showSearchDropdown = false"
                                    ref="searchInput"
                                >
                                <!-- Clear button -->
                                <button
                                    v-if="filters.search.trim()"
                                    @click="clearSearch"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                                    title="Clear search">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <label class="block text-xs text-neutral-400 mb-1">Search in field:</label>
                                <select
                                    v-model="filters.searchField"
                                    class="bg-neutral-700 w-full h-8 border border-neutral-600 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="name">Name</option>
                                    <option value="url">URL</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    @click="processChannels"
                    class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors flex items-center"
                    :disabled="processingChannels"
                    title="Process all channels to fetch new content"
                >
                    <span v-if="processingChannels" class="flex items-center">
                        <svg class="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                    <span v-else class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Process Channels
                    </span>
                </button>
                <button @click="openAddDialog" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Channel
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading channels...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load channels</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="channels.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM5 4h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
            <p class="text-neutral-300 mb-2">No YouTube channels found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by creating your first YouTube channel</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add Channel
            </button>
        </div>

        <!-- Channels table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-16">
                                ID
                            </th>
                            <th
                                @click="toggleSort('name')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Name
                                <span v-if="filters.sortBy === 'name'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th
                                @click="toggleSort('lastUpdate')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Last Update
                                <span v-if="filters.sortBy === 'lastUpdate'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Update Interval
                            </th>
                            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Active
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="channel in channels" :key="channel.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="channel.id">
                                {{ channel.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ channel.name.substring(0, 20) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatDate(channel.lastUpdate) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatInterval(channel.intervalUpdate) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                                <button
                                    @click="toggleActive(channel)"
                                    :class="[
                                        'rounded-full p-1 w-12 h-6 flex items-center transition-colors',
                                        channel.active ? 'bg-green-600 justify-end' : 'bg-neutral-600 justify-start'
                                    ]"
                                >
                                    <span class="bg-white rounded-full w-4 h-4"></span>
                                </button>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="processSingleChannel(channel)"
                                        title="Process Channel"
                                        class="text-neutral-400 hover:text-blue-500 transition-colors"
                                        :disabled="processingList.includes(channel.id)"
                                    >
                                        <template v-if="processingList.includes(channel.id)">
                                            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </template>
                                        <template v-else>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                        </template>
                                    </button>
                                    <button
                                        @click="openEditDialog(channel)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(channel)"
                                        title="Delete"
                                        class="text-neutral-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <Pagination
            :pagination="pagination"
            itemName="channels"
            @pageChange="handlePageChange"
        />

        <!-- Add/Edit Channel Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Channel' : 'Add Channel' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveChannel">
                        <div class="mb-4">
                            <label for="channelName" class="block text-sm font-medium text-neutral-300 mb-1">Channel Name</label>
                            <input
                                id="channelName"
                                v-model="channelForm.name"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Channel name"
                                required
                            />
                            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="channelId" class="block text-sm font-medium text-neutral-300 mb-1">YouTube Channel ID</label>
                            <input
                                id="channelId"
                                v-model="channelForm.channelId"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="UCxxxxxxxxxxxxxxxxxx"
                                required
                            />
                            <p v-if="formErrors.channelId" class="mt-1 text-sm text-red-500">{{ formErrors.channelId }}</p>
                            <p class="mt-1 text-sm text-neutral-500">YouTube channel ID starts with "UC"</p>
                        </div>

                        <div class="mb-4">
                            <label for="channelUrl" class="block text-sm font-medium text-neutral-300 mb-1">Channel URL</label>
                            <div class="flex space-x-2">
                                <div class="flex-grow relative">
                                    <input
                                        id="channelUrl"
                                        v-model="channelForm.url"
                                        type="url"
                                        class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxx"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    @click="fetchChannelInfo"
                                    class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center"
                                    :disabled="fetchingChannelInfo || !channelForm.url"
                                    title="Fetch channel information from URL"
                                >
                                    <span v-if="fetchingChannelInfo" class="flex items-center">
                                        <svg class="animate-spin mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Fetching...
                                    </span>
                                    <span v-else>
                                        Fetch Info
                                    </span>
                                </button>
                            </div>
                            <p v-if="formErrors.url" class="mt-1 text-sm text-red-500">{{ formErrors.url }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="channelInterval" class="block text-sm font-medium text-neutral-300 mb-1">Update Interval</label>
                            <div class="flex items-center">
                                <input
                                    id="channelInterval"
                                    v-model.number="channelForm.intervalHours"
                                    type="number"
                                    min="1"
                                    max="168"
                                    class="w-24 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                <span class="ml-2 text-neutral-300">hours</span>
                            </div>
                            <p class="mt-1 text-sm text-neutral-500">How often to check for new videos (1-168 hours)</p>
                            <p v-if="formErrors.intervalUpdate" class="mt-1 text-sm text-red-500">{{ formErrors.intervalUpdate }}</p>
                        </div>

                        <div class="mb-4">
                            <div class="flex items-center">
                                <input
                                    id="channelActive"
                                    v-model="channelForm.active"
                                    type="checkbox"
                                    class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-neutral-700 border-neutral-600"
                                />
                                <label for="channelActive" class="ml-2 block text-sm font-medium text-neutral-300">
                                    Active
                                </label>
                            </div>
                            <p class="mt-1 text-sm text-neutral-500">Only active channels will be processed</p>
                        </div>

                        <div class="mb-4">
                            <div class="flex items-center">
                                <input
                                    id="autoPublish"
                                    v-model="channelForm.autoPublish"
                                    type="checkbox"
                                    class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-neutral-700 border-neutral-600"
                                />
                                <label for="autoPublish" class="ml-2 block text-sm font-medium text-neutral-300">
                                    Auto Publish
                                </label>
                            </div>
                            <p class="mt-1 text-sm text-neutral-500">Automatically publish new videos as blog posts</p>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                @click="closeDialog"
                                class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                :disabled="formLoading"
                            >
                                <span v-if="formLoading" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                                <span v-else>
                                    {{ isEditing ? 'Update' : 'Create' }}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <DeleteDialog
            :show="showDeleteDialog"
            :item-name="channelToDelete?.name"
            :loading="deleteLoading"
            message="Are you sure you want to delete the channel"
            warning-text="This action cannot be undone. All videos associated with this channel may be affected."
            loading-text="Deleting..."
            @confirm="deleteChannel"
            @cancel="closeDeleteDialog"
        />

        <!-- Toast notifications -->
        <ToastNotification
            :show="notification.show"
            :message="notification.message"
            :type="notification.type"
            :duration="notification.duration"
            @close="notification.show = false"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useYTClient } from '../client'
import Pagination from '@cmmv/blog/admin/components/Pagination.vue'
import DeleteDialog from '@cmmv/blog/admin/components/DeleteDialog.vue'
import ToastNotification from '@cmmv/blog/admin/components/ToastNotification.vue'

const ytClient = useYTClient()

const channels = ref([])
const loading = ref(true)
const error = ref(null)

const showDialog = ref(false)
const isEditing = ref(false)
const channelForm = ref({
    name: '',
    url: '',
    channelId: '',
    intervalHours: 24,
    active: true,
    autoPublish: false
})
const channelToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

const showDeleteDialog = ref(false)
const channelToDelete = ref(null)
const deleteLoading = ref(false)

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
})

const pagination = ref({
    current: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 1,
    to: 10
})

const filters = ref({
    search: '',
    searchField: 'name',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1
})

const processingChannels = ref(false)
const processingList = ref([])

const fetchingChannelInfo = ref(false)

const showSearchDropdown = ref(false)
const searchInput = ref(null)

const loadChannels = async () => {
    try {
        loading.value = true
        error.value = null

        const apiFilters = {
            limit: pagination.value.perPage,
            offset: (filters.value.page - 1) * pagination.value.perPage,
            sortBy: filters.value.sortBy,
            sort: filters.value.sortOrder,
        }

        if (filters.value.search) {
            apiFilters.search = filters.value.search
            apiFilters.searchField = filters.value.searchField
        }

        // Load YouTube channels
        const response = await ytClient.channels.get(apiFilters)

        if (response && response.data) {
            channels.value = response.data || []

            const paginationData = response.pagination || {}
            const totalCount = response.count || 0
            const currentOffset = paginationData.offset || 0
            const currentLimit = paginationData.limit || 10

            // Calculate current page from offset and limit
            const currentPage = Math.floor(currentOffset / currentLimit) + 1
            const lastPage = Math.ceil(totalCount / currentLimit)

            pagination.value = {
                current: currentPage,
                lastPage: lastPage,
                perPage: currentLimit,
                total: totalCount,
                from: currentOffset + 1,
                to: Math.min(currentOffset + currentLimit, totalCount)
            }
        } else {
            channels.value = []
            // Reset pagination if data format is unexpected
            pagination.value = {
                current: 1,
                lastPage: 1,
                perPage: 10,
                total: 0,
                from: 0,
                to: 0
            }
        }

        loading.value = false
    } catch (err) {
        console.error('Failed to load channels:', err)
        loading.value = false
        error.value = err.message || 'Failed to load YouTube channels'
        showNotification('error', 'Failed to load YouTube channels')
    }
}

const refreshData = () => {
    loadChannels()
}

const handlePageChange = (newPage) => {
    filters.value.page = newPage;
}

watch(filters, () => {
    loadChannels()
}, { deep: true })

const openAddDialog = () => {
    isEditing.value = false
    channelForm.value = {
        name: '',
        url: '',
        channelId: '',
        intervalHours: 24,
        active: true,
        autoPublish: false
    }
    formErrors.value = {}
    showDialog.value = true
}

const openEditDialog = (channel) => {
    isEditing.value = true
    channelToEdit.value = channel

    const intervalHours = channel.intervalUpdate ? Math.floor(channel.intervalUpdate / (1000 * 60 * 60)) : 24

    channelForm.value = {
        name: channel.name,
        url: channel.url,
        channelId: channel.channelId,
        intervalHours: intervalHours,
        active: channel.active === undefined ? true : channel.active,
        autoPublish: channel.autoPublish === undefined ? false : channel.autoPublish
    }
    formErrors.value = {}
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    channelForm.value = {
        name: '',
        url: '',
        channelId: '',
        intervalHours: 24,
        active: true,
        autoPublish: false
    }
    formErrors.value = {}
    channelToEdit.value = null
}

const saveChannel = async () => {
    try {
        formLoading.value = true
        formErrors.value = {}

        // Validate
        if (!channelForm.value.name.trim()) {
            formErrors.value.name = 'Channel name is required'
            formLoading.value = false
            return
        }

        if (!channelForm.value.url.trim()) {
            formErrors.value.url = 'Channel URL is required'
            formLoading.value = false
            return
        }

        if (!channelForm.value.channelId.trim()) {
            formErrors.value.channelId = 'YouTube Channel ID is required'
            formLoading.value = false
            return
        }

        if (!channelForm.value.channelId.trim().startsWith('UC')) {
            formErrors.value.channelId = 'YouTube Channel ID must start with UC'
            formLoading.value = false
            return
        }

        if (!channelForm.value.intervalHours || channelForm.value.intervalHours < 1 || channelForm.value.intervalHours > 168) {
            formErrors.value.intervalUpdate = 'Update interval must be between 1 and 168 hours'
            formLoading.value = false
            return
        }

        // Convert hours to milliseconds
        const intervalUpdate = channelForm.value.intervalHours * 60 * 60 * 1000

        const channelData = {
            name: channelForm.value.name.trim(),
            url: channelForm.value.url.trim(),
            channelId: channelForm.value.channelId.trim(),
            intervalUpdate: intervalUpdate,
            active: channelForm.value.active,
            autoPublish: channelForm.value.autoPublish
        }

        if (isEditing.value) {
            await ytClient.channels.update(channelToEdit.value.id, channelData)
            showNotification('success', 'Channel updated successfully')
        } else {
            await ytClient.channels.insert(channelData)
            showNotification('success', 'Channel created successfully')
        }

        formLoading.value = false
        closeDialog()
        refreshData()
    } catch (err) {
        formLoading.value = false

        if (err.response?.data?.errors)
            formErrors.value = err.response.data.errors
        else
            showNotification('error', err.message || 'Failed to save channel')
    }
}

const confirmDelete = (channel) => {
    channelToDelete.value = channel
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    channelToDelete.value = null
}

const deleteChannel = async () => {
    if (!channelToDelete.value) return

    try {
        deleteLoading.value = true
        await ytClient.channels.delete(channelToDelete.value.id)
        deleteLoading.value = false
        closeDeleteDialog()
        showNotification('success', 'Channel deleted successfully')
        refreshData()
    } catch (err) {
        deleteLoading.value = false
        console.error('Failed to delete channel:', err)
        showNotification('error', err.message || 'Failed to delete channel')
    }
}

const showNotification = (type, message) => {
    notification.value = {
        show: true,
        type,
        message,
        duration: 3000
    }

    setTimeout(() => {
        notification.value.show = false
    }, notification.value.duration)
}

const formatUrl = (url) => {
    if (!url) return '';

    try {
        const parsedUrl = new URL(url);
        // Return the hostname part plus path if it's not just '/'
        return parsedUrl.hostname + (parsedUrl.pathname !== '/' ? parsedUrl.pathname : '');
    } catch (e) {
        return url;
    }
}

const formatInterval = (interval) => {
    if (!interval) return '24 hours';

    const hours = Math.floor(interval / (1000 * 60 * 60));

    if (hours === 1) return '1 hour';
    return `${hours} hours`;
}

const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Never';

    return date.toLocaleString();
}

const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

const toggleActive = async (channel) => {
    try {
        const updatedChannel = {
            ...channel,
            active: !channel.active
        };

        await ytClient.channels.update(channel.id, updatedChannel);

        // Update the local state
        const index = channels.value.findIndex(c => c.id === channel.id);
        if (index !== -1) {
            channels.value[index].active = !channel.active;
        }

        showNotification('success', `Channel ${updatedChannel.active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
        console.error('Failed to toggle channel active state:', err);
        showNotification('error', err.message || 'Failed to update channel status');
    }
}

const processChannels = async () => {
    try {
        processingChannels.value = true
        await ytClient.channels.processChannels()
        showNotification('success', 'Channels processed successfully')
        refreshData()
    } catch (err) {
        showNotification('error', err.message || 'Failed to process channels')
    } finally {
        processingChannels.value = false
    }
}

const processSingleChannel = async (channel) => {
    if (processingList.value.includes(channel.id)) return;

    try {
        processingList.value.push(channel.id);
        await ytClient.channels.processChannel(channel.id);
        showNotification('success', `Channel "${channel.name}" processed successfully`);

        // Refresh data to update last update time
        refreshData();
    } catch (err) {
        console.error('Failed to process channel:', err);
        showNotification('error', err.message || `Failed to process channel "${channel.name}"`);
    } finally {
        // Remove from processing list
        processingList.value = processingList.value.filter(id => id !== channel.id);
    }
}

const fetchChannelInfo = async () => {
    if (!channelForm.value.url || fetchingChannelInfo.value) return;

    try {
        fetchingChannelInfo.value = true;
        formErrors.value = {};

        const response = await ytClient.channels.getChannelInfo(channelForm.value.url);

        if (response && response.success) {
            channelForm.value.name = response.channelName;
            channelForm.value.channelId = response.channelId;
            showNotification('success', 'Channel information fetched successfully');
        } else {
            formErrors.value.url = response.message || 'Failed to get channel info';
            showNotification('error', response.message || 'Failed to get channel info');
        }
    } catch (err) {
        console.error('Error fetching channel info:', err);
        formErrors.value.url = err.message || 'Failed to get channel info';
        showNotification('error', err.message || 'Failed to get channel info');
    } finally {
        fetchingChannelInfo.value = false;
    }
}

const toggleSearchDropdown = () => {
    showSearchDropdown.value = !showSearchDropdown.value;
    if (showSearchDropdown.value) {
        setTimeout(() => {
            searchInput.value.focus();
        }, 0);
    }
}

const clearSearch = () => {
    filters.value.search = '';
    showSearchDropdown.value = false;
}

onMounted(() => {
    loadChannels()
})
</script>
