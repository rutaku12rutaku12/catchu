export interface PostDto {
    
    id: string;
    postId: number;
    createDate:Date;
    title: string;
    content: string;
};

export interface PostWithContentDto extends PostDto {
}
