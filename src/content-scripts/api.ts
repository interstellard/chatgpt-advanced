export interface SearchResult {
    body: string
    href: string
    title: string
}

export async function apiSearch(query: string, numResults: number, timePeriod: string, region: string): Promise<SearchResult[]> {
    const url = `https://ddg-webapp-aagd.vercel.app/search?`
        + `max_results=${numResults}`
        + `&q=${query}`
        + (timePeriod ? `&time=${timePeriod}` : "")
        + (region ? `&region=${region}` : "")

    const response = await fetch(url)
    const results = await response.json()
    return results.map((result: any) => {
        return {
            body: result.body,
            href: result.href,
            title: result.title
        }
    })
}