import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-<%= name %>',
  templateUrl: './<%= name %>.component.html',
  styleUrls: ['./<%= name %>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  private static readonly DEFAULT_CONTENT: string = 'nothing to see here';
  public componentContent: string;

  public ngOnInit(): void {
    <% if (undefined !== content && content.trim() !== '') { %>
    this.componentContent = '<%= content %>';
  <% } else { %>
    this.componentContent = <%= classify(name) %>Component.DEFAULT_CONTENT;
  <% } %>
  }
}


