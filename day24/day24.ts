enum Operator {
  And,
  Xor,
  Or,
}

class Gate {
  l: string
  r: string
  op: Operator
  out: string

  constructor(line: string) {
    const [l, op, r, _arrow, out] = line.split(" ")
    this.l = l
    this.r = r
    this.out = out

    switch (op) {
      case "AND":
        this.op = Operator.And
        break
      case "OR":
        this.op = Operator.Or
        break
      case "XOR":
        this.op = Operator.Xor
        break
      default:
        throw new Error("bad op")
    }
  }

  ready(values: Map<string, number>) {
    return values.has(this.l) && values.has(this.r)
  }

  calculate(values: Map<string, number>) {
    let result: number
    switch (this.op) {
      case Operator.And:
        result = values.get(this.l) && values.get(this.r) ? 1 : 0
        break
      case Operator.Or:
        result = values.get(this.l) || values.get(this.r) ? 1 : 0
        break
      case Operator.Xor:
        result =
          (values.get(this.l) === 1 && values.get(this.r) === 0) ||
          (values.get(this.l) === 0 && values.get(this.r) === 1)
            ? 1
            : 0
        break
    }
    values.set(this.out, result)
  }
}

const day24Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n")

  const values: Map<string, number> = new Map()

  let processingGates = false

  const gates: Gate[] = []

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      processingGates = true
      continue
    }

    if (processingGates) {
      gates.push(new Gate(lines[i]))
    } else {
      const l = lines[i].split(": ")
      values.set(l[0], parseInt(l[1]))
    }
  }

  while (gates.length > 0) {
    const g = gates.shift()
    if (g!.ready(values)) {
      g!.calculate(values)
    } else {
      gates.push(g!)
    }
  }

  const results: number[] = []
  let index = 0
  while (true) {
    let s = String(index)
    if (s.length === 1) s = "0" + s

    const z = values.get(`z${s}`)
    if (z === undefined) break

    results.unshift(z)
    index++
  }

  return parseInt(results.join(""), 2)
}

const main = async () => {
  const resultOne = await day24Part1("1.txt")
  console.log(resultOne)
}

main()
