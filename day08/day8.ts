class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  key() {
    return `${this.x},${this.y}`
  }

  static fromString(str: string) {
    const [x, y] = str.split(",")
    return new Point(parseInt(x), parseInt(y))
  }

  antinodes(p: Point) {
    const pointOne = new Point(p.x - this.x + p.x, p.y - this.y + p.y)
    const pointTwo = new Point(this.x - p.x + this.x, this.y - p.y + this.y)
    // 7, 3
    // 4, 4
    //
    // 1, 5
    // 10, 2
    //
    // xdiff = 7 - 4, x + xdff = 10
    // xdiff = 4 - 7, x + xdiff = 1
    //
    // ydiff = 3 - 4, y + ydiff = 2
    // ydiff = 4 - 3, y + ydiff = 5
    return [pointOne, pointTwo]
  }

  antinodesWithinBounds(p: Point, rows: number, columns: number) {
    const points = [this, p]
    for (let i = 1; true; i++) {
      const pointOne = new Point(
        (p.x - this.x) * i + p.x,
        (p.y - this.y) * i + p.y,
      )
      const pointTwo = new Point(
        (this.x - p.x) * i + this.x,
        (this.y - p.y) * i + this.y,
      )

      const oneOutside =
        pointOne.x < 0 ||
        pointOne.x >= columns ||
        pointOne.y < 0 ||
        pointOne.y >= rows
      const twoOutside =
        pointTwo.x < 0 ||
        pointTwo.x >= columns ||
        pointTwo.y < 0 ||
        pointTwo.y >= rows

      if (!oneOutside) points.push(pointOne)
      if (!twoOutside) points.push(pointTwo)

      if (oneOutside && twoOutside) break
    }
    return points
  }
}

const day8Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const rows = lines.length
  const columns = lines[0].length
  const locations = new Map<string, string[]>()

  lines.forEach((line, j) =>
    line.split("").forEach((c, i) => {
      if (c !== ".") {
        const p = new Point(i, j)
        const existing = locations.get(c) || []
        existing.push(p.key())
        locations.set(c, existing)
      }
    }),
  )

  const allNodes = locations.entries().reduce(calculateAntinodes, [])

  const validNodes = new Set<string>()
  allNodes
    .filter((n) => n.x >= 0 && n.x < columns && n.y >= 0 && n.y < rows)
    .forEach((n) => validNodes.add(n.key()))

  return validNodes.size
}

const day8Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const rows = lines.length
  const columns = lines[0].length
  const locations = new Map<string, string[]>()

  lines.forEach((line, j) =>
    line.split("").forEach((c, i) => {
      if (c !== ".") {
        const p = new Point(i, j)
        const existing = locations.get(c) || []
        existing.push(p.key())
        locations.set(c, existing)
      }
    }),
  )

  const valid = locations
    .entries()
    .reduce(createCalculateAntinodes(rows, columns), new Set<string>())
  return valid.size
}

const calculateAntinodes = (acc: Point[], collection: [string, string[]]) => {
  const [_type, locations] = collection
  const setOfPairs = locations.map((l, i, all) => {
    const others = all.filter((_a, index) => i !== index)
    return others.map((o) => {
      const op = Point.fromString(o)
      const p = Point.fromString(l)
      return { p, op }
    })
  })

  const nodes = setOfPairs.reduce(
    (acc: Point[], pairs: { p: Point; op: Point }[]) => {
      return acc.concat(pairs.reduce(buildNodes, []))
    },
    [],
  )
  return acc.concat(nodes)
}

const buildNodes = (acc: Point[], pair: { p: Point; op: Point }) => {
  const nodes = pair.p.antinodes(pair.op)
  return acc.concat(nodes)
}

const createCalculateAntinodes =
  (rows: number, columns: number) =>
  (acc: Set<string>, collection: [string, string[]]) => {
    const [_type, locations] = collection

    const setOfPairs = locations.map((l, i, all) => {
      const others = all.filter((_a, index) => i !== index)
      return others.map((o) => {
        const op = Point.fromString(o)
        const p = Point.fromString(l)
        return { p, op }
      })
    })

    return setOfPairs.reduce(
      (acc: Set<string>, pairs: { p: Point; op: Point }[]) => {
        pairs.reduce(createBuildValidNodes(rows, columns), acc)

        return acc
      },
      acc,
    )
  }

const createBuildValidNodes =
  (rows: number, columns: number) =>
  (acc: Set<string>, pair: { p: Point; op: Point }) => {
    const points = pair.p.antinodesWithinBounds(pair.op, rows, columns)
    points.forEach((p) => acc.add(p.key()))
    return acc
  }

const main = async () => {
  const result = await day8Part1("1.txt")
  console.log(result)

  const resultTwo = await day8Part2("1.txt")
  console.log(resultTwo)
}

main()
