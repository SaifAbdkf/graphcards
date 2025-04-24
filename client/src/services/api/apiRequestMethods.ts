export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getRequest(endpoint: string) {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET: Error fetching data:", error);
    throw error;
  }
}

export async function postRequest<T>(endpoint: string, data: T) {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const formattedResponse = await response.json();
    return formattedResponse;
  } catch (error) {
    console.error("POST: Error fetching data:", error);
    throw error;
  }
}

export async function deleteRequest(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error(`DELETE: Failed with status ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("POST failed", error);
    return false;
  }
}

export async function patchRequest<T>(endpoint: string, data: T) {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error(`PATCH: Failed with status ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("PATCH failed", error);
    return false;
  }
}
