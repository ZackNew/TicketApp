export const useUploadImage = async (file: File, name: string) => {
  const config = useRuntimeConfig();

  const apiKey = config.public.imgbbApiKey;
  const formData = new FormData();

  formData.append("key", apiKey);
  formData.append("image", file);
  formData.append("name", name);

  try {
    const response = await $fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    return response;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
