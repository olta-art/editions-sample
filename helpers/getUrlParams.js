export const getUrlParams = () => {
  const url = new URL(window.location.href)
  const contractAddress = url.searchParams.get("address")
  const editionNumber = url.searchParams.get("id")
  const seed = url.searchParams.get("seed")
  return {
    contractAddress,
    editionNumber,
    seed
  }
}