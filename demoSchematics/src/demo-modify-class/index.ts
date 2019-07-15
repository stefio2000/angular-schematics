import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {Schema} from './schema';
import {experimental} from '@angular-devkit/core';
import * as ts from 'typescript';
import {SyntaxKind} from 'typescript';
import {getSourceNodes} from '@schematics/angular/utility/ast-utils';

export function demo(schema: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Info about the component to declare in the module
    const enumPath: string = extractProjectPath(tree, schema) + '/models/todo.type.enum.ts';
    const enumContent: Buffer | null = tree.read(enumPath);// read the content of the module

    if (null === enumContent) {
      throw new SchematicsException('Can not patch non existing file ' + enumPath);
    }

    const sourceText = enumContent.toString('utf-8');
    console.warn(sourceText);
    const source: ts.SourceFile = ts.createSourceFile(enumPath, sourceText, ts.ScriptTarget.Latest, true);
    const sourceNodes: ts.Node[] = getSourceNodes(source);

    let nodeWhereToAdd: ts.Node | undefined;
    // Should have a single one
    for (const node of sourceNodes) {
      if (node.kind === SyntaxKind.EnumMember) {
        nodeWhereToAdd = node;
        break;
      }
    }
    if (undefined !== nodeWhereToAdd) {
      const codeToAdd: string = `, NOTE`;
      const declarationRecorder = tree.beginUpdate(enumPath);// Let's start the update to the tree.
      declarationRecorder.insertRight(nodeWhereToAdd.getEnd(), codeToAdd);
      tree.commitUpdate(declarationRecorder);
    }

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
