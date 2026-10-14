import confetti from 'canvas-confetti'

export function confettiBurst(x = 0.5, y = 0.4) {
  confetti({
    particleCount: 130,
    spread: 75,
    origin: { x, y },
    colors: ['#FFB224', '#FF5A5F', '#7A5AF8', '#2563EB', '#17B26A', '#FFFFFF'],
    disableForReducedMotion: true,
  })
}
export default confettiBurst
