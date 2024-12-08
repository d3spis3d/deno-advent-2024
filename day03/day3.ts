const regexp = /mul\((\d{1,3},\d{1,3})\)/g
const regexpTwo = /(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g

const day3Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  return lines.reduce(parseInstruction, 0)
}

const day3Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const instructions = lines.reduce(collectInstructions, [])

  const { sum } = instructions.reduce(calculateWithConditional, {
    active: true,
    sum: 0,
  })
  return sum
}

const parseInstruction = (acc: number, line: string) => {
  const matches = [...line.matchAll(regexp)]
  const lineValue = matches.reduce(calculate, 0)
  return acc + lineValue
}

const collectInstructions = (acc: string[], line: string) => {
  const matches = [...line.matchAll(regexpTwo)]
  const instructions = matches.map(([_all, match]) => match)
  return acc.concat(instructions)
}

const calculate = (acc: number, match: string[]) => {
  const [_all, instruction] = match
  return acc + multiply(instruction)
}

const multiply = (inst: string) => {
  const [first, second] = inst.split(",")
  return parseInt(first) * parseInt(second)
}

const calculateWithConditional = (
  acc: { active: boolean; sum: number },
  instruction: string,
) => {
  switch (instruction) {
    case "do()":
      return { active: true, sum: acc.sum }
    case "don't()":
      return { active: false, sum: acc.sum }
    default:
      if (acc.active) {
        return {
          active: true,
          sum:
            acc.sum +
            multiply(instruction.replace("mul(", "").replace(")", "")),
        }
      }
      return acc
  }
}

const main = async () => {
  const result = await day3Part1("1.txt")
  console.log(result)

  const resultTwo = await day3Part2("1.txt")
  console.log(resultTwo)
}

main()
