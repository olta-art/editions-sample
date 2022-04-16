import './style.css'
import p5 from 'p5'
import {
  getUrlParams,
  generateSeededRandomness,
  fetchQuery
} from './helpers'

;(async () => {

  // http://localhost:3000/?id=1&address=0x8f66a247c29a2e4b32da14d94ee96fcae4964370
  // const NFTContractAddress = "0x8f66a247c29a2e4b32da14d94ee96fcae4964370"
  // const editionNumber = 1

  const {contractAddress, editionNumber} = getUrlParams()

  let tokens = await fetchQuery(contractAddress)

  if(!contractAddress || !editionNumber){
    console.log("Check search params")
  }

  const seededRandom = generateSeededRandomness("not-so-random-seed-phrase", editionNumber)

  const cols = 10
  const rows = 10

  new p5(p => {
    const background = p.color(seededRandom()* 255, seededRandom() * 255, seededRandom()* 255)

    p.setup = function setup() {
      p.createCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function draw() {
      const gridWidth =  p.windowWidth * 0.75
      const gridHeight = p.windowHeight * 0.75

      const cellWidth = gridWidth/rows
      const cellHeight = gridHeight/cols

      p.background(background)

      // center the grid
      p.push()
      p.translate((p.windowWidth/2) - (gridWidth/2), (p.windowHeight/2) - (gridHeight/2))

      // draw grid border
      p.stroke(255, 255, 255, 255)
      p.noFill()
      p.rect(0, 0, gridWidth, gridHeight)

      let count = 0
      // draw cells
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

          let isThisEdition = (editionNumber == count + 1)

          p.noFill()
          if(tokens[count]){
            // display white if minted
            p.fill(127)

            // display red if burnt
            if(tokens[count].owner.id === "0x0000000000000000000000000000000000000000") p.fill(127, 0, 0)
          }
          // increment
          count++

          // render the grid
          p.push()
          p.translate(j * cellWidth, i*cellHeight)
          p.rect(0, 0, cellWidth, cellHeight)
          if(isThisEdition) {
            p.fill(0,0,0)
            p.ellipse(cellWidth/2, cellHeight/2, (cellWidth/2) * 0.8, (cellWidth/2) * 0.8)
          }
          p.pop()
        }
      }

      p.pop()
    }
  }, document.getElementById('app'))
})()
