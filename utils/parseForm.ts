import { NextRequest } from "next/server";

export const parseFormData = async (
  req: NextRequest
) => {
  const formData = await req.formData();

  return formData;
};