type Equation = {
  sum: number
  components: number[]
}

type Calculation = {
  result: number
  components: number[]
  operators: string[]
}

const day7Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((l) => l !== "")

  const equations: Equation[] = lines.map(parseEquations)

  return equations.reduce(createComputeEquation(["+", "*"]), 0)
}

const day7Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((l) => l !== "")

  const equations: Equation[] = lines.map(parseEquations)

  return equations.reduce(createComputeEquation(["+", "*", "||"]), 0)
}

const parseEquations = (line: string): Equation => {
  const [sum, rest] = line.split(":")
  const components = rest
    .split(" ")
    .filter((l) => l !== "")
    .map((l) => l.trim())
    .map((l) => parseInt(l))

  return {
    sum: parseInt(sum),
    components,
  }
}

const createComputeEquation =
  (operators: string[]) => (acc: number, equation: Equation) => {
    const slots = equation.components.length - 1
    let set: string[][] = []

    for (let i = 0; i < slots; i++) {
      set.push(operators)
    }

    const posibilities = set.reduce((acc: string[], list: string[]) => {
      if (acc.length === 0) return list

      let temp: string[] = []

      list.forEach((l) => {
        temp = temp.concat(acc.map((a: string) => `${a},${l}`))
      })

      return temp
    }, [])

    const correct = posibilities.filter((possibility) => {
      const operators = possibility.split(",")
      const result = equation.components.reduce(
        (acc: Calculation, num: number) => {
          if (acc.components.length < 2) {
            acc.components.push(num)
          }
          if (acc.components.length === 1) {
            return acc
          }

          const operator = acc.operators.shift()

          let result = 0

          switch (operator) {
            case "+":
              result = acc.components[0] + acc.components[1]
              break
            case "*":
              result = acc.components[0] * acc.components[1]
              break
            case "||": {
              const one = String(acc.components[0])
              const two = String(acc.components[1])
              result = parseInt(one + two)
              break
            }
          }

          acc.components = [result]
          acc.result = result
          return acc
        },
        { result: 0, components: [], operators: operators },
      )

      return result.result === equation.sum
    })

    if (correct.length > 0) return acc + equation.sum
    return acc
  }

const main = async () => {
  const resultOne = await day7Part1("1.txt")
  console.log(resultOne)
  const resultTwo = await day7Part2("1.txt")
  console.log(resultTwo)
}

main()
