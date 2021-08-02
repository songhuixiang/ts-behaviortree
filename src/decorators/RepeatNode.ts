/**
 * @brief The RepeatNode is used to execute a child several times, as long as it succeed.
 *
 * To succeed, the child must return SUCCESS N times (port "num_cycles").
 *
 * If the child returns FAILURE, the loop is stopped and this node returns FAILURE.
 */

import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

export class RepeatNode extends DecoratorNode<{}> {
    private num_cycles_: number;
    private try_index_: number;

    constructor(name: string, num_cycles: number) {
        super(name, {});
        this.num_cycles_ = num_cycles;
        this.try_index_ = 0;
        this.setRegistrationID('Repeat');
    }

    tick(): NodeStatus {
        this.setStatus(NodeStatus.RUNNING);

        while (this.try_index_ < this.num_cycles_ || this.num_cycles_ == -1) {
            const child_state = this.child().executeTick();

            switch (child_state) {
                case NodeStatus.SUCCESS:
                    {
                        this.try_index_++;
                        this.haltChild();
                    }
                    break;
                case NodeStatus.FAILURE: {
                    this.try_index_ = 0;
                    this.haltChild();
                    return NodeStatus.FAILURE;
                }
                case NodeStatus.RUNNING: {
                    return NodeStatus.RUNNING;
                }
                default: {
                    throw new Error('A child node must never return IDLE');
                }
            }
        }

        this.try_index_ = 0;
        return NodeStatus.SUCCESS;
    }

    halt() {
        this.try_index_ = 0;
        super.halt();
    }
}
