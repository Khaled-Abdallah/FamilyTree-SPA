import { NewsImage } from './newsImage';

export class News
{
  id: Number; 
  title: string ; 
  newsTypeId: Number ;
  description: string;
  allowComment: boolean ;
  newsImages: NewsImage[];
}
