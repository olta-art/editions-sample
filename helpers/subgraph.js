import {createClient} from '@urql/core'

// An example of how to fetch from olta's editions subgraph

// Query the graph
const editionsSubgraphAPI = "http://127.0.0.1:8000/subgraphs/name/olta-art/edtions-auction-subgraph"

const client = createClient({
  url: editionsSubgraphAPI
})

export const fetchQuery = async (contractAddress) => {
  try{
    const result = await client.query(`
      query{
        tokenContract(id: "${contractAddress}") {
          tokens{
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