export interface SearchResult {
    body: string
    href: string
    title: string
}

export async function apiSearch(query: string, numResults: number, timePeriod: string, region: string): Promise<SearchResult[]> {

    const headers = new Headers({
        Origin: "https://chat.openai.com",
        "Content-Type": "application/json",
    })

    let url = `https://ddg-webapp-aagd.vercel.app/search?`
        + `max_results=${numResults}`
        + `&q=${query}`
        + (timePeriod ? `&time=${timePeriod}` : "")
        + (region ? `&region=${region}` : "")

    const response = await fetch(url, {
        method: "GET",
        headers,
    })
    const results = await response.json()
    return results.map((result: any) => {
        return {
            body: result.body,
            href: result.href,
            title: result.title
        }
    })
}
