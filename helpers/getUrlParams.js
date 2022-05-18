export const getUrlParams = () => {
  const url = new URL(window.location.href)
  const contractAddress = url.searchParams.get("address")
  const editionNumber = url.searchParams.get("id")
  const seed = url.searchParams.get("seed")

  // log an error if no url params are found
  if(!contractAddress || !editionNumber){
    console.error("Url params not found :( if you are testing locally try visiting:", "http://localhost:3000/?id=1&seed=5&address=0x8f66a247c29a2e4b32da14d94ee96fcae4964370")
  }

  return {
    contractAddress,
    editionNumber,
    seed
  }
}