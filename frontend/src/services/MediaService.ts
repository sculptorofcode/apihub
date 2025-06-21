import { API_BASE_URL, EXTERNAL_API_BASE_URL } from '../config';

interface UploadData {
    content?: string;
    visibility?: 'public' | 'friends' | 'private';
    name?: string;
    title?: string;
    location?: string;
}

/**
 * MediaService for handling media uploads and retrieval
 */
class MediaService {
    /**
     * Upload media to the server
     * @param {File} file - The file to upload
     * @param {UploadData} data - Additional data for the post
     * @returns {Promise} - Promise with the response data
     */
    async uploadMedia(file: File, data: UploadData = {}) {
        try {
            const formData = new FormData();
            formData.append('media', file);
            formData.append('content', data.content || '');
            formData.append('visibility', data.visibility || 'public');
            formData.append('name', data.name || file.name);
            formData.append('title', data.title || 'New Upload');
            
            if (data.location) {
                formData.append('location', data.location);
            }

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload media');
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading media:', error);
            throw error;
        }
    }    /**
     * Upload media using external API
     * @param {File} file - The file to upload
     * @param {UploadData} data - Additional data for the post
     * @returns {Promise} - Promise with the response data
     */
    async uploadMediaExternal(file: File, data: UploadData = {}) {
        try {
            const formData = new FormData();
            formData.append('media', file);
            formData.append('content', data.content || '');
            formData.append('visibility', data.visibility || 'public');
            formData.append('name', data.name || file.name);
            formData.append('title', data.title || 'New Upload');
            
            if (data.location) {
                formData.append('location', data.location);
            }

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload media');
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading media:', error);
            throw error;
        }
    }

    /**
     * Get user's uploaded images
     * @returns {Promise} - Promise with the response data
     */
    async getUserImages() {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/api/media/images`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to get user images');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting user images:', error);
            throw error;
        }
    }
}

export default new MediaService();
