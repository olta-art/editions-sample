import {createClient} from '@urql/core'

// An example of how to fetch from olta's editions subgraph

// Query the graph
const editionsSubgraphAPI = "https://api.thegraph.com/subgraphs/name/olta-art/olta-editions-mumbai"

const client = createClient({
  url: editionsSubgraphAPI
})

export const fetchQuery = async (contractAddress) => {
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