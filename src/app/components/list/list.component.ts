import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {TodoModel} from '../../models/todo.model';
import {FormControl, Validator, Validators} from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public todos: TodoModel[];
  public formCurrent: FormControl;
  @ViewChild('TODO', {static: true}) public inputLogin: ElementRef;


  constructor(private readonly service: TodoService) {
  }

  ngOnInit() {
    this.todos = this.service.all();
    this.formCurrent = new FormControl('', [Validators.required]);
    this.inputLogin.nativeElement.focus();
  }

  public add(): void {
    if (this.formCurrent.valid) {
      const todo: TodoModel = new TodoModel(this.formCurrent.value);
      this.service.add(todo);
      this.formCurrent.reset();
    }
  }

  @HostListener('window:keydown', ['$event'])
  private onKey(event) {
    if (event.key === 'Enter') {
      this.add();
    }
  }
}
