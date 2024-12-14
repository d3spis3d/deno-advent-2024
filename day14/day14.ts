const robotRegex = /p=(?<position>-?\d+,-?\d+) v=(?<velocity>-?\d+,-?\d+)/

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
}

class Robot {
  x: number
  y: number

  vX: number
  vY: number

  constructor(str: string) {
    const matches = str.match(robotRegex)?.groups
    const position = matches!.position.split(",")
    const velocity = matches!.velocity.split(",")

    this.x = parseInt(position[0])
    this.y = parseInt(position[1])
    this.vX = parseInt(velocity[0])
    this.vY = parseInt(velocity[1])
  }

  simulate(seconds: number, rows: number, columns: number) {
    let newX = (this.x + this.vX * seconds) % columns
    let newY = (this.y + this.vY * seconds) % rows

    if (newX < 0) {
      newX = columns + newX
    }
    if (newY < 0) {
      newY = rows + newY
    }

    return new Point(newX, newY)
  }
}

const defineQuadrants = (rows: number, columns: number) => {
  const endVerticalOne = Math.floor(rows / 2)
  const startVerticalTwo = Math.round(rows / 2)

  const endHorizontalOne = Math.floor(columns / 2)
  const startHorizontalTwo = Math.round(columns / 2)

  return [
    [0, endHorizontalOne - 1, 0, endVerticalOne - 1],
    [startHorizontalTwo, columns - 1, 0, endVerticalOne - 1],
    [0, endHorizontalOne - 1, startVerticalTwo, rows - 1],
    [startHorizontalTwo, columns - 1, startVerticalTwo, rows - 1],
  ]
}

const day14Part1 = async (file: string, rows: number, columns: number) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")
  const robots = lines.map((l) => new Robot(l))
  const positions = robots.map((r) => r.simulate(100, rows, columns))

  const quadrants = defineQuadrants(rows, columns)

  const quandrantCounts = positions.reduce(
    (acc: { [key: number]: number }, p: Point) => {
      for (let i = 0; i < 4; i++) {
        const q = quadrants[i]
        if (p.x >= q[0] && p.x <= q[1] && p.y >= q[2] && p.y <= q[3]) {
          acc[i] = acc[i] + 1
          break
        }
      }
      return acc
    },
    { 0: 0, 1: 0, 2: 0, 3: 0 },
  )

  return Object.values(quandrantCounts).reduce(
    (acc: number, c: number) => acc * c,
    1,
  )
}

const day14Part2 = async (file: string, rows: number, columns: number) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")
  const robots = lines.map((l) => new Robot(l))
  let time = 1

  while (true) {
    const positions = robots.map((r) => r.simulate(time, rows, columns))
    const set = new Set<string>()
    let collision = false

    for (let i = 0; i < positions.length; i++) {
      if (set.has(positions[i].key())) {
        collision = true
        break
      }

      set.add(positions[i].key())
    }

    if (!collision) {
      return time
    }

    time = time + 1
  }
}

const main = async () => {
  // const resultOne = await day14Part1("test.txt", 7, 11)
  const resultOne = await day14Part1("1.txt", 103, 101)
  console.log(resultOne)

  const resultTwo = await day14Part2("1.txt", 103, 101)
  console.log(resultTwo)
}

main()
