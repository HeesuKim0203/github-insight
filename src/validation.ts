const core = require('@actions/core')

export const checkEnv = ( checkString : string | undefined, subject : string ) : boolean => {

    if( !checkString ) {
        core.setFailed(`${subject} is empty`)
        return false
    }

    return true
}