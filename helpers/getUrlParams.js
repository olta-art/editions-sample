export const getUrlParams = () => {
  const url = new URL(window.location.href)
  const contractAddress = url.searchParams.get("address")
  const editionNumber = url.searchParams.get("id")
  return {
    contractAddress,
    editionNumber
  }
}