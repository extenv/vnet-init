import { readdirSync, statSync, existsSync } from "fs"
import { join } from "path"

/**
 * Generate folder tree structure recursively
 */
function generateTree(
  dir: string,
  prefix = "",
  lines: string[] = []
): string[] {
  const items = readdirSync(dir)

  items.forEach((item, index) => {
    const fullPath = join(dir, item)
    const isLast = index === items.length - 1
    const stats = statSync(fullPath)

    const connector = isLast ? "└── " : "├── "
    const line = prefix + connector + item
    lines.push(line)

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ")
      generateTree(fullPath, newPrefix, lines)
    }
  })

  return lines
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
saw-it - Folder Tree Viewer

Usage:
  vnet saw-it <folder>

Examples:
  vnet saw-it src
  vnet saw-it src > tree.txt
`)
}

/**
 * Feature entry
 */
export default function run(args: string[]) {
  const folder = args[0]

  if (!folder || folder === "-h" || folder === "--help") {
    showHelp()
    return
  }

  if (!existsSync(folder)) {
    console.error(`❌ Folder not found: ${folder}`)
    return
  }

  if (!statSync(folder).isDirectory()) {
    console.error(`❌ Not a directory: ${folder}`)
    return
  }

  const lines: string[] = []
  lines.push(folder + "/")
  generateTree(folder, "", lines)

  const output = lines.join("\n")

  // 🔥 Always print to stdout
  // Shell will handle redirect automatically
  console.log(output)
}