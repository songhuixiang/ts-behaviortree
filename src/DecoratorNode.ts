import { NodeStatus, NodeType } from './BasicTypes';
import { TreeNode } from './TreeNode';

export abstract class DecoratorNode<T> extends TreeNode<T> {
    private child_node_: TreeNode<T> | undefined;

    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }

    type() {
        return NodeType.DECORATOR;
    }

    setChild(child: TreeNode<T>) {
        if (this.child_node_) {
            throw new Error('Decorator [' + this.name() + '] has already a child assigned');
        }

        this.child_node_ = child;
    }

    halt() {
        this.haltChild();
        this.setStatus(NodeStatus.IDLE);
    }

    child(): TreeNode<T> {
        if (!this.child_node_) {
            throw new Error('Decorator [' + this.name() + '] child is none');
        }
        return this.child_node_;
    }

    haltChild() {
        if (!this.child_node_) {
            return;
        }
        if (this.child_node_.status() == NodeStatus.RUNNING) {
            this.child_node_.halt();
        }
        (this.child_node_ as any).setStatus(NodeStatus.IDLE);
    }
}

/**
 * @brief The SimpleDecoratorNode provides an easy to use DecoratorNode.
 * The user should simply provide a callback with this signature
 *
 *    BT::NodeStatus functionName(BT::NodeStatus child_status)
 *
 * This avoids the hassle of inheriting from a DecoratorNode.
 *
 * SimpleDecoratorNode does not support halting, NodeParameters, nor Blackboards.
 */
export class SimpleDecoratorNode<T> extends DecoratorNode<T> {
    protected tick_functor_: (child_status: NodeStatus, thisNode: TreeNode<T>) => NodeStatus;

    // You must provide the function to call when tick() is invoked
    constructor(
        name: string,
        tick_functor: (child_status: NodeStatus, thisNode: TreeNode<T>) => NodeStatus,
        blackboard: T,
    ) {
        super(name, blackboard);
        this.tick_functor_ = tick_functor;
    }

    tick(): NodeStatus {
        return this.tick_functor_(this.child().executeTick(), this);
    }

    executeTick() {
        const status = super.executeTick();
        const child_status = this.child().status();
        if (child_status == NodeStatus.SUCCESS || child_status == NodeStatus.FAILURE) {
            (this.child() as any).setStatus(NodeStatus.IDLE);
        }
        return status;
    }
}
