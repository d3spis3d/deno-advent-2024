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

  moveFacing(facing: Facing) {
    switch (facing) {
      case Facing.Up:
        return this.up()
      case Facing.Down:
        return this.down()
      case Facing.Left:
        return this.left()
      case Facing.Right:
        return this.right()
    }
  }

  up(): Point {
    return new Point(this.x, this.y - 1)
  }

  down(): Point {
    return new Point(this.x, this.y + 1)
  }

  left(): Point {
    return new Point(this.x - 1, this.y)
  }

  right(): Point {
    return new Point(this.x + 1, this.y)
  }
}

enum Facing {
  Left,
  Right,
  Up,
  Down,
}

const nextFacing = (facing: Facing) => {
  switch (facing) {
    case Facing.Up:
      return Facing.Right
    case Facing.Right:
      return Facing.Down
    case Facing.Down:
      return Facing.Left
    case Facing.Left:
      return Facing.Up
  }
}

const day6Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")
  let guardOriginal = new Point(0, 0)
  let guardFacingOriginal = Facing.Up

  const map = lines.reduce((acc, l, j) => {
    l.split("").forEach((c, i) => {
      let type = ""
      switch (c) {
        case ".":
          type = "empty"
          break
        case "#":
          type = "obstacle"
          break
        case "^":
          type = "empty"
          guardFacingOriginal = Facing.Up
          guardOriginal = new Point(i, j)
          break
        case "v":
          type = "empty"
          guardFacingOriginal = Facing.Down
          guardOriginal = new Point(i, j)
          break
        case "<":
          type = "empty"
          guardFacingOriginal = Facing.Left
          guardOriginal = new Point(i, j)
          break
        case ">":
          type = "empty"
          guardFacingOriginal = Facing.Right
          guardOriginal = new Point(i, j)
          break
      }
      acc.set(new Point(i, j).key(), type)
    })
    return acc
  }, new Map<string, string>())

  let guard = new Point(guardOriginal.x, guardOriginal.y)
  let guardFacing: Facing = guardFacingOriginal

  const xs = new Set<string>()
  xs.add(guard.key())

  while (true) {
    guardFacing = turnIfNeeded(guard, guardFacing, map)
    guard = guard.moveFacing(guardFacing)
    if (!map.has(guard.key())) break

    xs.add(guard.key())
  }

  return { xs, guardFacingOriginal, guardOriginal, map }
}

const turnIfNeeded = (
  guard: Point,
  guardFacing: Facing,
  map: Map<string, string>,
) => {
  let facing = guardFacing

  while (true) {
    const checkPoint = guard.moveFacing(facing)
    const type = map.get(checkPoint.key())
    if (type === "empty" || type == undefined) break

    facing = nextFacing(facing)
  }

  return facing
}

const day6Part2 = (
  xs: Set<string>,
  guardOriginal: Point,
  guardFacingOriginal: Facing,
  map: Map<string, string>,
) => {
  const points = [...xs.values()]

  return points.reduce((acc, point) => {
    const newMap = new Map(map)
    newMap.set(point, "obstacle")
    let guard = new Point(guardOriginal.x, guardOriginal.y)
    let guardFacing = guardFacingOriginal

    const loopPoints = new Set<string>()

    loopPoints.add(guard.key() + String(guardFacing))

    while (true) {
      guardFacing = turnIfNeeded(guard, guardFacing, newMap)
      guard = guard.moveFacing(guardFacing)

      if (!newMap.has(guard.key())) {
        return acc
      }
      if (loopPoints.has(guard.key() + String(guardFacing))) return acc + 1

      loopPoints.add(guard.key() + String(guardFacing))
    }
  }, 0)
}

const main = async () => {
  const { xs, guardOriginal, guardFacingOriginal, map } =
    await day6Part1("1.txt")
  console.log(xs.size)

  const result = day6Part2(xs, guardOriginal, guardFacingOriginal, map)
  console.log(result)
}

main()
