import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {Schema} from './schema';

export function demo(schema: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.logger.info(`Executing schematic "demo-schema" 
    with name ${schema.name} 
    and last name ${schema.lastName} 
    and gender ${schema.gender}`);

    tree.create('hello-schema.js',
      `console.log('Hello ${schema.name} ${schema.lastName}!');`);
    return tree;
  };
}

