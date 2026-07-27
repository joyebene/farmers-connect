export const farmerMiddleware = (
  user: any
) => {
  if (user.role !== "farmer") {
    return {
      success: false,
      message:
        "Only farmers can perform this action",
    };
  }

  return {
    success: true,
  };
};