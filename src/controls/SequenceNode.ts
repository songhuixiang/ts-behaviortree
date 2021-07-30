import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

/**
 * @brief The SequenceNode is used to tick children in an ordered sequence.
 * If any child returns RUNNING, previous children will NOT be ticked again.
 *
 * - If all the children return SUCCESS, this node returns SUCCESS.
 *
 * - If a child returns RUNNING, this node returns RUNNING.
 *   Loop is NOT restarted, the same running child will be ticked again.
 *
 * - If a child returns FAILURE, stop the loop and return FAILURE.
 *   Restart the loop only if (reset_on_failure == true)
 *
 */
export abstract class SequenceNode extends ControlNode<{}> {
    private current_child_idx_: number;

    constructor(name: string) {
        super(name, {});
        this.current_child_idx_ = 0;
        this.setRegistrationID('Sequence');
    }

    public halt() {
        this.current_child_idx_ = 0;
        super.halt();
    }

    protected tick(): NodeStatus {
        const children_count = this.children_nodes_.length;

        this.setStatus(NodeStatus.RUNNING);

        while (this.current_child_idx_ < children_count) {
            const current_child_node = this.children_nodes_[this.current_child_idx_];
            const child_status = current_child_node.executeTick();
            switch (child_status) {
                case NodeStatus.RUNNING:
                    return child_status;
                case NodeStatus.FAILURE:
                    // Reset on failure
                    this.haltChildren();
                    this.current_child_idx_ = 0;
                    return child_status;
                case NodeStatus.SUCCESS:
                    this.current_child_idx_++;
                    break;
                case NodeStatus.IDLE:
                    throw new Error('A child node must never return IDLE');
            }
        }

        // The entire while loop completed. This means that all the children returned SUCCESS.
        if (this.current_child_idx_ == children_count) {
            this.haltChildren();
            this.current_child_idx_ = 0;
        }
        return NodeStatus.SUCCESS;
    }
}
