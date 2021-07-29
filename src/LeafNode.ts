import { TreeNode } from './TreeNode';

export abstract class LeafNode<T> extends TreeNode<T> {
    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }
}
