import { setFailed } from '@actions/core'
import { checkEnv } from './validation'
import api from './api'
import write from './write'

export const main = async () : Promise<void> => {
  try {
    
    const token = process.env.GITHUB_TOKEN as string
    
    if( !checkEnv(token, 'GITHUB_TOKEN') ) return

    const userName = 3 <= process.argv.length ? process.argv[2] : process.env.USER_NAME as string

    if( !checkEnv(userName, 'USER_NAME') ) return

    console.log(`Hello ${userName}!`)

    const response = api(token, userName, 100)
    write('test.json', JSON.stringify(response))

  } catch (_e) {
    const errorMessage = (_e as Error).message

    setFailed(errorMessage)
  }
}

main()