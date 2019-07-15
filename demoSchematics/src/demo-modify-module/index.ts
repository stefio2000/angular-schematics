import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {Schema} from './schema';
import {experimental, strings} from '@angular-devkit/core';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import {addDeclarationToModule, addImportToModule} from '@schematics/angular/utility/ast-utils';

export function demo(schema: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Info about the component to declare in the module
    const componentPath: string = './components/' + strings.dasherize(schema.name)
      + '/' + strings.dasherize(schema.name) + '.component.ts'; // the component path

    const componentClassifiedName: string = strings.classify(schema.name + 'Component');// The name of the component as a class name.
    // Info about the module where we want to declare our component
    const module: string = 'app.module';
    const modulePath: string = extractProjectPath(tree, schema) + '/' + module + '.ts';
    const moduleContent: Buffer | null = tree.read(modulePath);// read the content of the module

    if (null === moduleContent) {
      throw new SchematicsException('Can not patch non existing file ' + modulePath);
    }

    const sourceText = moduleContent.toString('utf-8');
    // The module as a typescript source file
    const source: ts.SourceFile = ts.createSourceFile(module, sourceText, ts.ScriptTarget.Latest, true);
    const changes: Change[] = addImportToModule(source, modulePath, componentClassifiedName, componentPath)
      .concat(addDeclarationToModule(source, modulePath, componentClassifiedName, componentPath));
    // and example on how to add a provider(service) -> addProviderToModule(source,modulePath, classifiedName, path)
    // and example on how to add a entry component -> addEntryComponentToModule(source, modulePath, classifiedName, path)

    const declarationRecorder = tree.beginUpdate(modulePath);// Let's start the update to the tree.

    // Make changes effective
    for (const change of changes) {
      if (change instanceof InsertChange) {
        // Let's apply the updates
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    tree.commitUpdate(declarationRecorder); // Let's commit the updates to the tree.

    return tree;
  };
}

function extractProjectPath(tree: Tree, schema: Schema): string {
  const workspaceConfig: Buffer | null = tree.read('/angular.json');

  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }

  const workspaceContent = workspaceConfig.toString();

  // parse workspace string into JSON object
  const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
  if (!schema.project && undefined !== workspace.defaultProject) {
    schema.project = workspace.defaultProject;
  }

  // Extract the project source root path in function of the kind of the project (app or lib)
  const projectName = schema.project as string;
  const project = workspace.projects[projectName];
  const projectType = project.projectType === 'application' ? 'app' : 'lib';

  if (schema.path === undefined) {
    schema.path = `${project.sourceRoot}/${projectType}`;
  }

  return schema.path;
}
