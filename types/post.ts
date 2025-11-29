export interface PostDto {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export interface PostWithContentDto extends PostDto {
}
