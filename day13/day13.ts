import * as mathjs from "npm:mathjs@14.0.1"

class Machine {
  a: { x: number; y: number }
  b: { x: number; y: number }
  prize: { x: number; y: number }

  constructor([aStr, bStr, prizeStr]: string[]) {
    const aMatch = aStr.match(/Button A: X\+(?<x>\d+), Y\+(?<y>\d+)/)
    if (aMatch === undefined) throw new Error("no match")
    this.a = { x: parseInt(aMatch!.groups!.x), y: parseInt(aMatch!.groups!.y) }

    const bMatch = bStr.match(/Button B: X\+(?<x>\d+), Y\+(?<y>\d+)/)
    if (bMatch === undefined) throw new Error("no match")
    this.b = { x: parseInt(bMatch!.groups!.x), y: parseInt(bMatch!.groups!.y) }

    const pMatch = prizeStr.match(/Prize: X=(?<x>\d+), Y=(?<y>\d+)/)
    if (pMatch === undefined) throw new Error("no match")
    this.prize = {
      x: parseInt(pMatch!.groups!.x),
      y: parseInt(pMatch!.groups!.y),
    }
  }

  calculate() {
    // for (let i = 0; i <= 100; i++) {
    //   for (let j = 0; j <= 100; j++) {
    //     if (
    //       i * this.a.x + j * this.b.x === this.prize.x &&
    //       i * this.a.y + j * this.b.y === this.prize.y
    //     ) {
    //       return i * 3 + j
    //     }
    //   }
    // }
    const a = [
      [this.a.x, this.b.x],
      [this.a.y, this.b.y],
    ]
    const b = [this.prize.x, this.prize.y]

    const result = mathjs.lusolve(a, b)
    const rA = result[0] as number[]
    const rB = result[1] as number[]
    if (confirmInt(rA[0]) && confirmInt(rB[0])) {
      return Math.round(rA[0]) * 3 + Math.round(rB[0])
    }

    return 0
  }
}

class Part2Machine extends Machine {
  constructor([aStr, bStr, prizeStr]: string[]) {
    super([aStr, bStr, prizeStr])
    this.prize.x = this.prize.x + 10000000000000
    this.prize.y = this.prize.y + 10000000000000
  }
}

const confirmInt = (x: number) => {
  const delta = Math.abs(Math.round(x) - x)
  return delta < 0.001
}

const day13Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const machinesStr: string[][] = []

  while (lines.length > 0) {
    const a = lines.shift() || ""
    const b = lines.shift() || ""
    const prize = lines.shift() || ""

    machinesStr.push([a, b, prize])
  }

  const machines = machinesStr.map((str) => new Machine(str))

  return machines.reduce((acc: number, machine: Machine) => {
    return acc + machine.calculate()
  }, 0)
}

const day13Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const machinesStr: string[][] = []

  while (lines.length > 0) {
    const a = lines.shift() || ""
    const b = lines.shift() || ""
    const prize = lines.shift() || ""

    machinesStr.push([a, b, prize])
  }

  const machines = machinesStr.map((str) => new Part2Machine(str))

  return machines.reduce((acc: number, machine: Machine) => {
    return acc + machine.calculate()
  }, 0)
}

const main = async () => {
  const resultOne = await day13Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day13Part2("1.txt")
  console.log(resultTwo)
}

main()
