enum Thing {
  Box,
  Wall,
  Nothing,
  BoxLeft,
  BoxRight,
}

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const directionFromStr = (d: string) => {
  switch (d) {
    case "^":
      return Direction.Up
    case ">":
      return Direction.Right
    case "v":
      return Direction.Down
    case "<":
      return Direction.Left
  }
  throw new Error("bad direction")
}

class Point {
  x: number
  y: number

  directionMapping = {
    [Direction.Up]: [0, -1],
    [Direction.Right]: [1, 0],
    [Direction.Down]: [0, 1],
    [Direction.Left]: [-1, 0],
  }

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  key() {
    return `${this.x},${this.y}`
  }

  inDirectionWithinBounds(direction: Direction, rows: number, columns: number) {
    const [dx, dy] = this.directionMapping[direction]
    const points: Point[] = []

    let temp: Point = new Point(this.x, this.y)
    while (true) {
      const p = new Point(temp.x + dx, temp.y + dy)
      if (p.x < 0 || p.x > columns || p.y < 0 || p.y > rows) {
        break
      }
      points.push(p)
      temp = p
    }

    return points
  }

  move(direction: Direction) {
    const [dx, dy] = this.directionMapping[direction]
    return new Point(this.x + dx, this.y + dy)
  }

  static fromString(str: string) {
    const [x, y] = str.split(",")
    return new Point(parseInt(x), parseInt(y))
  }
}

const buildMap = (mapLines: string[][]) => {
  const map = new Map<string, Thing>()
  let robot = new Point(0, 0)

  mapLines.forEach((line: string[], j: number) => {
    line.forEach((l: string, i: number) => {
      let t: Thing
      const p = new Point(i, j)
      switch (l) {
        case "O":
          t = Thing.Box
          break
        case "#":
          t = Thing.Wall
          break
        case ".":
          t = Thing.Nothing
          break
        case "@":
          t = Thing.Nothing
          robot = p
          break
        default:
          throw new Error("bad type")
      }
      map.set(p.key(), t)
    })
  })

  return { map, robot }
}

const buildMapPt2 = (mapLines: string[][]) => {
  const newMapLines = mapLines.map((line) => {
    const newLine = line.map((l) => {
      switch (l) {
        case ".":
          return ".."
        case "#":
          return "##"
        case "O":
          return "[]"
        case "@":
          return "@."
        default:
          throw new Error("bad new map")
      }
    })
    return newLine.join("").split("")
  })

  const map = new Map<string, Thing>()
  let robot = new Point(0, 0)

  newMapLines.forEach((line: string[], j: number) => {
    line.forEach((l: string, i: number) => {
      let t: Thing
      const p = new Point(i, j)
      switch (l) {
        case "[":
          t = Thing.BoxLeft
          break
        case "]":
          t = Thing.BoxRight
          break
        case "#":
          t = Thing.Wall
          break
        case ".":
          t = Thing.Nothing
          break
        case "@":
          t = Thing.Nothing
          robot = p
          break
        default:
          throw new Error("bad type" + l)
      }
      map.set(p.key(), t)
    })
  })

  return { map, robot }
}

const day15Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const mapLines: string[][] = []
  let moves: string[] = []
  const lines: string[] = data.split("\n")

  let change = false
  for (const line of lines) {
    if (line === "") {
      change = true
      continue
    }
    if (change) {
      moves = moves.concat(line.split(""))
    } else {
      mapLines.push(line.split(""))
    }
  }

  const rows = mapLines.length
  const columns = mapLines[0].length

  let { map, robot } = buildMap(mapLines)

  moves.forEach((m: string) => {
    const d = directionFromStr(m)
    const points = robot.inDirectionWithinBounds(d, rows, columns)

    if (map.get(points[0].key()) === Thing.Wall) {
      return
    }
    if (map.get(points[0].key()) === Thing.Nothing) {
      robot = points[0]
      return
    }

    let boxHasSpaceAfter = false
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      if (map.get(p.key()) === Thing.Wall) break
      if (map.get(p.key()) === Thing.Nothing) {
        boxHasSpaceAfter = true
        break
      }
    }

    if (!boxHasSpaceAfter) {
      return
    }

    const { boxes: boxesToMove } = points.reduce(
      (acc: { boxes: Point[]; space: boolean }, p: Point) => {
        if (acc.space) return acc

        if (map.get(p.key()) === Thing.Nothing) {
          acc.space = true
          return acc
        }

        acc.boxes.push(p)
        return acc
      },
      { boxes: [], space: false },
    )

    boxesToMove.forEach((b: Point, i: number) => {
      const to = b.move(d)
      map.set(to.key(), Thing.Box)
      if (i === 0) {
        map.set(b.key(), Thing.Nothing)
      }
    })

    robot = points[0]
  })

  return [...map.entries()]
    .filter(([_p, t]) => t === Thing.Box)
    .reduce((acc: number, [p, _t]) => {
      const point = Point.fromString(p)
      return acc + 100 * point.y + point.x
    }, 0)
}

const day15Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const mapLines: string[][] = []
  let moves: string[] = []
  const lines: string[] = data.split("\n")

  let change = false
  for (const line of lines) {
    if (line === "") {
      change = true
      continue
    }
    if (change) {
      moves = moves.concat(line.split(""))
    } else {
      mapLines.push(line.split(""))
    }
  }

  const rows = mapLines.length * 2
  const columns = mapLines[0].length * 2

  let { map, robot } = buildMapPt2(mapLines)

  printMap(map, rows, columns)

  moves.forEach((m: string, i: number) => {
    const d = directionFromStr(m)
    const point = robot.inDirectionWithinBounds(d, rows, columns)[0]

    if (map.get(point.key()) === Thing.Wall) {
      return
    }
    if (map.get(point.key()) === Thing.Nothing) {
      robot = point
      return
    }

    let boxHasSpaceAfter = false
    if (d === Direction.Left || d === Direction.Right) {
      const points = robot.inDirectionWithinBounds(d, rows, columns)
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        if (map.get(p.key()) === Thing.Wall) break
        if (map.get(p.key()) === Thing.Nothing) {
          boxHasSpaceAfter = true
          break
        }
      }

      if (!boxHasSpaceAfter) {
        return
      }

      const { boxes: boxesToMove } = points.reduce(
        (acc: { boxes: Point[]; space: boolean }, p: Point) => {
          if (acc.space) return acc

          if (map.get(p.key()) === Thing.Nothing) {
            acc.space = true
            return acc
          }

          acc.boxes.push(p)
          return acc
        },
        { boxes: [], space: false },
      )

      boxesToMove
        .map((b) => {
          return { point: b, type: map.get(b.key()) || Thing.BoxLeft }
        })
        .forEach(
          ({ point, type }: { point: Point; type: Thing }, i: number) => {
            const to = point.move(d)
            map.set(to.key(), type)
            if (i === 0) {
              map.set(point.key(), Thing.Nothing)
            }
          },
        )

      robot = point

      printMap(map, rows, columns)
      return
    }

    // is up or down
    // tricky
    const boxes = wholeBoxFromPoint(point, map)
    const { points: boxesToMove, movable } = findAllMovableBoxes(
      boxes,
      d,
      map,
      { points: [], movable: true },
    )
    if (!movable) return

    boxesToMove
      .reverse()
      .map((b) => {
        return { point: b, type: map.get(b.key()) || Thing.BoxLeft }
      })
      .forEach(({ point, type }: { point: Point; type: Thing }, i: number) => {
        const to = point.move(d)
        map.set(to.key(), type)
        map.set(point.key(), Thing.Nothing)
      })

    printMap(map, rows, columns)

    robot = point
  })

  printMap(map, rows, columns)

  return [...map.entries()]
    .filter(([_p, t]) => t === Thing.BoxLeft)
    .reduce((acc: number, [p, _t]) => {
      const point = Point.fromString(p)
      return acc + 100 * point.y + point.x
    }, 0)
}

const findAllMovableBoxes = (
  points: Point[],
  d: Direction,
  map: Map<string, Thing>,
  acc: { points: Point[]; movable: boolean },
) => {
  const pointsInNextRow = points.map((p) => p.move(d))
  const thingsBeyond = pointsInNextRow.map((p: Point) => {
    const thing = map.get(p.key())
    if (thing === undefined) throw new Error("bad thing beyond")
    return thing
  })

  const allSpace =
    thingsBeyond.filter((t) => t === Thing.Nothing).length ===
    pointsInNextRow.length
  if (allSpace) {
    return { points: acc.points.concat(points), movable: true }
  }

  const hasWall = thingsBeyond.filter((t) => t === Thing.Wall).length > 0
  if (hasWall) {
    return { points: [], movable: false }
  }

  const boxesAbove: Point[] = pointsInNextRow.filter((p) => {
    const t = map.get(p.key())
    return t === Thing.BoxLeft || t === Thing.BoxRight
  })

  const { boxes } = boxesAbove
    .map((b) => wholeBoxFromPoint(b, map))
    .reduce((acc: Point[], boxes: Point[]) => {
      return acc.concat(boxes)
    }, [])
    .reduce(
      (acc: { checker: Set<string>; boxes: Point[] }, b: Point) => {
        if (acc.checker.has(b.key())) return acc
        acc.boxes.push(b)
        acc.checker.add(b.key())
        return acc
      },
      {
        checker: new Set<string>(),
        boxes: [],
      },
    )

  return findAllMovableBoxes(boxes, d, map, {
    points: acc.points.concat(points),
    movable: true,
  })
}

const wholeBoxFromPoint = (point: Point, map: Map<string, Thing>): Point[] => {
  const part = map.get(point.key())
  if (part === undefined) throw new Error("bad part")

  if (part === Thing.BoxLeft) {
    return [point, point.move(Direction.Right)]
  } else {
    return [point.move(Direction.Left), point]
  }
}

const printMap = (map: Map<string, Thing>, rows: number, columns: number) => {
  const printout = [...map.entries()].reduce((acc, [_p, t], i) => {
    if (i % columns === 0) {
      acc.push("\n")
    }
    let c = ""
    switch (t) {
      case Thing.Nothing:
        c = "."
        break
      case Thing.Wall:
        c = "#"
        break
      case Thing.BoxLeft:
        c = "["
        break
      case Thing.BoxRight:
        c = "]"
        break
    }
    acc.push(c)
    return acc
  }, [])
  // console.log(printout.join(""))
}

const main = async () => {
  const resultOne = await day15Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day15Part2("1.txt")
  console.log(resultTwo)
}

main()
