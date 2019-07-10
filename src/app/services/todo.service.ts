import {Injectable} from '@angular/core';
import {TodoModel} from '../models/todo.model';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private readonly todos: TodoModel[];

  constructor() {
    this.todos = [];
    this.todos.push(new TodoModel('test stef'));
  }

  public add(todo: TodoModel): void {
    this.todos.push(todo);
  }

  public remove(todo: TodoModel): void {
    this.todos.splice(this.todos.indexOf(todo), 1);
  }

  public all(): TodoModel[] {
    return this.todos;
  }

}
