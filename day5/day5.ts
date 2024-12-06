type ParseInstructions = {
  sectionTwo: boolean
  ordering: string[]
  updates: string[]
}

type Rules = {
  [key: string]: {
    before: Set<string>
    after: Set<string>
  }
}

const parseInstructions = (acc: ParseInstructions, line: string) => {
  if (line === "") return acc.sectionTwo ? acc : { ...acc, sectionTwo: true }

  if (acc.sectionTwo) {
    return {
      sectionTwo: acc.sectionTwo,
      ordering: acc.ordering,
      updates: [...acc.updates, line],
    }
  } else {
    return {
      sectionTwo: acc.sectionTwo,
      ordering: [...acc.ordering, line],
      updates: acc.updates,
    }
  }
  return acc
}

const parseOrdering = (acc: Rules, order: string) => {
  const [first, second] = order.split("|")

  let firstRules = acc[first]
  if (firstRules === undefined) {
    firstRules = {
      before: new Set(),
      after: new Set(),
    }
  }
  firstRules.after.add(second)

  let secondRules = acc[second]
  if (secondRules === undefined) {
    secondRules = {
      before: new Set(),
      after: new Set(),
    }
  }
  secondRules.before.add(first)

  acc[first] = firstRules
  acc[second] = secondRules

  return acc
}

const createProcessUpdates = (rules: Rules) => {
  return (acc: number, line: string) => {
    const pages = line.split(",")

    const indexes = pages.reduce(
      (acc: { [key: number]: string }, page: string, index: number) => {
        acc[index] = page
        return acc
      },
      {},
    )

    const valid = pages.reduce((acc: boolean, page: string, index: number) => {
      if (!acc) return acc
      if (index == 0) return acc

      const pageRules = rules[page]

      for (let i = 0; i < index; i++) {
        const p = indexes[i]
        if (pageRules.after.has(p)) {
          return false
        }
      }

      return acc
    }, true)

    if (!valid) return acc

    return acc + parseInt(pages[Math.floor(pages.length / 2)])
  }
}

const createProcessWrongUpdates = (rules: Rules) => {
  return (acc: number, line: string) => {
    const pages = line.split(",")

    const indexes = pages.reduce(
      (acc: { [key: number]: string }, page: string, index: number) => {
        acc[index] = page
        return acc
      },
      {},
    )

    const valid = pages.reduce((acc: boolean, page: string, index: number) => {
      if (!acc) return acc
      if (index == 0) return acc

      const pageRules = rules[page]

      for (let i = 0; i < index; i++) {
        const p = indexes[i]
        if (pageRules.after.has(p)) {
          return false
        }
      }

      return acc
    }, true)

    if (valid) return acc

    pages.sort((a, b) => {
      const pageRules = rules[a]
      if (pageRules.before.has(b)) {
        return -1
      }

      return 1
    })

    return acc + parseInt(pages[Math.floor(pages.length / 2)])
  }
}

const day5Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const { ordering, updates }: ParseInstructions = data
    .split("\n")
    .reduce(parseInstructions, { sectionTwo: false, ordering: [], updates: [] })

  const rules = ordering.reduce(parseOrdering, {})

  return updates.reduce(createProcessUpdates(rules), 0)
}

const day5Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const { ordering, updates }: ParseInstructions = data
    .split("\n")
    .reduce(parseInstructions, { sectionTwo: false, ordering: [], updates: [] })

  const rules = ordering.reduce(parseOrdering, {})

  return updates.reduce(createProcessWrongUpdates(rules), 0)
}

const main = async () => {
  const result = await day5Part1("1.txt")
  console.log(result)

  const resultTwo = await day5Part2("1.txt")
  console.log(resultTwo)
}

main()
