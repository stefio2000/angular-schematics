import {apply, mergeWith, move, Rule, SchematicContext, SchematicsException, Source, template, Tree, url} from '@angular-devkit/schematics';
import {Schema} from './schema';
import * as strings from '@angular-devkit/core/src/utils/strings';
import {parseName} from '@schematics/angular/utility/parse-name';
import {buildDefaultPath} from '@schematics/angular/utility/project';

export function demo(schema: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    //load angular.json
    const workspaceConfigBuffer: Buffer | null = _tree.read('angular.json');
    if (!workspaceConfigBuffer) {
      throw new SchematicsException('This is not an Angular workspace');
    }
    //load workspace config
    const workspaceConfig: any = JSON.parse(workspaceConfigBuffer.toString());
    //load workspace config
    const projectName: string = schema.project || workspaceConfig.defaultProject;
    //load project
    const project = workspaceConfig.projects[projectName];
    //build project path
    const defaultProjectPath = buildDefaultPath(project);
    const {name, path} = parseName(defaultProjectPath, schema.name);

    const sourceTemplates: Source = url('./files');
    const parametrizedSourceTemplates: Source = apply(sourceTemplates,
      [
        template({
          ...schema,
          ...strings,
          name
        }),
        move(path) // move the generated files to the right path
      ]);

    return mergeWith(parametrizedSourceTemplates)(_tree, _context);
  };
}

