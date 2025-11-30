import { Timestamp } from "firebase/firestore";

export interface PostDto {
    
    id: string;
    createDate:any;
    title: string;
    content: string;
    userId?: string;
    userEmail?: string;
    
};
export interface CommentDto {
    id?: string;
    postId: string;
    content: string;
    userEmail: string;
    userId?: string;
    createDate: any; 
}
export interface PostWithContentDto extends PostDto {
}
