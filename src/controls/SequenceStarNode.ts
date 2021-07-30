/**
 * @brief The SequenceStarNode is used to tick children in an ordered sequence.
 * If any child returns RUNNING, previous children are not ticked again.
 *
 * - If all the children return SUCCESS, this node returns SUCCESS.
 *
 * - If a child returns RUNNING, this node returns RUNNING.
 *   Loop is NOT restarted, the same running child will be ticked again.
 *
 * - If a child returns FAILURE, stop the loop and return FAILURE.
 *   Loop is NOT restarted, the same running child will be ticked again.
 *
 */

import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

/**
 *	Type of ControlNode		|	Child returns FAILURE	|	Child returns RUNNING
 *		Sequence			|	    Restart				|		Tick again
 *		ReactiveSequence	|		Restart				|		Restart
 *		SequenceStar		|		Tick again			|		Tick again
 */

export class SequenceStarNode extends ControlNode<{}> {
    private current_child_idx_: number;

    constructor(name: string) {
        super(name, {});
        this.current_child_idx_ = 0;
        this.setRegistrationID('SequenceStar');
    }

    public tick() {
        const children_count = this.children_nodes_.length;

        this.setStatus(NodeStatus.RUNNING);

        while (this.current_child_idx_ < children_count) {
            const current_child_node = this.children_nodes_[this.current_child_idx_];
            const child_status = current_child_node.executeTick();

            switch (child_status) {
                case NodeStatus.RUNNING:
                    return child_status;
                case NodeStatus.FAILURE:
                    // DO NOT reset current_child_idx_ on failure
                    for (let i = this.current_child_idx_; i < this.childrenCount(); i++) {
                        this.haltChild(i);
                    }
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

    public halt() {
        this.current_child_idx_ = 0;
        super.halt();
    }
}
