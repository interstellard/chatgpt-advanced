import cheerio from 'cheerio'
import Browser from 'webextension-polyfill'


const BASE_URL = 'https://html.duckduckgo.com'

export interface SearchRequest {
    query: string
    timerange: string
    region: string
}

export interface SearchResponse {
    status: number
    html: string
    url: string
}

export interface SearchResult {
    title: string
    body: string
    url: string
}

export async function getHtml({ query, timerange, region }: SearchRequest): Promise<SearchResponse> {

    const formData = new URLSearchParams({
        q: query,
        df: timerange,
        kl: region,
    })

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/html,application/xhtml+xml,application/xmlq=0.9,image/avif,image/webp,image/apng,*/*q=0.8,application/signed-exchangev=b3q=0.7',
        AcceptEncoding: 'gzip, deflate, br',
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        // Cookie: `kl=${search.region} df=${search.timerange}`,
    }

    const response = await fetch(`${BASE_URL}/html/`, {
        method: 'POST',
        headers,
        body: formData.toString(),
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    return { status: response.status, html: await response.text(), url: response.url }
}

function htmlToSearchResults(html: string, numResults: number): SearchResult[] {

    const $ = cheerio.load(html)
    const zciWrapper = $('.zci-wrapper')

    const zciResult = zciWrapper.length > 0 && {
        title: $('.zci__heading > a').text(),
        body: $('#zero_click_abstract').text().trim(),
        url: $('.zci__heading > a').attr('href') || '',
    }

    const resultItems = $('.result__body')
        .toArray()
        .slice(0, numResults)
        .map((item) => ({
            title: $(item).find('.result__a').text(),
            body: $(item).find('.result__snippet').text().trim(),
            url: $(item).find('.result__a').attr('href') ?? '',
        }))
        .filter((item) => item.body.length > 0)

    return [...(zciResult ? [zciResult] : []), ...resultItems]
}

export async function webSearch(search: SearchRequest, numResults: number): Promise<SearchResult[]> {
    const response: SearchResponse = await Browser.runtime.sendMessage({
        type: "get_search_results",
        search
    })

    let results: SearchResult[]
    if (response.url === `${BASE_URL}/html/`) {
        results = htmlToSearchResults(response.html, numResults)
    } else {
        const result = await Browser.runtime.sendMessage({
            type: "get_webpage_text",
            url: response.url
        })

        return [{
            title: result.title,
            url: response.url,
            body: result.text
        }]
    }

    return results
}
