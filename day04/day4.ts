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
}

const day4Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const emptyMap = new Map<string, string>()

  const { map, xs } = buildMapFindLetter(lines, emptyMap, "X")

  const paths = xs.map((x) => makePathsFromX(x, "XMAS".length))

  return paths.reduce((acc: number, pathsFromPoint: Point[][]) => {
    return (
      acc +
      pathsFromPoint
        .map((path) => wordFromPath(path, map))
        .filter((w) => w === "XMAS").length
    )
  }, 0)
}

const day4Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const emptyMap = new Map<string, string>()

  const { map, xs: as } = buildMapFindLetter(lines, emptyMap, "A")

  const paths = as.map((a) => makePathsFromA(a, "MAS".length))

  return paths.reduce((acc: number, pathsFromPoint: Point[][]) => {
    const words = pathsFromPoint
      .map((path) => wordFromPath(path, map))
      .filter((w) => w === "MAS" || w === "SAM")

    if (words.length === 2) {
      return acc + 1
    }
    return acc
  }, 0)
}

const buildMapFindLetter = (
  lines: string[],
  emptyMap: Map<string, string>,
  letter: string,
) => {
  return lines.reduce(
    (acc: { map: Map<string, string>; xs: Point[] }, line, j) => {
      return line.split("").reduce((acc, c, i) => {
        const p = new Point(i, j)
        acc.map.set(p.key(), c)
        if (c == letter) acc.xs.push(p)

        return acc
      }, acc)
    },
    { map: emptyMap, xs: [] },
  )
}

const makePathsFromX = (p: Point, pathLength: number) => {
  return [
    Array.from(Array(pathLength).keys()).map((i) => new Point(p.x + i, p.y)),
    Array.from(Array(pathLength).keys()).map((i) => new Point(p.x - i, p.y)),
    Array.from(Array(pathLength).keys()).map((i) => new Point(p.x, p.y + i)),
    Array.from(Array(pathLength).keys()).map((i) => new Point(p.x, p.y - i)),
    Array.from(Array(pathLength).keys()).map(
      (i) => new Point(p.x + i, p.y + i),
    ),
    Array.from(Array(pathLength).keys()).map(
      (i) => new Point(p.x + i, p.y - i),
    ),
    Array.from(Array(pathLength).keys()).map(
      (i) => new Point(p.x - i, p.y + i),
    ),
    Array.from(Array(pathLength).keys()).map(
      (i) => new Point(p.x - i, p.y - i),
    ),
  ]
}

const makePathsFromA = (p: Point, pathLength: number) => {
  return [
    Array.from(Array(pathLength).keys()).map(
      (i) => new Point(p.x - 1 + i, p.y - 1 + i),
    ),
    Array.from(Array(pathLength).keys()).map(
      (i) => new Point(p.x + 1 - i, p.y - 1 + i),
    ),
  ]
}

const wordFromPath = (path: Point[], map: Map<string, string>) => {
  return path.map((p) => map.get(p.key())).join("")
}

const main = async () => {
  const resultOne = await day4Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day4Part2("1.txt")
  console.log(resultTwo)
}

main()
