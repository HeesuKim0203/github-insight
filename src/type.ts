export type RequestType = {
    query: string
    variables: {
        login: string
    }
}

export type RequestHeader = {
    Authorization: string
}

export type CommitContributionsByRepository = {
    contributions: {
        totalCount: number
    }
    repository: {
        name : string
        primaryLanguage: {
            name: string
            color: string | null
        } | null
    }
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

// create Svg
export type Repository = {
    name : string
    commit : number
}

export type Language = {
    name : string
    repositorys : Repository[]
}

export type TreeMapDataType = {
    name : string
    languages : Language[]
}