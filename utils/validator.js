export function validateString(str, maxLen = 4000) {
  if (typeof str !== 'string' || str.trim().length === 0) return false;
  if (str.length > maxLen) return false;
  return true;
}

export function validateImageFile(file) {
  // grammY provides file info; we accept any image/* mime type
  return file.mime_type?.startsWith('image/');
}
