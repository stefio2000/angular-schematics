import {Component, Input, OnInit} from '@angular/core';
import {TodoModel} from '../../models/todo.model';
import {TodoService} from '../../services/todo.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Input()
  public todo: TodoModel;

  constructor(private readonly service: TodoService) {
  }

  public ngOnInit() {
    console.warn('todo is', this.todo);
  }

  public remove(): void {
    console.warn('removed');
    this.service.remove(this.todo);
  }

  public complete(): void {
    console.warn('complete', this.todo.completed);
    this.todo.completed = !this.todo.completed;
  }

}
