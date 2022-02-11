export function mod (a, b) {
  let decimal = 0
  let al = 0
  let bl = 0
  if (a.toString().includes('.')) {
    al = a.toString().split('.')[1].length
  }
  if (b.toString().includes('.')) {
    bl = b.toString().split('.')[1].length
  }
  decimal = al > bl ? al : bl
  return (a * decimal) / (b * decimal)
}
