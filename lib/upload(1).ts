export async function uploadImageToFreeImageHost(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image via proxy');
  }

  const data = await response.json();
  if (data.status_code !== 200) {
    throw new Error(data.status_txt || 'Failed to upload image');
  }

  return data.image.url;
}
