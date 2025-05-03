<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white">Backup</h1>
            <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button @click="refreshData" class="px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded-md transition-colors flex items-center">
                    <i class="fas fa-sync-alt h-3.5 w-3.5 mr-1"></i>
                    Refresh
                </button>
                <button
                    @click="createBackup"
                    class="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors flex items-center"
                    :disabled="isCreatingBackup"
                >
                    <span v-if="isCreatingBackup" class="flex items-center">
                        <svg class="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                    </span>
                    <span v-else class="flex items-center">
                        <i class="fas fa-save h-3.5 w-3.5 mr-1"></i>
                        Create Backup
                    </span>
                </button>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-neutral-800 rounded-lg p-12 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-neutral-400">Loading backups...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-neutral-800 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-neutral-300 mb-2">Failed to load backups</p>
            <p class="text-neutral-400 text-sm mb-4">{{ error }}</p>
            <button @click="refreshData" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                Try Again
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="backups.length === 0" class="bg-neutral-800 rounded-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p class="text-neutral-300 mb-2">No backups found</p>
            <p class="text-neutral-400 text-sm mb-4">Create your first backup to protect your data</p>
            <button @click="createBackup" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Create Backup
            </button>
        </div>

        <!-- Backups table -->
        <div v-else class="bg-neutral-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-neutral-700">
                    <thead class="bg-neutral-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Filename
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Date Created
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                                Size
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-neutral-300 uppercase tracking-wider w-24">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-neutral-800 divide-y divide-neutral-700">
                        <tr v-for="backup in backups" :key="backup.filename" class="hover:bg-neutral-750">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ backup.filename }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ formatDate(backup.created) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                {{ backup.formattedSize || formatFileSize(backup.size) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button
                                        @click="downloadBackup(backup)"
                                        title="Download"
                                        class="text-neutral-400 hover:text-blue-500 transition-colors"
                                        :disabled="backup.isDownloading"
                                    >
                                        <i v-if="backup.isDownloading" class="fas fa-circle-notch fa-spin h-5 w-5 text-blue-500"></i>
                                        <i v-else class="fas fa-download h-5 w-5"></i>
                                    </button>
                                    <button
                                        @click="confirmDelete(backup)"
                                        title="Delete"
                                        class="text-neutral-400 hover:text-red-500 transition-colors"
                                        :disabled="backup.isDeleting"
                                    >
                                        <i v-if="backup.isDeleting" class="fas fa-circle-notch fa-spin h-5 w-5 text-red-500"></i>
                                        <i v-else class="fas fa-trash h-5 w-5"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Restore Confirmation Dialog -->
        <div v-if="showRestoreDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Confirm Restore</h3>
                </div>
                <div class="p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-neutral-300 mb-2 text-center">Are you sure you want to restore this backup?</p>
                    <p class="text-neutral-400 text-sm mb-6 text-center">
                        Restoring will replace all current data with the data from this backup. This action cannot be undone.
                    </p>
                    <p class="bg-yellow-900/40 border border-yellow-700 rounded-md p-3 text-yellow-200 text-sm mb-6">
                        <strong>Warning:</strong> Restoring a backup will log you out and may require a server restart.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="closeRestoreDialog" class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                            Cancel
                        </button>
                        <button @click="restoreBackup" class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors" :disabled="isRestoring">
                            <span v-if="isRestoring" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Restoring...
                            </span>
                            <span v-else>Restore</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <div v-if="showDeleteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" style="backdrop-filter: blur(4px);">
            <div class="bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div class="p-6 border-b border-neutral-700">
                    <h3 class="text-lg font-medium text-white">Confirm Delete</h3>
                </div>
                <div class="p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <p class="text-neutral-300 mb-2 text-center">Are you sure you want to delete this backup?</p>
                    <p class="text-neutral-400 text-sm mb-6 text-center">
                        This action cannot be undone. The backup file will be permanently removed.
                    </p>

                    <div class="flex justify-end space-x-3">
                        <button @click="closeDeleteDialog" class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md transition-colors">
                            Cancel
                        </button>
                        <button @click="deleteBackup" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors" :disabled="isDeleting">
                            <span v-if="isDeleting" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </span>
                            <span v-else>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

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
import { ref, onMounted } from 'vue';
import { useAdminClient } from '@cmmv/blog/admin/client';
import ToastNotification from '@cmmv/blog/admin/components/ToastNotification.vue';

const adminClient = useAdminClient();
const backups = ref([]);
const loading = ref(true);
const error = ref(null);
const isCreatingBackup = ref(false);
const creationError = ref(null);
const showRestoreDialog = ref(false);
const selectedBackup = ref(null);
const isRestoring = ref(false);
const showDeleteDialog = ref(false);
const isDeleting = ref(false);

const notification = ref({
    show: false,
    type: 'success',
    message: '',
    duration: 3000
});

async function loadBackups() {
    try {
        loading.value = true;
        error.value = null;
        const response = await adminClient.backup.getBackups();

        let backupList = [];
        if (response && response.data)
            backupList = Object.values(response.data);

        backups.value = backupList;
        backups.value = backups.value.map(backup => ({
            ...backup,
            isDownloading: false,
            isRestoring: false,
            isDeleting: false
        }));

        loading.value = false;
    } catch (err) {
        console.error('Failed to load backups:', err);
        loading.value = false;
        error.value = err.message || 'Failed to load backups';
        showNotification('error', 'Failed to load backups');
    }
}

function refreshData() {
    loadBackups();
}

async function createBackup() {
    try {
        isCreatingBackup.value = true;
        creationError.value = null;

        const response = await adminClient.backup.create();

        if (response && response.status === 200) {
            showNotification('success', 'Backup created successfully');
            // Refresh the backup list to show the newly created backup
            refreshData();
        } else {
            throw new Error('Failed to create backup');
        }
    } catch (err) {
        console.error('Failed to create backup:', err);
        isCreatingBackup.value = false;
        creationError.value = err.message || 'Failed to create backup';
        showNotification('error', 'Failed to create backup');
    } finally {
        isCreatingBackup.value = false;
    }
}

function downloadBackup(backup) {
    const backupIndex = backups.value.findIndex(b => b.filename === backup.filename);

    if (backupIndex !== -1)
        backups.value[backupIndex].isDownloading = true;

    const downloadUrl = `${window.location.origin}/api/blog/backup/download?filename=${encodeURIComponent(backup.filename)}`;
    window.open(downloadUrl, '_blank');

    setTimeout(() => {
        const index = backups.value.findIndex(b => b.filename === backup.filename);
        if (index !== -1) {
            backups.value[index].isDownloading = false;
        }
    }, 1000);
}

function confirmRestore(backup) {
    selectedBackup.value = backup;
    showRestoreDialog.value = true;
}

function closeRestoreDialog() {
    showRestoreDialog.value = false;
    selectedBackup.value = null;
}

async function restoreBackup() {
    if (!selectedBackup.value) return;

    try {
        isRestoring.value = true;

        const backupIndex = backups.value.findIndex(b => b.filename === selectedBackup.value.filename);

        if (backupIndex !== -1)
            backups.value[backupIndex].isRestoring = true;

        const response = await adminClient.backup.restore(selectedBackup.value.filename);

        if (response && response.status === 200) {
            showNotification('success', 'Backup restored successfully. You will be logged out.');

            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } else {
            throw new Error('Failed to restore backup');
        }
    } catch (err) {
        console.error('Failed to restore backup:', err);
        showNotification('error', err.message || 'Failed to restore backup');

        const backupIndex = backups.value.findIndex(b => b.filename === selectedBackup.value?.filename);

        if (backupIndex !== -1)
            backups.value[backupIndex].isRestoring = false;
    } finally {
        isRestoring.value = false;
        closeRestoreDialog();
    }
}

function confirmDelete(backup) {
    selectedBackup.value = backup;
    showDeleteDialog.value = true;
}

function closeDeleteDialog() {
    showDeleteDialog.value = false;
    selectedBackup.value = null;
}

async function deleteBackup() {
    if (!selectedBackup.value) return;

    try {
        isDeleting.value = true;

        const backupIndex = backups.value.findIndex(b => b.filename === selectedBackup.value.filename);

        if (backupIndex !== -1)
            backups.value[backupIndex].isDeleting = true;

        const response = await adminClient.backup.delete(selectedBackup.value.filename);

        if (response && response.status === 200) {
            showNotification('success', 'Backup deleted successfully');

            backups.value = backups.value.filter(b => b.filename !== selectedBackup.value.filename);
        } else {
            throw new Error('Failed to delete backup');
        }
    } catch (err) {
        console.error('Failed to delete backup:', err);
        showNotification('error', err.message || 'Failed to delete backup');

        const backupIndex = backups.value.findIndex(b => b.filename === selectedBackup.value?.filename);

        if (backupIndex !== -1)
            backups.value[backupIndex].isDeleting = false;
    } finally {
        isDeleting.value = false;
        closeDeleteDialog();
    }
}

function showNotification(type, message) {
    notification.value = {
        show: true,
        type,
        message,
        duration: 3000
    };
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

onMounted(() => {
    loadBackups();
});
</script>
