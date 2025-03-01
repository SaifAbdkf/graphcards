export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function get<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`);
    const data: T[] = await response.json();
    return data;
  } catch (error) {
    console.error("GET: Error fetching data:", error);
    throw error;
  }
}

export async function post<T>(
  endpoint: string,
  data: T
): Promise<T & { _id: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const formattedResponse: T & { _id: string } = await response.json();
    return formattedResponse;
  } catch (error) {
    console.error("POST: Error fetching data:", error);
    throw error;
  }
}
