import {
  getUrlParams,
  generateSeededRandomness,
  fetchTokens
} from './helpers/index.js'

;(async () => {
  // get url params
  const {contractAddress, seed} = getUrlParams()

  // fetch data from subgraph on all nft's for the edition contract
  let tokens = await fetchTokens(contractAddress)

  // set up a 10x10 grid for 100 editions
  const cols = 10
  const rows = 10

  new p5(p => {

    const renderArtwork = () => {

      // resize the grid based on window size
      const gridWidth =  p.windowWidth * 0.75
      const gridHeight = p.windowHeight * 0.75
      const squareWidth = gridWidth/rows
      const squareHeight = gridHeight/cols

      // draw the background
      p.background(10, 10, 10)

      p.push()
        // center the grid
        p.translate((p.windowWidth/2) - (gridWidth/2), (p.windowHeight/2) - (gridHeight/2))

        // draw grid border
        p.stroke(255, 255, 255, 255)
        p.noFill()
        p.rect(0, 0, gridWidth, gridHeight)

        // keep trakc of the current square
        let currentSquare = 1

        // loop through grid
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {

            // find seed that matches the current square
            // if not minted will be undifined
            const token = tokens.find((token) => token.seed === `${currentSquare}`)

            // draw the grid
            p.push()
              // center the square
              p.translate(x*squareWidth, y*squareHeight)

              // defualt square to transparent
              p.noFill()

              if(token){
                // generate square colour from owner address
                const seededRandom = generateSeededRandomness(token.owner.id)
                p.fill(seededRandom() * 255, seededRandom() * 255, seededRandom() * 255)

                // if nft is burnt
                if(token.owner.id === "0x0000000000000000000000000000000000000000"){
                  // override generated square colour with red
                  p.fill(127, 0, 0)
                }
              }

              // draw square
              p.rect(0, 0, squareWidth, squareHeight)

              // draw a dot on the current seed
              if(seed == currentSquare) {
                p.fill(0,0,0)
                p.ellipse(squareWidth/2, squareHeight/2, (squareWidth/2) * 0.8, (squareWidth/2) * 0.8)
              }
            p.pop()

            // update current square
            currentSquare++
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
