import { fetchQuery, generateSeededRandomness, getUrlParams } from "./helper.js"

// Some defaults to experiment with.
const EDITIONS_SUBGRAPH_API = "http://127.0.0.1:8000/subgraphs/name/olta-art/editions-auction-subgraph"
const EDITION_NO = 1
const NFT_CONTRACT_ADDRESS = "0x8f66a247c29a2e4b32da14d94ee96fcae4964370"

const params = getUrlParams()
const contractAddress = params.contractAddress ?? NFT_CONTRACT_ADDRESS
const editionNumber = parseInt(params.editionNumber, 10) ?? EDITION_NO

const tokens = fetchQuery(EDITIONS_SUBGRAPH_API, contractAddress)
  .then(d => d)
  .catch((e) => {
    console.log(e)
  })

new p5(dots(tokens), document.getElementById("app"))

function dots(data = []) {
  const rand = generateSeededRandomness("not-so-random-seed-phrase", editionNumber)
  const cols = 10
  const rows = 10

  return (p) => {
    const background = p.color(rand() * 255, rand() * 255, rand() * 255)

    p.setup = function setup() {
      p.createCanvas(p.windowWidth, p.windowHeight)
    }

    p.draw = function draw() {
      const gridWidth = p.windowWidth * 0.75
      const gridHeight = p.windowHeight * 0.75

      const cellWidth = gridWidth / rows
      const cellHeight = gridHeight / cols

      p.background(background)

      // Center the grid.
      p.push()
      p.translate((p.windowWidth / 2) - (gridWidth / 2), (p.windowHeight / 2) - (gridHeight / 2))

      // Draw grid border.
      p.stroke(255, 255, 255, 255)
      p.noFill()
      p.rect(0, 0, gridWidth, gridHeight)

      let count = 0

      // Draw cells.
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let isThisEdition = (editionNumber === count + 1)

          p.noFill()

          if (data[count]) {
            // Display white if minted.
            p.fill(127)

            // Display red if burnt.
            if (data[count].owner.id === "0x0000000000000000000000000000000000000000") {
              p.fill(127, 0, 0)
            }
          }

          count++

          // Render the grid
          p.push()
          p.translate(j * cellWidth, i * cellHeight)
          p.rect(0, 0, cellWidth, cellHeight)

          if (isThisEdition) {
            p.fill(0, 0, 0)
            p.ellipse(cellWidth / 2, cellHeight / 2, (cellWidth / 2) * 0.8, (cellWidth / 2) * 0.8)
          }
          p.pop()
        }
      }

      p.pop()
    }
  }
}
