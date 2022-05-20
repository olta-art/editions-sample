import {createClient} from '@urql/core'

const editionsSubgraphAPI = "https://api.thegraph.com/subgraphs/name/olta-art/olta-editions-mumbai"

const client = createClient({
  url: editionsSubgraphAPI
})

// The query used in main.js
export const fetchTokenContract = async (contractAddress) => {
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