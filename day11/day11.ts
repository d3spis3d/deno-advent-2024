const day11Part1 = async (file: string, blinks: number) => {
  const data = await Deno.readTextFile(file)

  const line: string = data.split("\n").filter((line: string) => line !== "")[0]
  let stones = line.split(" ")

  for (let i = 0; i < blinks; i++) {
    stones = blink(stones)
  }

  return stones.length
}

const blink = (stones: string[]) => {
  return stones.reduce((acc: string[], stone: string) => {
    if (stone === "0") {
      acc.push("1")
    } else if (stone.length % 2 === 0) {
      acc.push(stone.substring(0, stone.length / 2))
      const right = stone.substring(stone.length / 2)
      let trimmed = right.replace(/^0+/, "")
      if (trimmed === "") trimmed = "0"
      acc.push(trimmed)
    } else {
      const num = parseInt(stone)
      acc.push(String(num * 2024))
    }
    return acc
  }, [])
}

const main = async () => {
  const resultOne = await day11Part1("1.txt", 25)
  console.log(resultOne)
}

main()
