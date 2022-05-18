import './style.css'
import p5 from 'p5'
import {
  getUrlParams,
  generateSeededRandomness,
  fetchQuery
} from './helpers'

;(async () => {

  // get url params
  const {contractAddress, editionNumber, seed} = getUrlParams()

  // logs an error if no url params are found
  if(!contractAddress || !editionNumber){
    console.error("Url params not found :( if you are testing locally try visiting:", "http://localhost:3000/?id=1&seed=5&address=0x8f66a247c29a2e4b32da14d94ee96fcae4964370")
  }

  // fallback to edition number if seed param not present
  const theSeed = seed != null ? seed : editionNumber

  // fetch data on all nfts for this edition
  let tokens = await fetchQuery(contractAddress)

  // generate seededRandom function with a salt phrase and the seed
  const seededRandom = generateSeededRandomness("not-so-random-seed-phrase",  theSeed)

  // set up a 10x10 grid for 100 editions
  const cols = 10
  const rows = 10

  new p5(p => {

    // create a background color using the seededRandom function
    const background = p.color(seededRandom()* 255, seededRandom() * 255, seededRandom()* 255)

    const renderArtwork = () => {

      // resize the grid based on window size
      const gridWidth =  p.windowWidth * 0.75
      const gridHeight = p.windowHeight * 0.75
      const cellWidth = gridWidth/rows
      const cellHeight = gridHeight/cols

      // draw the background with the seeded color
      p.background(background)

      p.push()
        // center the grid
        p.translate((p.windowWidth/2) - (gridWidth/2), (p.windowHeight/2) - (gridHeight/2))

        // draw grid border
        p.stroke(255, 255, 255, 255)
        p.noFill()
        p.rect(0, 0, gridWidth, gridHeight)

        // draw dots
        let count = 0
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            // draw the grid
            p.push()
              // center the cell
              p.translate(j*cellWidth, i*cellHeight)

              p.noFill()
              if(tokens[count]){
                // fill cell white if nft minted
                p.fill(127)

                // fill cell red if nft burnt
                if(tokens[count].owner.id === "0x0000000000000000000000000000000000000000") p.fill(127, 0, 0)
              }

              // draw cell
              p.rect(0, 0, cellWidth, cellHeight)

              // draw a dot on the currnet edition
              let isThisEdition = (editionNumber == count + 1)
              if(isThisEdition) {
                p.fill(0,0,0)
                p.ellipse(cellWidth/2, cellHeight/2, (cellWidth/2) * 0.8, (cellWidth/2) * 0.8)
              }
            p.pop()

            // increment cell
            count++
          }
        }

      p.pop()
    }

    // setup the p5.js sketch
    p.setup =  () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      renderArtwork()
    }

    // make sure to draw again if resized
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      renderArtwork()
    }

  }, document.getElementById('app'))
})()
