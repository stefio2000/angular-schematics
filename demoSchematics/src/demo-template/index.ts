import {apply, mergeWith, Rule, SchematicContext, Source, template, Tree, url} from '@angular-devkit/schematics';
import {Schema} from './schema';
import {strings} from '@angular-devkit/core';

export function demo(schema: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {

    _context.logger.info(`Executing schematic "demo-template" 
    with name '${schema.name}' 
    and content: '${schema.content}'`);

    const sourceTemplates: Source = url('./files');
    const parametrizedSourceTemplates: Source = apply(sourceTemplates,
      [
        template({
          ...schema,
          ...strings
        })
      ]);

    return mergeWith(parametrizedSourceTemplates);
  };
}

