class Point {
  x: number
  y: number
  h: number

  constructor(x: number, y: number, height: number) {
    this.x = x
    this.y = y
    this.h = height
  }

  key() {
    return `${this.x},${this.y}`
  }

  neighboursWithinBounds(maxX: number, maxY: number) {
    return [
      new Point(this.x - 1, this.y, 0),
      new Point(this.x, this.y - 1, 0),
      new Point(this.x, this.y + 1, 0),
      new Point(this.x + 1, this.y, 0),
    ]
      .filter((p) => p.x >= 0 && p.x < maxX && p.y >= 0 && p.y < maxY)
      .map((p) => p.key())
  }
}

const day10Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const rows = lines.length
  const columns = lines[0].length
  const starts = new Set<Point>()
  const locations = new Map<string, Point>()

  lines.forEach((line, j) =>
    line.split("").forEach((c, i) => {
      const p = new Point(i, j, parseInt(c))

      if (c === "0") {
        starts.add(p)
      }

      locations.set(p.key(), p)
    }),
  )

  return starts.values().reduce((acc: number, point: Point, i: number) => {
    const trails = findTrailsFrom([point], locations, rows, columns)
    const trailheads = scoreTrailheads(trails)
    return acc + trailheads
  }, 0)
}

const day10Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const rows = lines.length
  const columns = lines[0].length
  const starts = new Set<Point>()
  const locations = new Map<string, Point>()

  lines.forEach((line, j) =>
    line.split("").forEach((c, i) => {
      const p = new Point(i, j, parseInt(c))

      if (c === "0") {
        starts.add(p)
      }

      locations.set(p.key(), p)
    }),
  )

  return starts.values().reduce((acc: number, point: Point, i: number) => {
    const trails = findTrailsFrom([point], locations, rows, columns)
    const trailheads = rateTrailheads(trails)
    return acc + trailheads
  }, 0)
}

const findTrailsFrom = (
  trail: Point[],
  locations: Map<string, Point>,
  rows: number,
  columns: number,
): Point[][] => {
  const point = trail[trail.length - 1]
  const neighbours = point.neighboursWithinBounds(columns, rows)

  // console.log(point, neighbours)

  const reachableNeighbours = neighbours.filter((n) => {
    const neighbourHeight = locations.get(n) || new Point(0, 0, -1)
    return neighbourHeight.h === point.h + 1
  })

  // console.log(reachableNeighbours)

  if (reachableNeighbours.length === 0) {
    if (trail.length === 10) {
      return [trail]
    } else {
      return []
    }
  }

  const expandedTrails = reachableNeighbours.map((t) => {
    const p = locations.get(t)
    if (p === undefined) return trail
    return [...trail, p]
  })

  const { finished, pending } = expandedTrails.reduce(
    (acc: { finished: Point[][]; pending: Point[][] }, t: Point[]) => {
      if (t.length === 10) {
        acc.finished.push(t)
      } else {
        acc.pending.push(t)
      }
      return acc
    },
    { finished: [], pending: [] },
  )

  const further = pending.reduce((acc: Point[][], p: Point[]) => {
    const trails = findTrailsFrom(p, locations, rows, columns)
    return acc.concat(trails)
  }, [])

  return finished.concat(further)
}

const scoreTrailheads = (trails: Point[][]) => {
  const s = new Set<string>()
  trails.forEach((t) => s.add(t[t.length - 1].key()))
  return s.size
}

const rateTrailheads = (trails: Point[][]) => {
  const s = new Set<string>()
  trails.forEach((t) => s.add(t.map((p) => p.key()).join(":")))
  return s.size
}

const main = async () => {
  const resultOne = await day10Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day10Part2("1.txt")
  console.log(resultTwo)
}

main()
