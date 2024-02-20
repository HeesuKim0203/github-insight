import { mkdirSync, writeFileSync } from 'fs'

export const OUTPUT_FOLDER = './test'

export default (fileName: string, content: string) : void => {
    mkdirSync(OUTPUT_FOLDER, { recursive: true })
    writeFileSync(`${OUTPUT_FOLDER}/${fileName}`, content)
}