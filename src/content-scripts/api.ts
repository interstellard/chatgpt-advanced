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

    const pageOperatorMatches = query.match(/page:(\S+)/)
    let queryUrl: string

    if (pageOperatorMatches)
        queryUrl = pageOperatorMatches[1]

    let url: RequestInfo | URL
    if (queryUrl) {
        url = `https://ddg-webapp-aagd.vercel.app/url_to_text?url=${queryUrl}`
    } else {
        const searchParams = new URLSearchParams()
        searchParams.set('q', query)
        searchParams.set('max_results', numResults.toString())
        if (timePeriod) searchParams.set('time', timePeriod)
        if (region) searchParams.set('region', region)

        url = `https://ddg-webapp-aagd.vercel.app/search?${searchParams.toString()}`
    }

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
