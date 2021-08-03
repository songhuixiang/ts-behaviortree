import { NodeType } from './BasicTypes';
import { ControlNode } from './ControlNode';
import { DecoratorNode } from './DecoratorNode';
import { TreeNode } from './TreeNode';

export function isControlNode<T>(node: TreeNode<T>): node is ControlNode<T> {
    return node.type() === NodeType.CONTROL;
}

export function isDecoratorNode<T>(node: TreeNode<T>): node is DecoratorNode<T> {
    return node.type() === NodeType.DECORATOR;
}

//Call the visitor for each node of the tree, given a root.
export function applyRecursiveVisitor<T>(root: TreeNode<T>, visitor: (node: TreeNode<T>) => void) {
    if (!root) {
        throw new Error('One of the children of a DecoratorNode or ControlNode is null');
    }

    visitor(root);

    if (isControlNode(root)) {
        for (const child of root.children()) {
            applyRecursiveVisitor(child, visitor);
        }
    } else if (isDecoratorNode(root)) {
        applyRecursiveVisitor(root.child(), visitor);
    }
}

/**
 * Debug function to print the hierarchy of the tree.
 */
export function printTreeRecursively<T>(root: TreeNode<T>): string {
    const endl = '\n';
    let stream = '';
    let recursivePrint = (indent: number, node: TreeNode<T>) => {
        for (let i = 0; i < indent; i++) {
            stream += '   ';
        }
        if (!node) {
            stream += '!null!' + endl;
            return;
        }
        stream += node.name() + endl;
        indent++;

        if (isControlNode(node)) {
            for (const child of node.children()) {
                recursivePrint(indent, child);
            }
        } else if (isDecoratorNode(node)) {
            recursivePrint(indent, node.child());
        }
    };

    stream += '----------------' + endl;
    recursivePrint(0, root);
    stream += '----------------' + endl;
    return stream;
}
