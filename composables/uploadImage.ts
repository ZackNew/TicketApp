export const useUploadImage = async (file: File, name: string) => {
  const apiKey = "314d4ew3r437f25ede2333rc582a3230862547523fer6a84630";
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
