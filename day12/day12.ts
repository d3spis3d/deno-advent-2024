class Point {
  x: number
  y: number
  p: string

  constructor(x: number, y: number, p: string) {
    this.x = x
    this.y = y
    this.p = p
  }

  key() {
    return `${this.x},${this.y}`
  }

  neighboursWithinBounds(maxX: number, maxY: number) {
    return [
      new Point(this.x - 1, this.y, ""),
      new Point(this.x, this.y - 1, ""),
      new Point(this.x, this.y + 1, ""),
      new Point(this.x + 1, this.y, ""),
    ]
      .filter((p) => p.x >= 0 && p.x < maxX && p.y >= 0 && p.y < maxY)
      .map((p) => p.key())
  }

  inDirections(directions: Direction[]) {
    return directions.map((d) => {
      switch (d) {
        case Direction.Right:
          return new Point(this.x + 1, this.y, "").key()
        case Direction.Down:
          return new Point(this.x, this.y + 1, "").key()
        case Direction.Left:
          return new Point(this.x - 1, this.y, "").key()
        case Direction.Up:
          return new Point(this.x, this.y - 1, "").key()
        case Direction.UpRight:
          return new Point(this.x + 1, this.y - 1, "").key()
        case Direction.DownRight:
          return new Point(this.x + 1, this.y + 1, "").key()
        case Direction.DownLeft:
          return new Point(this.x - 1, this.y + 1, "").key()
        case Direction.UpLeft:
          return new Point(this.x - 1, this.y - 1, "").key()
      }
    })
  }
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
  UpRight,
  DownRight,
  DownLeft,
  UpLeft,
}

const cornerDirections = [
  [Direction.Up, Direction.Right, Direction.UpRight],
  [Direction.Right, Direction.Down, Direction.DownRight],
  [Direction.Down, Direction.Left, Direction.DownLeft],
  [Direction.Left, Direction.Up, Direction.UpLeft],
]

const day12Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const map = new Map<string, Point>()
  const rows = lines.length
  const columns = lines[0].length

  const points = lines.reduce((acc: Point[], line: string, j: number) => {
    line.split("").reduce((acc: Point[], p: string, i: number) => {
      const point = new Point(i, j, p)
      map.set(point.key(), point)
      acc.push(point)
      return acc
    }, acc)
    return acc
  }, [])

  const visited = new Set<string>()

  const areas = points.reduce((acc: Point[][], p: Point) => {
    if (visited.has(p.key())) return acc

    visited.add(p.key())
    const area = findArea(p, map, visited, rows, columns)
    acc.push([p, ...area])
    return acc
  }, [])

  return areas.reduce((acc: number, area: Point[]) => {
    return acc + calculateFenceCostPerimeter(area, rows, columns)
  }, 0)
}

const day12Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const map = new Map<string, Point>()
  const rows = lines.length
  const columns = lines[0].length

  const points = lines.reduce((acc: Point[], line: string, j: number) => {
    line.split("").reduce((acc: Point[], p: string, i: number) => {
      const point = new Point(i, j, p)
      map.set(point.key(), point)
      acc.push(point)
      return acc
    }, acc)
    return acc
  }, [])

  const visited = new Set<string>()

  const areas = points.reduce((acc: Point[][], p: Point) => {
    if (visited.has(p.key())) return acc

    visited.add(p.key())
    const area = findArea(p, map, visited, rows, columns)
    acc.push([p, ...area])
    return acc
  }, [])

  return areas.reduce((acc: number, area: Point[]) => {
    return acc + calculateFenceCostEdges(area, rows, columns)
  }, 0)
}

const findArea = (
  point: Point,
  map: Map<string, Point>,
  visited: Set<string>,
  rows: number,
  columns: number,
) => {
  const points = point
    .neighboursWithinBounds(columns, rows)
    .map((p) => map.get(p) || new Point(0, 0, ""))
    .filter((p) => p.p === point.p)
    .filter((p) => !visited.has(p.key()))

  points.forEach((p) => visited.add(p.key()))

  const more: Point[] = points.flatMap((p) =>
    findArea(p, map, visited, rows, columns),
  )

  return points.concat(more)
}

const calculateFenceCostPerimeter = (
  area: Point[],
  rows: number,
  columns: number,
) => {
  if (area.length === 1) return 4

  const map = new Set<string>()
  area.forEach((p) => map.add(p.key()))

  const perimeter = area.reduce((acc: number, p: Point) => {
    let fences = 4
    const adjacent = p
      .neighboursWithinBounds(columns, rows)
      .filter((a) => map.has(a))
    return acc + fences - adjacent.length
  }, 0)

  return area.length * perimeter
}

const calculateFenceCostEdges = (
  area: Point[],
  rows: number,
  columns: number,
) => {
  if (area.length === 1) return 4

  const map = new Set<string>()
  area.forEach((p) => map.add(p.key()))

  const corners = area.reduce((acc: number, p: Point) => {
    const c = cornerDirections
      .map((d) => p.inDirections(d))
      .filter(
        ([i, j, k]) =>
          (!map.has(i) && !map.has(j)) ||
          (map.has(i) && map.has(j) && !map.has(k)),
      ).length
    return acc + c
  }, 0)

  return corners * area.length
}

const main = async () => {
  const resultOne = await day12Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day12Part2("1.txt")
  console.log(resultTwo)
}

main()
