class Tumbler {
  heights: { [key: number]: number }

  constructor(...lines: string[]) {
    const values = {}
    const map = lines.map((l) => l.split(""))
    for (let i = 0; i < map[0].length; i++) {
      for (let j = 0; j < map.length; j++) {
        if (map[j][i] === ".") {
          values[i] = j - 1
          break
        }
      }
    }

    this.heights = values
  }

  fit(key: Key) {
    return (
      Object.entries(this.heights)
        .map(([k, value]) => value + key.heights[k])
        .filter((v) => v > 5).length === 0
    )
  }
}

class Key {
  heights: { [key: number]: number }

  constructor(...lines: string[]) {
    const values = {}
    const map = lines.map((l) => l.split(""))
    for (let i = 0; i < map[0].length; i++) {
      for (let j = 0; j < map.length; j++) {
        if (map[j][i] === "#") {
          values[i] = 6 - j
          break
        }
      }
    }

    this.heights = values
  }
}

const day25Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n")
  const keys: Key[] = []
  const locks: Tumbler[] = []

  while (lines.length > 0) {
    let l: string[][] = []
    let t = "lock"
    const a = lines.shift()
    if (a === ".....") {
      keys.push(
        new Key(
          a!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
        ),
      )
    } else {
      locks.push(
        new Tumbler(
          a!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
          lines.shift()!,
        ),
      )
    }

    lines.shift() //empty
  }

  let matches = 0
  keys.forEach((k) => {
    locks.forEach((l) => {
      if (l.fit(k)) {
        matches++
      }
    })
  })

  return matches
}

const main = async () => {
  const resultOne = await day25Part1("1.txt")
  console.log(resultOne)
}

main()
