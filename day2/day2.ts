type Safe = {
  gradient: number
  safe: boolean
}

const day2Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")
  const readings = lines.map((l) => l.split(" ").map((r) => parseInt(r)))

  const safe = readings.filter((r) => findSafe(generateRates(r)))

  return safe.length
}

const day2Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")
  const readings = lines.map((l) => l.split(" ").map((r) => parseInt(r)))

  const safe = readings.filter((r) => findSafe(generateRates(r)))
  const notSafe = readings.filter((r) => !findSafe(generateRates(r)))

  const safeWithDampener = notSafe.filter((r) => withDampener(r))

  const all = [...safe, ...safeWithDampener]

  return all.length
}

const generateRates = (reading: number[]) => {
  return reading.reduce(
    (acc: number[], r: number, index: number, original: number[]) => {
      if (index === original.length - 1) return acc

      const rate = r - original[index + 1]
      return [...acc, rate]
    },
    [],
  )
}

const findSafe = (rates: number[]) => {
  const { safe } = rates.reduce(isSafe, { gradient: Infinity, safe: true })
  return safe
}

const isSafe = (acc: Safe, rate: number) => {
  if (!acc.safe) return acc

  if (acc.gradient === Infinity) {
    acc.gradient = gradient(rate)
  }

  if (gradient(rate) !== acc.gradient) {
    acc.safe = false
    return acc
  }

  if (Math.abs(rate) < 1 || Math.abs(rate) > 3) {
    acc.safe = false
    return acc
  }

  return acc
}

const dampenReadings = (readings: number[]) => {
  const mutated: number[][] = []
  for (let i = 0; i < readings.length; i++) {
    const newReadings = readings.filter((r, index) => index !== i)
    mutated.push(newReadings)
  }

  return mutated
}

const withDampener = (readings: number[]) => {
  const dampened = dampenReadings(readings).filter((r) => {
    return findSafe(generateRates(r))
  })
  return dampened.length > 0
}

const gradient = (num: number) => (num > 0 ? 1 : -1)

const main = async () => {
  const resultOne = await day2Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day2Part2("1.txt")
  console.log(resultTwo)
}

main()
