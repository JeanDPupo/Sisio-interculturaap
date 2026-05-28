export const formatDate = (dateString, locale = 'es') => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString(locale, options);
};
export const formatDateTime = (dateString, locale = 'es') => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString(locale, options);
};
export const formatTimeAgo = (dateString, locale = 'es') => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)
        return 'hace unos segundos';
    if (diffMins < 60)
        return `hace ${diffMins}m`;
    if (diffHours < 24)
        return `hace ${diffHours}h`;
    if (diffDays < 7)
        return `hace ${diffDays}d`;
    return formatDate(dateString, locale);
};
export const formatCoordinates = (latitude, longitude) => {
    return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
};
export const formatConfidence = (confidence) => {
    return `${(confidence * 100).toFixed(1)}%`;
};
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength)
        return text;
    return `${text.substring(0, maxLength)}...`;
};
export const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
export const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
};
//# sourceMappingURL=formatting.js.map