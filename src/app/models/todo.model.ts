import {TodoTypeEnum} from './todo.type.enum';

export class TodoModel {
  type: TodoTypeEnum = TodoTypeEnum.TODO;
  title: string;
  content: string;
  date: Date;
  completed: boolean = false;

  constructor(title: string, type?: TodoTypeEnum) {
    this.title = title;
    this.date = new Date();

    if (type) {
      this.type = type;
    }
  }
}
