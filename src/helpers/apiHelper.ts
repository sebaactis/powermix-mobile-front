type ApiError = {
    message: string;
    fields?: Record<string, string> | null;
} | null;

export type ApiResponse<T = unknown> = {
    success: boolean;
    data: T | null;
    error: ApiError;
};

export async function ApiHelper<T = unknown>(
    url: string,
    method: string = "GET",
    body?: object,
    extraHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
    try {
        const fetchData = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", ...(extraHeaders || {}) },
            body: body ? JSON.stringify(body) : undefined,
        });


        const json = (await fetchData.json().catch(() => null)) as
            | Partial<ApiResponse<T>>
            | null;


        if (json && typeof json.success === "boolean") {
            return {
                success: json.success,
                data: (json.data as T) ?? null,
                error: (json.error as ApiError) ?? null,
            };
        }

        return {
            success: fetchData.ok,
            data: (json as unknown as T) ?? null,
            error: !fetchData.ok
                ? {
                    message: `HTTP error ${fetchData.status}`,
                    fields: null,
                }
                : null,
        };
    } catch {
        return {
            success: false,
            data: null,
            error: {
                message: "Error de red al llamar a la API",
                fields: null,
            },
        };
    }
}
