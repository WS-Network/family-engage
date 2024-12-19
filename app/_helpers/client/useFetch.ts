import { useRouter } from "next/navigation";

export function useFetch() {
  const router = useRouter();

  return {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE"),
  };

  function request(method: string) {
    return (url: string, body?: any) => {
      const requestOptions: any = {
        method,
        headers: { "Content-Type": "application/json" },
      };
  
      if (method !== "GET" && body) {
        if (method === "DELETE") {
          // Ensure query parameters are appended correctly
          url += "?" + new URLSearchParams(body).toString();
        } else {
          requestOptions.body = JSON.stringify(body);
        }
      }
  
      return fetch(url, requestOptions).then(handleResponse);
    };
  }
  

  async function handleResponse(response: any) {
    const isJson = response.headers?.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/account/login");
      }

      const error = {
        status: response.status,
        statusText: response.statusText,
        message: data?.message || response.statusText,
        body: data,
      };
      console.error("API Error:", error);
      return Promise.reject(error);
    }

    return data;
  }
}
