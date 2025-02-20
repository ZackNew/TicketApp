export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  if (import.meta.client && user) {
    return navigateTo({
      path: "/dashboard",
    });
  }
});
