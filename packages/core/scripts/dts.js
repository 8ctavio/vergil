import fs from 'node:fs'

const indexDtsPath = './dts/index.d.ts'

try {
	const content = fs.readFileSync(indexDtsPath)
	fs.writeFileSync(indexDtsPath, 'export * from "./types";\n' + content)
} catch (error) {
	console.error(error)
}