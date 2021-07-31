/**
 * @brief IfThenElseNode must have exactly 2 or 3 children. This node is NOT reactive.
 *
 * The first child is the "statement" of the if.
 *
 * If that return SUCCESS, then the second child is executed.
 *
 * Instead, if it returned FAILURE, the third child is executed.
 *
 * If you have only 2 children, this node will return FAILURE whenever the
 * statement returns FAILURE.
 *
 * This is equivalent to add AlwaysFailure as 3rd child.
 *
 *  first ? second : third
 */

import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

export class IfThenElseNode extends ControlNode<{}> {
    private child_idx_: number;

    constructor(name: string) {
        super(name, {});
        this.child_idx_ = 0;
        this.setRegistrationID('IfThenElse');
    }

    public tick(): NodeStatus {
        const children_count = this.children_nodes_.length;

        if (children_count != 2 && children_count != 3) {
            throw new Error('IfThenElseNode must have either 2 or 3 children');
        }

        this.setStatus(NodeStatus.RUNNING);

        if (this.child_idx_ == 0) {
            const condition_status = this.children_nodes_[0].executeTick();

            if (condition_status == NodeStatus.RUNNING) {
                return condition_status;
            } else if (condition_status == NodeStatus.SUCCESS) {
                this.child_idx_ = 1;
            } else if (condition_status == NodeStatus.FAILURE) {
                if (children_count == 3) {
                    this.child_idx_ = 2;
                } else {
                    return condition_status;
                }
            }
        }
        // not an else
        if (this.child_idx_ > 0) {
            const status = this.children_nodes_[this.child_idx_].executeTick();
            if (status == NodeStatus.RUNNING) {
                return NodeStatus.RUNNING;
            } else {
                this.haltChildren();
                this.child_idx_ = 0;
                return status;
            }
        }
        throw new Error('Something unexpected happened in IfThenElseNode');
    }

    public halt() {
        this.child_idx_ = 0;
        super.halt();
    }
}
