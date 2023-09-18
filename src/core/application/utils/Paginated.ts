interface PaginatedParams<T> {
    items: T[];
    pageSize: number;
    page: number;
    total: number;
}

export class Paginated<T> {
    
    public items: T[];
    public pageSize: number;
    public page: number;
    public total: number;

    static create<T>(params: PaginatedParams<T>): Paginated<T> {
        const response: Paginated<T> = {
            items: params.items,
            pageSize: params.pageSize,
            page: params.page,
            total: params.total
        };
        return response;
    }

    static getOffset(page:number, size: number) {
        return size * (page - 1);
    }

}