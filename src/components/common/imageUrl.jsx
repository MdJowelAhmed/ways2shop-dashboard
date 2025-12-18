export const getImageUrl = (path) => {
  if (!path) {
    return "/assets/image4.png"; // default image
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "api.ways2shop.com";
    // const baseUrl = "http://10.10.7.51:5000";
    return `${baseUrl}/${path}`;
  }
};
