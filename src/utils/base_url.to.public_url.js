export const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    
    // Split the URL by the standard Cloudinary path component 'upload/' or 'upload/v...'
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;

    // The second part contains the version number and the public ID/filename
    const pathWithVersion = parts[1];
    
    // Remove the version number (e.g., v1678886400/) if present
    const pathWithoutVersion = pathWithVersion.substring(pathWithVersion.indexOf('/') + 1);

    // Get the part before the file extension (e.g., ".jpg")
    const publicIdWithExtension = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'));
    
    return publicIdWithExtension;
};