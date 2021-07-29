import { NodeStatus, NodeType } from './BasicTypes';
import { LeafNode } from './LeafNode';
import { TreeNode } from './TreeNode';

// IMPORTANT: Actions which returned SUCCESS or FAILURE will not be ticked again unless setStatus(IDLE) is called first.
// Keep this in mind when writing your custom Control and Decorator nodes

/**
 * @brief The ActionNodeBase is the base class to use to create any kind of action.
 * A particular derived class is free to override executeTick() as needed.
 */
export abstract class ActionNodeBase<T> extends LeafNode<T> {
    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }

    public type(): NodeType {
        return NodeType.ACTION;
    }
}

/**
 * @brief The SyncActionNode is an ActionNode that
 * explicitly prevents the status RUNNING and doesn't require an implementation of halt().
 */
export abstract class SyncActionNode<T> extends ActionNodeBase<T> {
    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }

    // throws if the derived class return RUNNING.
    public executeTick(): NodeStatus {
        let stat = super.executeTick();
        if (stat === NodeStatus.RUNNING) {
            throw new Error('SyncActionNode MUST never return RUNNING');
        }
        return stat;
    }

    // You don't need to override this
    public halt() {
        this.setStatus(NodeStatus.IDLE);
    }
}

/**
 * @brief The SimpleActionNode provides an easy to use SyncActionNode.
 * The user should simply provide a callback with this signature
 *
 *    BT::NodeStatus functionName(TreeNode&)
 *
 * This avoids the hassle of inheriting from a ActionNode.
 *
 * SimpleActionNode is executed synchronously and does not support halting.
 * NodeParameters aren't supported.
 */
export abstract class SimpleActionNode<T> extends SyncActionNode<T> {
    protected tickFunctor_: (node: TreeNode<T>) => NodeStatus;

    constructor(name: string, tickFunctor: (node: TreeNode<T>) => NodeStatus, blackboard: T) {
        super(name, blackboard);
        this.tickFunctor_ = tickFunctor;
    }

    protected tick(): NodeStatus {
        let prevStatuc = this.status();
        if (prevStatuc === NodeStatus.IDLE) {
            this.setStatus(NodeStatus.RUNNING);
            prevStatuc = NodeStatus.RUNNING;
        }
        let status = this.tickFunctor_(this);
        if (status !== prevStatuc) {
            this.setStatus(status);
        }
        return status;
    }
}
