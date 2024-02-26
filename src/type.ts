export type RequestType = {
    query: string
    variables: {
        login: string
    }
}

export type RequestHeader = {
    Authorization: string
}

export type RepositoryType = {
    name : string
    primaryLanguage: {
        name: string
        color: string | null
    } | null
}

export type CommitContributionsByRepository = {
    contributions: {
        totalCount: number
    }
    repository: RepositoryType
}

export type CommitContributionsByRepositorys = Array<CommitContributionsByRepository>

export type ContributionCalendar = {
    isHalloween: boolean
    totalContributions: number
}

export type Repositories = {
    edges: Array<{
        cursor: string
    }>
    nodes: Array<{
        forkCount: number
        stargazerCount: number
    }>
}

export type ResponseType = {
    data?: {
        user: {
            contributionsCollection: {
                commitContributionsByRepository: CommitContributionsByRepositorys
                contributionCalendar: ContributionCalendar
                totalCommitContributions: number
                totalIssueContributions: number
                totalPullRequestContributions: number
                totalPullRequestReviewContributions: number
                totalRepositoryContributions: number
            };
            repositories: Repositories
        }
    }
    errors?: [{
        message: string
    }]
}

export type ResponseNextType = {
    data?: {
        user: {
            repositories: Repositories
        }
    }
    errors?: [{
        message: string
    }]
}

//
export type Repository = {
    name : string
    contributionsCount : number
}

export type Language = {
    name : string
    color : string | null
    repositorys : Repository[]
}