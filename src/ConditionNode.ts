import { NodeStatus, NodeType } from './BasicTypes';
import { LeafNode } from './LeafNode';
import { TreeNode } from './TreeNode';

export abstract class ConditionNode<T> extends LeafNode<T> {
    //Do nothing
    halt() {
        this.setStatus(NodeStatus.IDLE);
    }

    type() {
        return NodeType.CONDITION;
    }
}

/**
 * @brief The SimpleConditionNode provides an easy to use ConditionNode.
 * The user should simply provide a callback with this signature
 *
 *    BT::NodeStatus functionName(void)
 *
 * This avoids the hassle of inheriting from a ActionNode.
 *
 */
export class SimpleConditionNode<T> extends ConditionNode<T> {
    protected tick_functor_: (thisNode: TreeNode<T>) => NodeStatus;

    // You must provide the function to call when tick() is invoked
    constructor(name: string, tick_functor: (thisNode: TreeNode<T>) => NodeStatus, blackboard: T) {
        super(name, blackboard);
        this.tick_functor_ = tick_functor;
    }

    tick(): NodeStatus {
        return this.tick_functor_(this);
    }
}
