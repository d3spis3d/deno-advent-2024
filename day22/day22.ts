const day22Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const lines: string[] = data.split("\n").filter((line: string) => line !== "")

  const seeds = lines.map((l) => parseInt(l))

  return seeds.reduce((acc: bigint, s: number) => {
    return acc + generateSecretNumber(s, 2000)
  }, BigInt(0))
}

const generateSecretNumber = (seed: number, iterations: number) => {
  let secret = BigInt(seed)
  for (let i = 0; i < iterations; i++) {
    const a = secret * BigInt(64)
    secret = mix(secret, a)
    secret = prune(secret)

    const b = secret / BigInt(32)
    secret = mix(secret, b)
    secret = prune(secret)

    const c = secret * BigInt(2048)
    secret = mix(secret, c)
    secret = prune(secret)
  }

  return secret
}

const mix = (secret: bigint, mixee: bigint) => {
  return secret ^ mixee
}

const prune = (secret: bigint) => {
  return secret % BigInt(16777216)
}

const main = async () => {
  const resultOne = await day22Part1("1.txt")
  console.log(resultOne)
}

main()
