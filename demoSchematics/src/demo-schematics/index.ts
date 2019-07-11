import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function demoSchematics(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create('hello.js', `console.log('Hello world! This file was created with a schematic');`);
    return tree;
  };
}
