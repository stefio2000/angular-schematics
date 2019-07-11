import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';

export function demo(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const name: string = _options['name'];
    tree.create('hello.js', `console.log('Hello ${name}! This file was created with a schematic');`);
    return tree;
  };
}
