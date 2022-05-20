import {createClient} from '@urql/core'

const editionsSubgraphAPI = "https://api.thegraph.com/subgraphs/name/olta-art/olta-editions-mumbai"

const client = createClient({
  url: editionsSubgraphAPI
})

// The query used in main.js
export const fetchTokens = async (contractAddress) => {
  try{
    const result = await client.query(`
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
    `
    ).toPromise()
    return result.data.tokenContract.tokens
  } catch {
    console.error("Error")
    return []
  }
}


/* ----------------------------------------------------------------------- */

// EXAMPLES

// fetch a specific token
export const fetchToken = async (contractAddress, id) => {
  try{
    const result = await client.query(`
      query{
        token(id: "${contractAddress}-${id}") {
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
    `
    ).toPromise()
    return result.data.token
  } catch {
    console.error("Error")
    return []
  }
}

// fetch a specific token from seed
export const fetchTokenFromSeed = async (contractAddress, seed) => {
  try{
    const result = await client.query(`
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
    `
    ).toPromise()
    return result.data.tokens[0]
  } catch {
    console.error("Error")
    return []
  }
}

// fetch token contract
export const fetchTokenContract = async (contractAddress) => {
  try{
    const result = await client.query(`
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
    `
    ).toPromise()
    return result.data.tokenContract
  } catch {
    console.error("Error")
    return []
  }
}

// fetch user
// collection = tokens[]
// creations = tokenContracts[]
export const fetchUser = async (userId) => {
  try{
    const result = await client.query(`
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
    `
    ).toPromise()
    return result.data.user
  } catch {
    console.error("Error")
    return []
  }
}