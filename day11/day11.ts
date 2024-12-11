const day11Part1 = async (file: string, blinks: number) => {
  const data = await Deno.readTextFile(file)

  const line: string = data.split("\n").filter((line: string) => line !== "")[0]
  let stones = line.split(" ")

  for (let i = 0; i < blinks; i++) {
    stones = blink(stones)
  }

  return stones.length
}

const day11Part2 = async (file: string, blinks: number) => {
  const data = await Deno.readTextFile(file)

  const line: string = data.split("\n").filter((line: string) => line !== "")[0]
  let stones = line.split(" ")

  let stoneMap = new Map<string, number>()
  stones.forEach((s) => {
    const existing = stoneMap.get(s) || 0
    stoneMap.set(s, existing + 1)
  })

  let cache = {}

  for (let i = 0; i < blinks; i++) {
    stoneMap = blonk(stoneMap, cache)
  }

  return stoneMap
    .entries()
    .reduce((acc: number, [_s, n]: [string, number]) => acc + n, 0)
}

const blink = (stones: string[]) => {
  return stones.reduce((acc: string[], stone: string) => {
    const newStones = changeStone(stone)
    return acc.concat(newStones)
  }, [])
}

const changeStone = (stone: string) => {
  if (stone === "0") {
    return ["1"]
  } else if (stone.length % 2 === 0) {
    const left = stone.substring(0, stone.length / 2)
    const right = stone.substring(stone.length / 2)
    let trimmed = right.replace(/^0+/, "")
    if (trimmed === "") trimmed = "0"
    return [left, trimmed]
  } else {
    const num = parseInt(stone)
    return [String(num * 2024)]
  }
}

const blonk = (
  stones: Map<string, number>,
  cache: { [key: string]: string[] },
) => {
  const updated = new Map<string, number>()

  const entries = [...stones.entries()]

  entries.forEach(([s, n]) => {
    let newStones: string[]
    if (cache[s] !== undefined) {
      newStones = cache[s]
    } else {
      newStones = changeStone(s)
      cache[s] = newStones
    }

    newStones.forEach((ns) => {
      const existing = updated.get(ns) || 0
      updated.set(ns, existing + n)
    })
  })

  return updated
}

const main = async () => {
  const resultOne = await day11Part1("1.txt", 25)
  console.log(resultOne)

  const start = new Date()
  const resultTwo = await day11Part2("1.txt", 75)
  const runtime = new Date().valueOf() - start.valueOf()
  console.log(resultTwo, runtime)
}

main()
