export const adminMiddleware = (
  user: any
) => {
  if (user.role !== "admin") {
    return {
      success: false,
      message: "Access denied",
    };
  }

  return {
    success: true,
  };
};