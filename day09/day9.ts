const day9Part1 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const disk = data.split("\n")[0]

  const fileBlocks = expandDisk(disk)

  const compacted = defragment(fileBlocks)

  return checksum(compacted)
}

const day9Part2 = async (file: string) => {
  const data = await Deno.readTextFile(file)

  const disk = data.split("\n")[0]

  const fileBlocks = expandDisk(disk)

  const compacted = fileDefrag(fileBlocks)

  return checksum(compacted)
}

const expandDisk = (disk: string) => {
  const { blocks } = disk.split("").reduce(
    (
      acc: { isBlock: boolean; blockId: number; blocks: string[] },
      c: string,
    ) => {
      if (acc.isBlock) {
        for (let i = 0; i < parseInt(c); i++) {
          acc.blocks.push(String(acc.blockId))
        }
        acc.isBlock = false
        acc.blockId = acc.blockId + 1
      } else {
        for (let i = 0; i < parseInt(c); i++) {
          acc.blocks.push(".")
        }
        acc.isBlock = true
        acc.blockId = acc.blockId
      }
      return acc
    },
    { isBlock: true, blockId: 0, blocks: [] },
  )

  return blocks
}

const defragment = (fileBlocks: string[]) => {
  const newDisk: string[] = []
  while (fileBlocks.length > 0) {
    const block = fileBlocks.shift()
    if (block === undefined) break

    if (block === ".") {
      let endBlock = fileBlocks.pop()
      while (endBlock === ".") {
        endBlock = fileBlocks.pop()
      }

      if (endBlock === undefined) break
      newDisk.push(endBlock)
    } else {
      newDisk.push(block)
    }
  }

  return newDisk
}

const fileDefrag = (blocks: string[]) => {
  let spaces = findSpaces([...blocks])
  const files = findFiles([...blocks])

  files.reverse()

  files.forEach((file) => {
    const slotIndex = spaces.findIndex(
      (s) => s.size >= file.size && s.start < file.start,
    )
    if (slotIndex === -1) {
      return
    }

    const slot = spaces.splice(slotIndex, 1)[0]

    if (file.size < slot.size) {
      const leftover = slot.size - file.size
      spaces.splice(slotIndex, 0, {
        start: slot.end - leftover + 1,
        end: slot.end,
        size: leftover,
      })
    }

    spaces.reverse()
    const { spaces: updatedSpaces } = spaces.reduce(
      (
        acc: {
          spaces: { start: number; end: number; size: number }[]
          updated: boolean
        },
        space,
      ) => {
        if (acc.updated) {
          acc.spaces.push(space)
          return acc
        }

        if (file.start === space.end + 1) {
          space.end = file.end
          space.size = space.size + file.size
          acc.spaces.push(space)
          acc.updated = true
          return acc
        }

        if (file.start > space.end) {
          acc.spaces.push({ start: file.start, end: file.end, size: file.size })
          acc.spaces.push(space)
          acc.updated = true
          return acc
        }

        acc.spaces.push(space)
        return acc
      },
      { spaces: [], updated: false },
    )
    spaces = updatedSpaces.reverse()

    for (let i = slot.start; i < slot.start + file.size; i++) {
      blocks[i] = file.id
    }

    for (let i = file.start; i < file.start + file.size; i++) {
      blocks[i] = "."
    }
  })

  return blocks
}

const findSpaces = (blocks: string[]) => {
  const spaces: { start: number; end: number; size: number }[] = []

  let index = -1
  while (blocks.length > 0) {
    const c = blocks.shift()
    index++
    if (c === ".") {
      const start = index
      while (blocks[0] === ".") {
        blocks.shift()
        index++
      }
      const size = index - start + 1
      spaces.push({ start, end: index, size })
    }
  }

  return spaces
}

const findFiles = (blocks: string[]) => {
  const files: { start: number; end: number; id: string; size: number }[] = []

  let index = -1
  while (blocks.length > 0) {
    const c = blocks.shift()
    if (c === undefined) break

    index++
    if (c !== ".") {
      const start = index
      while (blocks[0] === c) {
        blocks.shift()
        index++
      }
      files.push({ start: start, end: index, id: c, size: index - start + 1 })
    }
  }

  return files
}

const checksum = (blocks: string[]) => {
  return blocks.reduce((acc: number, b: string, i: number) => {
    if (b === ".") return acc
    return acc + parseInt(b) * i
  }, 0)
}

const main = async () => {
  const resultOne = await day9Part1("1.txt")
  console.log(resultOne)

  const resultTwo = await day9Part2("1.txt")
  console.log(resultTwo)
}

main()
