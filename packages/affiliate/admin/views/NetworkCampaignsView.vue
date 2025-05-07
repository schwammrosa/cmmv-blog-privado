<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Advertisers</h1>
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
                                    placeholder="Search network campaigns..."
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
                        </div>
                    </div>
                </div>
                <button @click="openAddDialog" class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Advertisers
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading advertisers...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load advertisers</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="networkCampaigns.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <p class="text-neutral-300 mb-2">No advertisers found</p>
            <p class="text-neutral-400 text-sm mb-4">Get started by importing advertisers from your affiliate networks</p>
            <div class="flex flex-wrap gap-3 justify-center">
                <button @click="openAddDialog" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                    Add Manually
                </button>
                <button @click="importCampaigns" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    Import Advertisers
                </button>
            </div>
        </div>

        <!-- Network Campaigns table -->
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
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Network
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Campaign ID
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="campaign in networkCampaigns" :key="campaign.id" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400" :title="campaign.id">
                                {{ campaign.id.substring(0, 6) }}...
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ campaign.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                <span
                                    v-if="campaign.network"
                                    class="bg-neutral-700 text-xs rounded px-2 py-1"
                                >
                                    {{ getNetworkName(campaign.network) }}
                                </span>
                                <span v-else class="text-neutral-500 italic">
                                    No network
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ campaign.campaignId }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span :class="getStatusClass(campaign.status)">
                                    {{ campaign.status || 'Active' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="openEditDialog(campaign)"
                                        title="Edit"
                                        class="text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        @click="confirmDelete(campaign)"
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
            itemName="advertisers"
            @pageChange="handlePageChange"
        />

        <!-- Add/Edit Network Campaign Dialog -->
        <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-lg mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Edit Advertiser' : 'Add Advertiser' }}</h3>
                    <button @click="closeDialog" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveCampaign" class="max-h-[70vh] overflow-y-auto">
                        <div class="mb-4">
                            <label for="campaignName" class="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                            <input
                                id="campaignName"
                                v-model="campaignForm.name"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Campaign name"
                                required
                            />
                            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="campaignId" class="block text-sm font-medium text-neutral-300 mb-1">Advertisers ID</label>
                            <input
                                id="campaignId"
                                v-model="campaignForm.campaignId"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Advertisers ID"
                                required
                            />
                            <p class="mt-1 text-sm text-neutral-500">The unique identifier for this campaign in the affiliate network</p>
                            <p v-if="formErrors.campaignId" class="mt-1 text-sm text-red-500">{{ formErrors.campaignId }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="campaignStatus" class="block text-sm font-medium text-neutral-300 mb-1">Status</label>
                            <select
                                id="campaignStatus"
                                v-model="campaignForm.status"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Paused">Paused</option>
                                <option value="Pending">Pending</option>
                                <option value="Expired">Expired</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <p v-if="formErrors.status" class="mt-1 text-sm text-red-500">{{ formErrors.status }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="campaignNetwork" class="block text-sm font-medium text-neutral-300 mb-1">Network</label>
                            <div v-if="loadingNetworks" class="flex items-center py-2">
                                <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                                <span class="ml-2 text-neutral-400 text-sm">Loading networks...</span>
                            </div>
                            <div v-else-if="availableNetworks.length === 0" class="py-2 text-sm text-neutral-400">
                                No networks available. Please create a network first.
                            </div>
                            <div v-else>
                                <select
                                    id="campaignNetwork"
                                    v-model="campaignForm.network"
                                    class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                >
                                    <option value="" disabled>Select a network</option>
                                    <option
                                        v-for="network in availableNetworks"
                                        :key="network.id"
                                        :value="network.id"
                                    >
                                        {{ network.name }}
                                    </option>
                                </select>
                            </div>
                            <p v-if="formErrors.network" class="mt-1 text-sm text-red-500">{{ formErrors.network }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="campaignCurrency" class="block text-sm font-medium text-neutral-300 mb-1">Currency Code</label>
                            <input
                                id="campaignCurrency"
                                v-model="campaignForm.currencyCode"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="USD, EUR, GBP, etc."
                            />
                            <p v-if="formErrors.currencyCode" class="mt-1 text-sm text-red-500">{{ formErrors.currencyCode }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="campaignSector" class="block text-sm font-medium text-neutral-300 mb-1">Sector</label>
                            <input
                                id="campaignSector"
                                v-model="campaignForm.sector"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Retail, Fashion, Technology, etc."
                            />
                            <p v-if="formErrors.sector" class="mt-1 text-sm text-red-500">{{ formErrors.sector }}</p>
                        </div>

                        <div class="mb-4">
                            <label for="campaignDomain" class="block text-sm font-medium text-neutral-300 mb-1">Domain</label>
                            <input
                                id="campaignDomain"
                                v-model="campaignForm.domain"
                                type="text"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="example.com"
                            />
                            <p v-if="formErrors.domain" class="mt-1 text-sm text-red-500">{{ formErrors.domain }}</p>
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

        <!-- Import Campaigns Dialog -->
        <div v-if="showImportDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-lg mx-auto">
                <div class="p-6 border-b border-neutral-700 flex justify-between items-center">
                    <h3 class="text-lg font-medium text-white">Import Advertisers</h3>
                    <button @click="showImportDialog = false" class="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6">
                    <div class="mb-6">
                        <label for="importNetwork" class="block text-sm font-medium text-neutral-300 mb-2">Select Affiliate Network</label>
                        <div v-if="loadingNetworks" class="flex items-center py-2">
                            <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                            <span class="ml-2 text-neutral-400 text-sm">Loading networks...</span>
                        </div>
                        <div v-else-if="availableNetworks.length === 0" class="py-2 text-sm text-neutral-400">
                            No networks available. Please create a network first.
                        </div>
                        <div v-else>
                            <select
                                id="importNetwork"
                                v-model="importNetworkId"
                                class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Select a network</option>
                                <option
                                    v-for="network in availableNetworks"
                                    :key="network.id"
                                    :value="network.id"
                                >
                                    {{ network.name }}
                                </option>
                            </select>
                        </div>
                        <p class="mt-2 text-sm text-neutral-400">Import campaigns from the selected affiliate network</p>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button
                            type="button"
                            @click="showImportDialog = false"
                            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="startImport"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            :disabled="!importNetworkId || importLoading"
                        >
                            <span v-if="importLoading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Importing...
                            </span>
                            <span v-else>
                                Start Import
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <DeleteDialog
            :show="showDeleteDialog"
            :item-name="campaignToDelete?.name"
            :loading="deleteLoading"
            message="Are you sure you want to delete the network campaign"
            warning-text="This action cannot be undone. The campaign will be removed from your system but will remain in the affiliate network."
            loading-text="Deleting..."
            @confirm="deleteCampaign"
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
import { useAffiliateClient } from '@cmmv/affiliate/admin/client'
import Pagination from '@cmmv/blog/admin/components/Pagination.vue'
import DeleteDialog from '@cmmv/blog/admin/components/DeleteDialog.vue'
import ToastNotification from '@cmmv/blog/admin/components/ToastNotification.vue'

const affiliateClient = useAffiliateClient()

const networkCampaigns = ref([])
const loading = ref(true)
const error = ref(null)

const availableNetworks = ref([])
const loadingNetworks = ref(false)

const showDialog = ref(false)
const isEditing = ref(false)
const campaignForm = ref({
    name: '',
    campaignId: '',
    network: '',
    status: 'Active',
    currencyCode: '',
    sector: '',
    domain: ''
})
const campaignToEdit = ref(null)
const formErrors = ref({})
const formLoading = ref(false)

const showDeleteDialog = ref(false)
const campaignToDelete = ref(null)
const deleteLoading = ref(false)

const showImportDialog = ref(false)
const importNetworkId = ref('')
const importLoading = ref(false)

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
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1
})

const showSearchDropdown = ref(false)
const searchInput = ref(null)

const loadNetworkCampaigns = async () => {
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
            apiFilters.searchField = 'name'
        }

        const response = await affiliateClient.campaignsNetworks.get(apiFilters)

        if (response && response.data) {
            networkCampaigns.value = response.data || []

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
            networkCampaigns.value = []
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
        console.error('Failed to load network campaigns:', err)
        loading.value = false
        error.value = err.message || 'Failed to load network campaigns'
        showNotification('error', 'Failed to load network campaigns')
    }
}

const loadNetworks = async () => {
    try {
        loadingNetworks.value = true

        const response = await affiliateClient.networks.get({
            limit: 100,
            sortBy: 'name',
            sort: 'asc'
        })

        if (response && response.data) {
            availableNetworks.value = response.data.filter(network => network.active !== false) || []
        } else {
            availableNetworks.value = []
        }

        loadingNetworks.value = false
    } catch (err) {
        console.error('Failed to load networks:', err)
        loadingNetworks.value = false
        showNotification('error', 'Failed to load available networks')
    }
}

// Refresh data
const refreshData = () => {
    loadNetworkCampaigns()
}

// Pagination methods
const handlePageChange = (newPage) => {
    filters.value.page = newPage;
}

// Watch for filter changes
watch(filters, () => {
    loadNetworkCampaigns()
}, { deep: true })

// Dialog methods
const openAddDialog = async () => {
    isEditing.value = false
    campaignForm.value = {
        name: '',
        campaignId: '',
        network: '',
        status: 'Active',
        currencyCode: '',
        sector: '',
        domain: ''
    }
    formErrors.value = {}
    showDialog.value = true

    if (availableNetworks.value.length === 0) {
        await loadNetworks()
    }
}

const openEditDialog = async (campaign) => {
    isEditing.value = true
    campaignToEdit.value = campaign

    campaignForm.value = {
        name: campaign.name,
        campaignId: campaign.campaignId || '',
        network: campaign.network || '',
        status: campaign.status || 'Active',
        currencyCode: campaign.currencyCode || '',
        sector: campaign.sector || '',
        domain: campaign.domain || ''
    }
    formErrors.value = {}
    showDialog.value = true

    if (availableNetworks.value.length === 0) {
        await loadNetworks()
    }
}

const closeDialog = () => {
    showDialog.value = false
    campaignForm.value = {
        name: '',
        campaignId: '',
        network: '',
        status: 'Active',
        currencyCode: '',
        sector: '',
        domain: ''
    }
    formErrors.value = {}
    campaignToEdit.value = null
}

// Save campaign
const saveCampaign = async () => {
    try {
        formLoading.value = true
        formErrors.value = {}

        // Validate
        if (!campaignForm.value.name.trim()) {
            formErrors.value.name = 'Campaign name is required'
            formLoading.value = false
            return
        }

        if (!campaignForm.value.campaignId.trim()) {
            formErrors.value.campaignId = 'Campaign ID is required'
            formLoading.value = false
            return
        }

        if (!campaignForm.value.network) {
            formErrors.value.network = 'Please select a network'
            formLoading.value = false
            return
        }

        const campaignData = {
            name: campaignForm.value.name.trim(),
            campaignId: campaignForm.value.campaignId.trim(),
            network: campaignForm.value.network,
            status: campaignForm.value.status,
            currencyCode: campaignForm.value.currencyCode?.trim() || null,
            sector: campaignForm.value.sector?.trim() || null,
            domain: campaignForm.value.domain?.trim() || null
        }

        if (isEditing.value && campaignToEdit.value) {
            await affiliateClient.campaignsNetworks.update(campaignToEdit.value.id, campaignData)
            showNotification('success', 'Network campaign updated successfully')
        } else {
            await affiliateClient.campaignsNetworks.insert(campaignData)
            showNotification('success', 'Network campaign created successfully')
        }

        formLoading.value = false
        closeDialog()
        refreshData()
    } catch (err) {
        formLoading.value = false

        if (err.response?.data?.errors)
            formErrors.value = err.response.data.errors
        else
            showNotification('error', err.message || 'Failed to save network campaign')
    }
}

const confirmDelete = (campaign) => {
    campaignToDelete.value = campaign
    showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
    showDeleteDialog.value = false
    campaignToDelete.value = null
}

const deleteCampaign = async () => {
    if (!campaignToDelete.value) return

    try {
        deleteLoading.value = true
        await affiliateClient.campaignsNetworks.delete(campaignToDelete.value.id)
        deleteLoading.value = false
        closeDeleteDialog()
        showNotification('success', 'Network campaign deleted successfully')
        refreshData()
    } catch (err) {
        deleteLoading.value = false
        console.error('Failed to delete network campaign:', err)
        showNotification('error', err.message || 'Failed to delete network campaign')
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

const getNetworkName = (networkId) => {
    const network = availableNetworks.value.find(n => n.id === networkId)
    return network ? network.name : 'Unknown Network'
}

const getStatusClass = (status) => {
    switch(status) {
        case 'Active':
            return 'bg-green-900 text-green-200 px-2 py-0.5 rounded text-xs'
        case 'Paused':
            return 'bg-yellow-900 text-yellow-200 px-2 py-0.5 rounded text-xs'
        case 'Pending':
            return 'bg-blue-900 text-blue-200 px-2 py-0.5 rounded text-xs'
        case 'Expired':
            return 'bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded text-xs'
        case 'Rejected':
            return 'bg-red-900 text-red-200 px-2 py-0.5 rounded text-xs'
        default:
            return 'bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded text-xs'
    }
}

// Import functions
const importCampaigns = async () => {
    importNetworkId.value = ''
    showImportDialog.value = true

    if (availableNetworks.value.length === 0) {
        await loadNetworks()
    }
}

const startImport = async () => {
    if (!importNetworkId.value) return

    try {
        importLoading.value = true

        // Call API to get network campaigns
        const response = await affiliateClient.campaignsNetworks.getNetworkCampaigns()

        if (response && response.success) {
            showNotification('success', `Successfully imported ${response.count || 0} campaigns`)
            showImportDialog.value = false
            refreshData()
        } else {
            showNotification('error', response.message || 'Failed to import campaigns')
        }

        importLoading.value = false
    } catch (err) {
        console.error('Failed to import campaigns:', err)
        showNotification('error', err.message || 'Failed to import campaigns')
        importLoading.value = false
    }
}

const toggleSearchDropdown = () => {
    showSearchDropdown.value = !showSearchDropdown.value
    if (showSearchDropdown.value) {
        setTimeout(() => {
            searchInput.value?.focus()
        }, 100)
    }
}

const clearSearch = () => {
    filters.value.search = ''
    showSearchDropdown.value = false
}

onMounted(() => {
    // Add click-outside handling for search dropdown
    document.addEventListener('click', (event) => {
        const target = event.target
        if (!target.closest('[data-search-toggle]') && !target.closest('.absolute') && showSearchDropdown.value) {
            showSearchDropdown.value = false
        }
    })

    loadNetworkCampaigns()
    loadNetworks()
})
</script>
