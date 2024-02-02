import { setFailed } from '@actions/core'
import { checkEnv } from './validation'

export const main = async () : Promise<void> => {
  try {
    
    const token = process.env.GITHUB_TOKEN
    
    if( !checkEnv(token, 'GITHUB_TOKEN') ) return

    console.log(process.argv)

    const userName = 3 <= process.argv.length ? process.argv[2] : process.env.USER_NAME

    if( !checkEnv(token, 'USER_NAME') ) return

    console.log(`Hello ${userName}!`)

  } catch (_e) {
    const errorMessage = (_e as Error).message

    setFailed(errorMessage)
  }
}

main()