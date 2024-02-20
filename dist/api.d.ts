import { ResponseType, ResponseNextType } from './type';
export declare const fetchFirst: (token: string, userName: string) => Promise<ResponseType>;
export declare const fetchNext: (token: string, userName: string, cursor: string) => Promise<ResponseNextType>;
declare const _default: (token: string, userName: string, maxRepos: number) => Promise<ResponseType>;
export default _default;
//# sourceMappingURL=api.d.ts.map