export interface ConvertedLinks {
  embedLink: string;
  downloadLink: string;
  viewLink: string;
  isYouTube: boolean;
}

export function convertLinks(originalLink: string): ConvertedLinks {
  const isYouTube = originalLink.includes('youtube.com') || originalLink.includes('youtu.be');
  
  if (isYouTube) {
    return {
      embedLink: convertYouTubeToEmbed(originalLink),
      downloadLink: '', // No download for YouTube
      viewLink: originalLink,
      isYouTube: true,
    };
  }
  
  // Google Drive links
  return {
    embedLink: convertGoogleDriveToEmbed(originalLink),
    downloadLink: convertGoogleDriveToDownload(originalLink),
    viewLink: originalLink,
    isYouTube: false,
  };
}

function convertYouTubeToEmbed(url: string): string {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}`;
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function convertGoogleDriveToEmbed(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function convertGoogleDriveToDownload(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function extractGoogleDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}
