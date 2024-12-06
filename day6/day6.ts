class Point {
  x: number
  y: number

  constructor(x, y) {
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
  let guard = new Point(0, 0)
  let guardFacing = Facing.Up

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
          guardFacing = Facing.Up
          guard = new Point(i, j)
          break
        case "v":
          type = "empty"
          guardFacing = Facing.Down
          guard = new Point(i, j)
          break
        case "<":
          type = "empty"
          guardFacing = Facing.Left
          guard = new Point(i, j)
          break
        case ">":
          type = "empty"
          guardFacing = Facing.Right
          guard = new Point(i, j)
          break
      }
      acc.set(new Point(i, j).key(), type)
    })
    return acc
  }, new Map<string, string>())

  const xs = new Set<string>()
  xs.add(guard.key())

  while (true) {
    guardFacing = turnIfNeeded(guard, guardFacing, map)
    guard = guard.moveFacing(guardFacing)
    if (!map.has(guard.key())) break

    xs.add(guard.key())
  }

  return xs.size
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

const main = async () => {
  const resultOne = await day6Part1("1.txt")
  console.log(resultOne)
}

main()
