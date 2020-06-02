import React, { useEffect, useState, useRef } from "react"
import Video from "./mouth2.mp4"
import "./App.css"

function App() {
  const [vidLength, setVidLength] = useState(1)
  const [clicked, setClicked] = useState(false)
  const vidRef = useRef(null)
  useEffect(() => {
    if (!clicked) return
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.smoothingTimeConstant = 0.2
      analyser.fftSize = 1024

      const input = context.createMediaStreamSource(stream)

      input.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      setInterval(function step() {
        analyser.getByteFrequencyData(dataArray)
        let avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        //console.log(avg)
        const test = 120
        if (avg > test) avg = test
        if (avg < 10) avg = 0
        vidRef.current.currentTime = avg / test / vidLength
        //requestAnimationFrame(step)
      }, 50)
    }

    getMedia()
  }, [clicked, vidLength])

  useEffect(() => {
    if (vidRef.current === null) return
    vidRef.current.addEventListener("loadedmetadata", () => {
      setVidLength(vidRef.current.duration)
      vidRef.current.play()
      vidRef.current.pause()
    })
  }, [])
  return (
    <div className="App">
      {!clicked && <button onClick={() => setClicked(true)}>press</button>}
      {clicked && (
        <video ref={vidRef}>
          <source src={Video} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

export default App
