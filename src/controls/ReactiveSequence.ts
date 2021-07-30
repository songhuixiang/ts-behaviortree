import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

/**
 * @brief The ReactiveSequence is similar to a ParallelNode.
 * All the children are ticked from first to last:
 *
 * - If a child returns RUNNING, halt the remaining siblings in the sequence and return RUNNING.
 * - If a child returns SUCCESS, tick the next sibling.
 * - If a child returns FAILURE, stop and return FAILURE.
 *
 * If all the children return SUCCESS, this node returns SUCCESS.
 *
 * IMPORTANT: to work properly, this node should not have more than a single asynchronous child.
 */

/**
 *	Type of ControlNode		|	Child returns FAILURE	|	Child returns RUNNING
 *		Sequence			|	    Restart				|		Tick again
 *		ReactiveSequence	|		Restart				|		Restart
 *		SequenceStar		|		Tick again			|		Tick again
 */

export class ReactiveSequence extends ControlNode<{}> {
    constructor(name: string) {
        super(name, {});
    }

    public tick(): NodeStatus {
        let success_count = 0;
        let running_count = 0;

        for (let index = 0; index < this.childrenCount(); index++) {
            const current_child_node = this.children_nodes_[index];
            const child_status = current_child_node.executeTick();

            switch (child_status) {
                case NodeStatus.RUNNING:
                    running_count++;
                    for (let i = index + 1; i < this.childrenCount(); i++) {
                        this.haltChild(i);
                    }
                    return NodeStatus.RUNNING;
                case NodeStatus.FAILURE:
                    this.haltChildren();
                    return NodeStatus.FAILURE;
                case NodeStatus.SUCCESS:
                    success_count++;
                    break;
                case NodeStatus.IDLE:
                    throw new Error('A child node must never return IDLE');
            }
        }

        if (success_count === this.childrenCount()) {
            this.haltChildren();
            return NodeStatus.SUCCESS;
        }

        return NodeStatus.RUNNING;
    }
}
