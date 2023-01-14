export interface SearchResult {
    body: string
    href: string
    title: string
}

export async function apiSearch(query: string, numResults: number, timePeriod: string, region: string): Promise<SearchResult[]> {
    let url = `https://ddg-webapp-aagd.vercel.app/search?max_results=${numResults}&q=${query}`
    if (timePeriod !== "") {
        url += `&time=${timePeriod}`
    }
    if (region !== "") {
        url += `&region=${region}`
    }

    const response = await fetch(url)
    const data = await response.json();
    const results = data.map((item: { body: string; href: string; title: string }) => {
        return {
            body: item.body,
            href: item.href,
            title: item.title
        }
    })
    return results;
}
