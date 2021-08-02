import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The RetryNode is used to execute a child several times if it fails.
 *
 * If the child returns SUCCESS, the loop is stopped and this node returns SUCCESS.
 *
 * If the child returns FAILURE, this node will try again up to N times
 * (N is read from port "num_attempts").
 *
 */
export class RetryNode extends DecoratorNode<{}> {
    private max_attempts_: number;
    private try_index_: number;

    constructor(name: string, max_attempts: number) {
        super(name, {});
        this.max_attempts_ = max_attempts;
        this.try_index_ = 0;
        this.setRegistrationID('RetryUntilSuccessful');
    }

    halt() {
        this.try_index_ = 0;
        super.halt();
    }

    tick(): NodeStatus {
        this.setStatus(NodeStatus.RUNNING);

        while (this.try_index_ < this.max_attempts_ || this.max_attempts_ == -1) {
            const child_state = this.child().executeTick();
            switch (child_state) {
                case NodeStatus.SUCCESS: {
                    this.try_index_ = 0;
                    this.haltChild();
                    return NodeStatus.SUCCESS;
                }
                case NodeStatus.FAILURE:
                    {
                        this.try_index_++;
                        this.haltChild();
                    }
                    break;
                case NodeStatus.RUNNING: {
                    return NodeStatus.RUNNING;
                }
                default: {
                    throw new Error('A child node must never return IDLE');
                }
            }
        }

        this.try_index_ = 0;
        return NodeStatus.FAILURE;
    }
}
