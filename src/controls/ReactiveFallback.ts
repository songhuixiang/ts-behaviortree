import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

/**
 * @brief The ReactiveFallback is similar to a ParallelNode.
 * All the children are ticked from first to last:
 *
 * - If a child returns RUNNING, continue to the next sibling.
 * - If a child returns FAILURE, continue to the next sibling.
 * - If a child returns SUCCESS, stop and return SUCCESS.
 *
 * If all the children fail, than this node returns FAILURE.
 *
 * IMPORTANT: to work properly, this node should not have more than a single asynchronous child.
 *
 */

export class ReactiveFallback extends ControlNode<{}> {
    constructor(name: string) {
        super(name, {});
    }

    tick(): NodeStatus {
        let failure_count = 0;

        for (let index = 0; index < this.childrenCount(); index++) {
            const current_child_node = this.children_nodes_[index];
            const child_status = current_child_node.executeTick();

            switch (child_status) {
                case NodeStatus.RUNNING:
                    for (let i = index + 1; i < this.childrenCount(); i++) {
                        this.haltChild(i);
                    }
                    return NodeStatus.RUNNING;
                case NodeStatus.FAILURE:
                    failure_count++;
                    break;
                case NodeStatus.SUCCESS:
                    this.haltChildren();
                    return NodeStatus.SUCCESS;
                case NodeStatus.IDLE:
                    throw new Error('A child node must never return IDLE');
            }
        }

        if (failure_count == this.childrenCount()) {
            this.haltChildren();
            return NodeStatus.FAILURE;
        }

        return NodeStatus.RUNNING;
    }
}
