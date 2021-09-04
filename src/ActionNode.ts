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
        const stat = super.executeTick();
        if (stat === NodeStatus.RUNNING) {
            throw new Error('SyncActionNode MUST never return RUNNING');
        }
        return stat;
    }

    // You don't need to override this
    public halt() {
        this.setStatus(NodeStatus.IDLE);
    }

    protected abstract tick(): NodeStatus;
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
export class SimpleActionNode<T> extends SyncActionNode<T> {
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

export abstract class AsyncActionNode<T> extends ActionNodeBase<T> {
    private halt_requested_: boolean;
    // private waiting: boolean;

    constructor(name: string, blackboard: T) {
        super(name, blackboard);
        this.halt_requested_ = false;
        // this.waiting = false;
    }

    public executeTick(): NodeStatus {
        if (this.status() === NodeStatus.IDLE) {
            this.setStatus(NodeStatus.RUNNING);
            this.halt_requested_ = false;
            (async () => {
                try {
                    // this.waiting = true;
                    this.setStatus(await this.tick());
                    // this.waiting = false;
                } catch (error) {
                    // this.waiting = false;
                    throw new Error(error as any);
                }
            })();
        }
        return this.status();
    }

    public isHaltRequested(): boolean {
        return this.halt_requested_;
    }

    public halt() {
        this.halt_requested_ = true;
        // while (this.waiting) {}
        // this.setStatus(NodeStatus.IDLE);
    }

    protected abstract tick(): Promise<NodeStatus>;
}

/**
 * @brief The ActionNode is the goto option for,
 * but it is actually much easier to use correctly.
 *
 * It is particularly useful when your code contains a request-reply pattern,
 * i.e. when the actions sends an asychronous request, then checks periodically
 * if the reply has been received and, eventually, analyze the reply to determine
 * if the result is SUCCESS or FAILURE.
 *
 * -) an action that was in IDLE state will call onStart()
 *
 * -) A RUNNING action will call onRunning()
 *
 * -) if halted, method onHalted() is invoked
 */
export abstract class StatefulActionNode<T> extends ActionNodeBase<T> {
    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }

    // do not override this method
    public tick(): NodeStatus {
        const initial_status = this.status();
        if (initial_status === NodeStatus.IDLE) {
            const new_status = this.onStart();
            if (new_status === NodeStatus.IDLE) {
                throw new Error('AsyncActionNode2::onStart() must not return IDLE');
            }
            return new_status;
        }

        if (initial_status === NodeStatus.RUNNING) {
            const new_status = this.onRunning();
            if (new_status === NodeStatus.IDLE) {
                throw new Error('AsyncActionNode2::onRunning() must not return IDLE');
            }
            return new_status;
        }
        return initial_status;
    }

    // do not override this method
    public halt() {
        if (this.status() === NodeStatus.RUNNING) {
            this.onHalted();
        }
        this.setStatus(NodeStatus.IDLE);
    }

    /// method to be called at the beginning.
    /// If it returns RUNNING, this becomes an asychronous node.
    abstract onStart(): NodeStatus;

    /// method invoked by a RUNNING action.
    abstract onRunning(): NodeStatus;

    /// when the method halt() is called and the action is RUNNING, this method is invoked.
    /// This is a convenient place todo a cleanup, if needed.
    abstract onHalted(): void;
}

export abstract class CoroActionNode<T> extends ActionNodeBase<T> {
    private yield: boolean = false;

    constructor(name: string, blackboard: T) {
        super(name, blackboard);
    }
    /// Use this method to return RUNNING and temporary "pause" the Action.
    public setStatusRunningAndYield() {
        this.setStatus(NodeStatus.RUNNING);
        this.yield = true;
    }

    // This method triggers the TickEngine.
    public executeTick(): NodeStatus {
        if (!this.yield) this.setStatus(this.tick());
        return this.status();
    }

    /** You may want to override this method. But still, remember to call this
     * implementation too.
     *
     * Example:
     *
     *     void MyAction::halt()
     *     {
     *         // do your stuff here
     *         super.halt();
     *     }
     */
    public halt() {
        this.yield = false;
    }

    protected abstract tick(): NodeStatus;
}
