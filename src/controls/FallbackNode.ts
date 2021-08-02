import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

/**
 * @brief The FallbackNode is used to try different strategies, until one succeeds.
 * If any child returns RUNNING, previous children will NOT be ticked again.
 *
 * - If all the children return FAILURE, this node returns FAILURE.
 *
 * - If a child returns RUNNING, this node returns RUNNING.
 *
 * - If a child returns SUCCESS, stop the loop and return SUCCESS.
 *
 */

export class FallbackNode extends ControlNode<{}> {
    private current_child_idx_: number;

    constructor(name: string) {
        super(name, {});
        this.current_child_idx_ = 0;
        this.setRegistrationID('Fallback');
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
                case NodeStatus.SUCCESS:
                    this.haltChildren();
                    this.current_child_idx_ = 0;
                    return child_status;
                case NodeStatus.FAILURE:
                    this.current_child_idx_++;
                    break;
                case NodeStatus.IDLE:
                    throw new Error('A child node must never return IDLE');
            }
        }

        // The entire while loop completed. This means that all the children returned FAILURE.
        if (this.current_child_idx_ == children_count) {
            this.haltChildren();
            this.current_child_idx_ = 0;
        }

        return NodeStatus.FAILURE;
    }

    public halt() {
        this.current_child_idx_ = 0;
        super.halt();
    }
}
