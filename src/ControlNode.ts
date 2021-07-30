import { NodeStatus, NodeType } from './BasicTypes';
import { TreeNode } from './TreeNode';

export abstract class ControlNode<T> extends TreeNode<T> {
    protected children_nodes_: Array<TreeNode<T>> = [];

    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }

    // The method used to add nodes to the children vector
    public addChild(child: TreeNode<T>) {
        this.children_nodes_.push(child);
    }

    public childrenCount(): number {
        return this.children_nodes_.length;
    }

    public halt() {
        this.haltChildren();
        this.setStatus(NodeStatus.IDLE);
    }

    public children(): Array<TreeNode<T>> {
        return this.children_nodes_;
    }

    public haltChild(index: number) {
        const child = this.children_nodes_[index];
        if (child?.status() === NodeStatus.RUNNING) {
            child.halt();
        }
        (child as any)?.setStatus(NodeStatus.IDLE);
    }

    public child(index: number): TreeNode<T> {
        return this.children_nodes_[index];
    }

    public haltChildren(first: number = 0) {
        for (let i = first; i < this.children_nodes_.length; i++) {
            this.haltChild(i);
        }
    }

    public type(): NodeType {
        return NodeType.CONTROL;
    }
}
