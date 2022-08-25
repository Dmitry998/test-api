export class PageMetaDto {
    readonly page: number;
    readonly pageSize: number;
    readonly quantity: number;

    constructor({page, pageSize, quantity}: PageMetaDto){
        this.quantity = quantity,
        this.page = page,
        this.pageSize = pageSize
    }
}