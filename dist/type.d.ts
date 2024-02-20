export type RequestType = {
    query: string;
    variables: {
        login: string;
    };
};
export type RequestHeader = {
    Authorization: string;
};
export type CommitContributionsByRepository = Array<{
    contributions: {
        totalCount: number;
    };
    repository: {
        primaryLanguage: {
            name: string;
            /** "#RRGGBB" */
            color: string | null;
        } | null;
    };
}>;
export type ContributionCalendar = {
    isHalloween: boolean;
    totalContributions: number;
    weeks: Array<{
        contributionDays: Array<{
            contributionCount: number;
            contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
            /** "YYYY-MM-DD hh:mm:ss.SSS+00:00" */
            date: string;
        }>;
    }>;
};
export type Repositories = {
    edges: Array<{
        cursor: string;
    }>;
    nodes: Array<{
        forkCount: number;
        stargazerCount: number;
    }>;
};
/** Response(first) of GraphQL */
export type ResponseType = {
    data?: {
        user: {
            contributionsCollection: {
                commitContributionsByRepository: CommitContributionsByRepository;
                contributionCalendar: ContributionCalendar;
                totalCommitContributions: number;
                totalIssueContributions: number;
                totalPullRequestContributions: number;
                totalPullRequestReviewContributions: number;
                totalRepositoryContributions: number;
            };
            repositories: Repositories;
        };
    };
    errors?: [
        {
            message: string;
        }
    ];
};
/** Response(next) of GraphQL */
export type ResponseNextType = {
    data?: {
        user: {
            repositories: Repositories;
        };
    };
    errors?: [
        {
            message: string;
        }
    ];
};
//# sourceMappingURL=type.d.ts.map