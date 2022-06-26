export interface Square {
    i: number,
    j: number,
    isOpen: boolean,
    isFlagged: boolean,
    isMined: boolean,
    content?: number | string,
}