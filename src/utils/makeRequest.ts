import axios from "axios";

const makeRequest = async <T>(
    url: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    options?: { data?: any; params?: any; token?: string, overrideHeaders?: Record<string, string> },
): Promise<T> => {
    const fullUrl = url;

    const headers = {
        session: options?.token ? options.token : "",
        "x-be-alias": "fairfax-county-mco",
        accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=UTF-8",
        "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    };

    const request = await axios({
        method,
        url: fullUrl,
        headers: options?.overrideHeaders ? options.overrideHeaders : headers,
        data: options?.data,
        params: options?.params,
    });

    return request.data;
};

export default makeRequest;
