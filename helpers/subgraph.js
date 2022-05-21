const editionsSubgraphAPI = "https://api.thegraph.com/subgraphs/name/olta-art/olta-editions-mumbai"

// The query used in main.js
export const fetchTokens = async (contractAddress) => {
  try{
    const result = await fetchQuery(editionsSubgraphAPI, `
      query{
        tokenContract(id: "${contractAddress}") {
          tokens{
            seed
            editionNumber
            owner{
              id
            }
          }
        }
      }
    `)

    return result.tokenContract.tokens
  } catch {
    console.error("Error")
    return []
  }
}


/* ----------------------------------------------------------------------- */

// EXAMPLES

// fetch a specific token
export const fetchToken = async (contractAddress, editionNumber) => {
  try{
    const result = await fetchQuery(editionsSubgraphAPI, `
      query{
        token(id: "${contractAddress}-${editionNumber}") {
          tokenURI
          seed
          id
          editionNumber
          createdAtTransactionHash
          createdAtTimestamp
          createdAtBlockNumber
          burnedAtTimeStamp
          burnedAtBlockNumber
          owner {
            id
          }
          prevOwner {
            id
          }
          transfers {
            from {
              id
            }
            to {
              id
            }
          }
        }
      }
    `)

    return result.token
  } catch {
    console.error("Error")
    return []
  }
}

// fetch a specific token from seed
export const fetchTokenFromSeed = async (contractAddress, seed) => {
  try {
    const result = await fetchQuery(editionsSubgraphAPI, `
      query{
        tokens(where: {tokenContract: "${contractAddress}" seed: "${seed}"}) {
          tokenURI
          seed
          id
          editionNumber
          createdAtTransactionHash
          createdAtTimestamp
          createdAtBlockNumber
          burnedAtTimeStamp
          burnedAtBlockNumber
          owner {
            id
          }
          prevOwner {
            id
          }
          transfers {
            from {
              id
            }
            to {
              id
            }
          }
        }
      }
    `)

    return result.tokens[0]
  } catch {
    console.error("Error")
    return []
  }
}

// fetch token contract
export const fetchTokenContract = async (contractAddress) => {
  try {
    const result = await fetchQuery(editionsSubgraphAPI, `
      query{
        tokenContract(id: "${contractAddress}") {
        createdAtBlockNumber
        createdAtTimestamp
        creator {
          id
        }
        creatorRoyaltyBPS
        description
        editionSize
        id
        implementation
        lastAddedVersion {
          createdAtBlockNumber
          createdAtTimestamp
          id
          label
          animation {
            url
            hash
          }
          image {
            url
            hash
          }
        }
        name
        tokenContractId
        totalBurned
        totalMinted
        totalSupply
        tokens {
          id
        }
      }
    `)

    return result.tokenContract
  } catch {
    console.error("Error")
    return []
  }
}

// fetch user
// collection = tokens[]
// creations = tokenContracts[]
export const fetchUser = async (userId) => {
  try {
    const result = await fetchQuery(editionsSubgraphAPI, `
      query{
        user(id:"${userId}") {
        collection{
          id
          seed
          editionNumber
        }
        creations {
          id
          editionSize
          name
          description
        }
      }
    `)

    return result.user
  } catch {
    console.error("Error")
    return []
  }
}

export async function fetchQuery(url, query) {
  const download = downloader(20000)
  const options = {
    body: JSON.stringify({ query }),
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

    return response?.data
  } catch (e) {
    throw e
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
