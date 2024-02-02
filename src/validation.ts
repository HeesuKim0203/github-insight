import { setFailed } from '@actions/core'

export const checkEnv = ( checkString : string | undefined, subject : string ) : boolean => {

    if( !checkString ) {
        setFailed(`${subject} is empty`)
        return false
    }

    return true
}