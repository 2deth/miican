class SynthProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.velocity = 0.0
    this.panning = 0.0
    this.amplitude = 0.0
    this.port.onmessage = this.onmessage.bind(this)
  }

  process(_inputs, outputs, _parameters) {
    if (outputs.length <= 0) return false
    const output = outputs[0]

    const numChannel = output.length
    if (numChannel <= 0) return false

    const numFrame = output[0].length

    if (numChannel == 1) {
      /// unreachable
      for (let i = 0; i < numFrame; ++i) {
        const noise = Math.random() * 2.0 - 1.0
        const src = noise * this.amplitude
        output[0][i] = src

        this.amplitude *= 0.9999
      }
    } else {
      for (let i = 0; i < numFrame; ++i) {
        const noise = Math.random() * 2.0 - 1.0
        const src = noise * this.amplitude
        const split = src * Math.sqrt(2.0) / 2.0
        const rad = Math.PI * 0.25 * this.panning
        const left = split * (Math.cos(rad) + Math.sin(rad))
        const right = split * (Math.cos(rad) - Math.sin(rad))

        output[0][i] = left
        output[1][i] = right

        this.amplitude *= 0.99995
      }
    }

    return true
  }

  onmessage(e) {
    const { data: { velocity, panning } } = e;

    this.velocity = velocity
    this.panning = panning

    this.amplitude = Math.max(this.amplitude, 0.01 * velocity)
  }
}

registerProcessor("synth-processor", SynthProcessor);
