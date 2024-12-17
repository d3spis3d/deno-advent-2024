const standardJump = 2

const adv = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = Math.trunc(registers.A / Math.pow(2, combo))
  registers.A = result
  return { jump: standardJump }
}

const bxl = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = registers.B ^ literal
  registers.B = result
  return { jump: standardJump }
}

const bst = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = combo % 8
  registers.B = result
  return { jump: standardJump }
}

const jnz = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  if (registers.A === 0) return { jump: standardJump }
  return { jump: literal - pointer }
}

const bxc = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = registers.B ^ registers.C
  registers.B = result
  return { jump: standardJump }
}

const out = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = combo % 8
  out.push(String(result))
  return { jump: standardJump }
}

const bdv = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = Math.trunc(registers.A / Math.pow(2, combo))
  registers.B = result
  return { jump: standardJump }
}

const cdv = (
  literal: number,
  combo: number,
  registers: { [key: string]: number },
  pointer: number,
  out: string[],
) => {
  const result = Math.trunc(registers.A / Math.pow(2, combo))
  registers.C = result
  return { jump: standardJump }
}

const instructions = {
  "0": adv,
  "1": bxl,
  "2": bst,
  "3": jnz,
  "4": bxc,
  "5": out,
  "6": bdv,
  "7": cdv,
}

const resolveCombo = (op: string, registers: { [key: string]: number }) => {
  switch (op) {
    case "0":
      return 0
    case "1":
      return 1
    case "2":
      return 2
    case "3":
      return 3
    case "4":
      return registers.A
    case "5":
      return registers.B
    case "6":
      return registers.C
    case "7":
      return 0
    default:
      throw new Error("bad combo")
  }
}

const day17Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const registerA = parseInt(lines[0].replace("Register A: ", ""))
  const registerB = parseInt(lines[1].replace("Register B: ", ""))
  const registerC = parseInt(lines[2].replace("Register C: ", ""))

  const codes = lines[3]
    .replace("Program: ", "")
    .split(",")
    .reduce((acc: Map<number, string>, code: string, i: number) => {
      acc.set(i, code)
      return acc
    }, new Map<number, string>())

  let pointer = 0
  const registers = {
    A: registerA,
    B: registerB,
    C: registerC,
  }

  let out: string[] = []

  while (true) {
    if (pointer > codes.size) break

    const instruction = codes.get(pointer)
    const operand = codes.get(pointer + 1)
    if (instruction === undefined || operand === undefined) break

    const combo = resolveCombo(operand, registers)

    const inst = instructions[instruction]
    const { jump } = inst(parseInt(operand), combo, registers, pointer, out)

    pointer = pointer + jump

    // console.log(pointer, jump, registers, out, instruction, operand)
  }

  return out.join(",")
}

const main = async () => {
  const resultOne = await day17Part1("1.txt")
  console.log(resultOne)
}

main()
