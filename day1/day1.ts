type Lists = {
  left: number[]
  right: number[]
}

const parse = (acc: Lists, line: string): Lists => {
  const [l, r] = line.split("   ")

  if (l === undefined || r === undefined) return acc

  return {
    left: [...acc.left, parseInt(l.trim())],
    right: [...acc.right, parseInt(r.trim())],
  }
}

const day1Part1 = async () => {
  const data = await Deno.readTextFile("1.txt")

  const lines: string[] = data.split("\n")

  const { left, right } = lines.reduce(parse, { left: [], right: [] })

  left.sort()
  right.sort()

  return left.reduce((acc, l, i) => acc + Math.abs(l - right[i]), 0)
}

const day1Part2 = async () => {
  const data = await Deno.readTextFile("1.txt")

  const lines: string[] = data.split("\n")

  const { left, right } = lines.reduce(parse, { left: [], right: [] })

  const rightSet = right.reduce((acc: Map<number, number>, r) => {
    acc.set(r, (acc.get(r) || 0) + 1)
    return acc
  }, new Map())

  return left.reduce((acc, l) => {
    acc = acc + l * (rightSet.get(l) || 0)
    return acc
  }, 0)
}

const main = async () => {
  const result = await day1Part1()
  console.log(result)
  const result2 = await day1Part2()
  console.log(result2)
}

main()
