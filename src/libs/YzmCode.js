export function drawAuthCode (id) {
  const num = []
  const canvas = document.getElementById(id)
  canvas.width = 100
  canvas.height = 50
  const canvasWidth = 100
  const canvasHeight = 50
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvasWidth, canvasHeight)
  const sCode = 'A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0'
  const aCode = sCode.split(',')
  const aLength = aCode.length
  for (let i = 0; i <= 3; i++) {
    const j = Math.floor(Math.random() * aLength)
    const deg = Math.random() * 30 * Math.PI / 180
    const txt = aCode[j]
    num[i] = txt.toLowerCase()
    const x = 10 + i * 20
    const y = 20 + Math.random() * 8
    context.font = 'bold 26px 微软雅黑'
    context.translate(x, y)
    context.rotate(deg)
    context.fillStyle = randomColor()
    context.fillText(txt, 1, 4)
    context.rotate(-deg)
    context.translate(-x, -y)
  }
  for (let i = 0; i <= 5; i++) {
    context.strokeStyle = randomColor()
    context.beginPath()
    context.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
    context.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight)
    context.stroke()
  }
  for (let i = 0; i <= 30; i++) {
    context.strokeStyle = randomColor()
    context.beginPath()
    const x = Math.random() * canvasWidth
    const y = Math.random() * canvasHeight
    context.moveTo(x, y)
    context.lineTo(x + 1, y + 1)
    context.stroke()
  }
  return num.join('')
}
function randomColor () {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}
