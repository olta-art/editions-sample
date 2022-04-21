export function getUrlParams(href = self.location.href) {
  const url = new URL(href)

  const contractAddress = url.searchParams.get("address")
  const editionNumber = url.searchParams.get("id")

  return {
    contractAddress,
    editionNumber,
  }
}

export async function fetchQuery(url, id) {
  const download = downloader(20000)
  const options = {
    body: JSON.stringify({ query: `
      query {
        tokenContract(id: "${id}") {
          tokens {
            editionNumber
            owner {
              id
            }
          }
        }
      }`
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
  }

  try {
    const response = await download(url, options)

    response?.errors?.forEach((e) => {
      throw new Error(e.message)
    })

    return response?.data?.tokenContract?.tokens
  } catch (e) {
    throw e
  }
}

// Seed + rand!
export function generateSeededRandomness(seedPhrase, editionNumber) {
  const seed = xmur3(`${seedPhrase}-${editionNumber}`)
  const rand = sfc32(seed(), seed(), seed(), seed())

  return rand
}

// Seed!
function xmur3(str) {
  let h = 1779033703 ^ str.length

  for (let i = 0, l = str.length; i < l; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = h << 13 | h >>> 19
  }

  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)

    return (h ^= h >>> 16) >>> 0
  }
}

// Rand!
function sfc32(a, b, c, d) {
  return function() {
    a |= 0
    b |= 0
    c |= 0
    d |= 0

    const t = (a + b | 0) + d | 0

    d = d + 1 | 0
    a = b ^ b >>> 9
    b = c + (c << 3) | 0
    c = c << 21 | c >>> 11
    c = c + t | 0

    return (t >>> 0) / 4294967296
  }
}

export function downloader(timeout = 100 * 1000) {
  return async (url = "", options = {}) => {
    // Guard against unresponsive calls.
    const controller = new AbortController()

    const timer = setTimeout(() => {
      clearTimeout(timer)
      controller.abort()
    }, timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        ...options,
      })

      const result = await response.json()

      if (response.ok) {
        return result
      } else {
        const { message } = result.errors.pop()

        throw new Error(message)
      }
    } catch (e) {
      // Forward to caller.
      throw e
    }
  }
}
