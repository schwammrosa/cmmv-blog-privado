<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Whitelabel Domains</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <button @click="openAddDialog" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Domain
                </button>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-neutral-800 rounded-lg p-4 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="relative flex-1 flex items-center">
                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Search domains..."
                            class="bg-neutral-700 h-10 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-0"
                        >
                    </div>
                    <select
                        v-model="filters.searchField"
                        class="bg-neutral-700 w-56 h-10 border border-neutral-800 text-white px-3 py-2 rounded-r-md focus:outline-none focus:ring-0 border-l-0"
                    >
                        <option value="name">Name</option>
                        <option value="domain">Domain</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading domains...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load domains</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="whitelabels.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <p class="text-neutral-300 mb-2">No domains found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by adding your first whitelabel domain</p>
            <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Add Domain
            </button>
        </div>

        <!-- Whitelabels table -->
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
                                @click="toggleSort('domain')"
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-white"
                            >
                                Domain
                                <span v-if="filters.sortBy === 'domain'" class="ml-1">
                                    {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
                                </span>
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                API URL
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="whitelabel in whitelabels" :key="whitelabel.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="whitelabel.id">
                                {{ whitelabel.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ whitelabel.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                <a :href="`https://${whitelabel.domain}`" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline">
                                    {{ whitelabel.domain }}
                                </a>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ whitelabel.apiUrl }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(whitelabel)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
            itemName="domains"
            @pageChange="handlePageChange"
        />

        <!-- Add/Edit Whitelabel Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Domain' : 'Add Domain' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveWhitelabel">
                        <div class="mb-4">
                            <label for="whitelabelName" class="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                            <input
                                id="whitelabelName"
                                v-model="whitelabelForm.name"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Organization name"
                                required
                            />
                            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="whitelabelDomain" class="block text-sm font-medium text-neutral-300 mb-1">Domain</label>
                            <input
                                id="whitelabelDomain"
                                v-model="whitelabelForm.domain"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="example.com"
                                required
                            />
                            <p class="mt-1 text-sm text-neutral-500">Domain to use for whitelabeling (no http:// or https://)</p>
                            <p v-if="formErrors.domain" class="mt-1 text-sm text-red-500">{{ formErrors.domain }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="whitelabelApiUrl" class="block text-sm font-medium text-neutral-300 mb-1">API URL</label>
                            <input
                                id="whitelabelApiUrl"
                                v-model="whitelabelForm.apiUrl"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="https://api.example.com"
                                required
                            />
                            <p class="mt-1 text-sm text-neutral-500">API URL for this domain</p>
                            <p v-if="formErrors.apiUrl" class="mt-1 text-sm text-red-500">{{ formErrors.apiUrl }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="whitelabelFaviconUrl" class="block text-sm font-medium text-neutral-300 mb-1">Favicon URL</label>
                            <input
                                id="whitelabelFaviconUrl"
                                v-model="whitelabelForm.faviconUrl"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="https://example.com/favicon.ico"
                                required
                            />
                            <p class="mt-1 text-sm text-neutral-500">URL to the favicon for this domain</p>
                            <p v-if="formErrors.faviconUrl" class="mt-1 text-sm text-red-500">{{ formErrors.faviconUrl }}</p>
                        </div>

                        <div class="mb-4 flex items-center">
                            <input
                                id="whitelabelActive"
                                v-model="whitelabelForm.active"
                                type="checkbox"
                                class="h-4 w-4 rounded border-neutral-600 text-blue-600 focus:ring-blue-500 bg-neutral-700"
                            />
                            <label for="whitelabelActive" class="ml-2 block text-sm text-neutral-300">
                                Active
                            </label>
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
            :item-name="whitelabelToDelete?.name"
            :loading="deleteLoading"
            message="Are you sure you want to delete the domain"
            warning-text="This action cannot be undone. All content and settings for this domain will be removed."
            loading-text="Deleting..."
            @confirm="deleteWhitelabel"
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
import { useAdminClient } from '@cmmv/blog/admin/client'
import Pagination from '../components/Pagination.vue'
import DeleteDialog from '../components/DeleteDialog.vue'
import ToastNotification from '../components/ToastNotification.vue'

const adminClient = useAdminClient()

const whitelabels = ref([])
const loading = ref(true)
const error = ref(null)

const showDialog = ref(false)
const isEditing = ref(false)
const whitelabelForm = ref({
    name: '',
    domain: '',
    apiUrl: '',
    faviconUrl: '',
    active: true
})
const whitelabelToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

const showDeleteDialog = ref(false)
const whitelabelToDelete = ref(null)
const deleteLoading = ref(false)

const logoInput = ref(null)

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

const loadWhitelabels = async () => {
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

        const response = await adminClient.whitelabel.get(apiFilters)

        if (response && response.data) {
            whitelabels.value = response.data || []

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
            whitelabels.value = []
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
        console.error('Failed to load whitelabel domains:', err)
        loading.value = false
        error.value = err.message || 'Failed to load whitelabel domains'
        showNotification('error', 'Failed to load whitelabel domains')
    }
}

// Refresh data
const refreshData = () => {
    loadWhitelabels()
}

// Pagination methods
const handlePageChange = (newPage) => {
    filters.value.page = newPage;
}

// Watch for filter changes
watch(filters, () => {
    loadWhitelabels()
}, { deep: true })

// Dialog methods
const openAddDialog = () => {
    isEditing.value = false
    whitelabelForm.value = {
        name: '',
        domain: '',
        apiUrl: '',
        faviconUrl: '',
        active: true
    }
    formErrors.value = {}
    showDialog.value = true
}

const openEditDialog = (whitelabel) => {
    isEditing.value = true
    whitelabelToEdit.value = whitelabel
    whitelabelForm.value = {
        name: whitelabel.name,
        domain: whitelabel.domain,
        apiUrl: whitelabel.apiUrl || '',
        faviconUrl: whitelabel.faviconUrl || '',
        active: whitelabel.active !== undefined ? whitelabel.active : true
    }
    formErrors.value = {}
    showDialog.value = true
}

const closeDialog = () => {
    showDialog.value = false
    whitelabelForm.value = {
        name: '',
        domain: '',
        apiUrl: '',
        faviconUrl: '',
        active: true
    }
    formErrors.value = {}
    whitelabelToEdit.value = null
}

// Handle logo upload
const handleLogoUpload = async (event) => {
    if (!event.target.files || !event.target.files[0]) return

    try {
        const file = event.target.files[0]

        // Convert file to base64
        const reader = new FileReader()
        reader.onload = async (e) => {
            const base64 = e.target.result

            try {
                // Upload the image to the server and get the URL
                const response = await adminClient.medias.processImage({
                    image: base64,
                    format: 'webp',
                    maxWidth: 140
                })

                whitelabelForm.value.logo = response.url
            } catch (err) {
                console.error('Error uploading logo:', err)
                showNotification('error', 'Failed to upload logo')
            }
        }
        reader.readAsDataURL(file)
    } catch (err) {
        console.error('Error reading logo file:', err)
        showNotification('error', 'Failed to read logo file')
    }
}

const removeLogo = () => {
    whitelabelForm.value.logo = ''
}

// Save whitelabel
const saveWhitelabel = async () => {
    try {
        formLoading.value = true
        formErrors.value = {}

        // Validate
        if (!whitelabelForm.value.name.trim()) {
            formErrors.value.name = 'Name is required'
            formLoading.value = false
            return
        }

        if (!whitelabelForm.value.domain.trim()) {
            formErrors.value.domain = 'Domain is required'
            formLoading.value = false
            return
        }

        if (!whitelabelForm.value.apiUrl.trim()) {
            formErrors.value.apiUrl = 'API URL is required'
            formLoading.value = false
            return
        }

        if (!whitelabelForm.value.faviconUrl.trim()) {
            formErrors.value.faviconUrl = 'Favicon URL is required'
            formLoading.value = false
            return
        }

        // Validate domain format
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
        if (!domainRegex.test(whitelabelForm.value.domain)) {
            formErrors.value.domain = 'Please enter a valid domain name'
            formLoading.value = false
            return
        }

        const whitelabelData = {
            name: whitelabelForm.value.name.trim(),
            domain: whitelabelForm.value.domain.trim(),
            apiUrl: whitelabelForm.value.apiUrl.trim(),
            faviconUrl: whitelabelForm.value.faviconUrl.trim(),
            active: whitelabelForm.value.active
        }

        if (isEditing.value) {
            await adminClient.whitelabel.update(whitelabelToEdit.value.id, whitelabelData)
            showNotification('success', 'Domain updated successfully')
        } else {
            await adminClient.whitelabel.insert(whitelabelData)
            showNotification('success', 'Domain created successfully')
        }

        formLoading.value = false
        closeDialog()
        refreshData()
    } catch (err) {
        formLoading.value = false

        if (err.response?.data?.errors)
            formErrors.value = err.response.data.errors
        else
            showNotification('error', err.message || 'Failed to save domain')
    }
}

const confirmDelete = (whitelabel) => {
    whitelabelToDelete.value = whitelabel
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    whitelabelToDelete.value = null
}

const deleteWhitelabel = async () => {
    if (!whitelabelToDelete.value) return

    try {
        deleteLoading.value = true
        await adminClient.whitelabel.delete(whitelabelToDelete.value.id)
        deleteLoading.value = false
        closeDeleteDialog()
        showNotification('success', 'Domain deleted successfully')
        refreshData()
    } catch (err) {
        deleteLoading.value = false
        console.error('Failed to delete domain:', err)
        showNotification('error', err.message || 'Failed to delete domain')
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

const toggleSort = (column) => {
    if (filters.value.sortBy === column) {
        filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
        filters.value.sortBy = column
        filters.value.sortOrder = 'asc'
    }
}

onMounted(() => {
    loadWhitelabels()
})
</script>
